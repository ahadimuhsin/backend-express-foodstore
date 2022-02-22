const mongoose = require('mongoose');
const Order = require('./model');
const OrderItem = require('../order-item/model');
const CartItem = require('../cart-item/model');
const DeliveryAddress = require('../delivery-address/model');
const {policyFor} = require('../policy');
const {subject} = require('@casl/ability');

async function store(req, res, next)
{
    //ambil policy user yang sedang login
    let policy = policyFor(req.user);

    //cek apakah policy mengizinkan untuk membuat order
    if(!policy.can('create', 'Order'))
    {
        return res.json({
            error: 1,
            message: `You are not allowed to perform this action`
        });
    }
    try {
        //tangkap delivery fee dan delivery address
        let {delivery_fee, delivery_address} = req.body;

        //ambil cart
        let items = await CartItem.find({user: req.user._id})
        .populate('product');

        //cek cart
        if(!items.length)
        {
            return res.json({
                error: 1,
                message: `Can not create order because you have no items in cart`
            });
        }

        //ambil alamat
        let address = await DeliveryAddress.findOne({_id: delivery_address});

        //buat objek order baru
        let order = new Order({
            _id : new mongoose.Types.ObjectId(),
            status: 'waiting_payment',
            delivery_fee,
            delivery_address: {
                provinsi: address.provinsi,
                kabupaten: address.kabupaten,
                kecamatan: address.kecamatan,
                kelurahan: address.kelurahan,
                detail: address.detail,
            },
            user: req.user._id
        });

        //simpan orderItems
        let orderItems = await OrderItem.insertMany(
            items.map(item => ({
                ...item,
                name: item.product.name,
                qty: parseInt(item.qty),
                price: parseInt(item.product.price),
                order: order._id,
                product: item.product._id
            })
        ));

        //relasikan order ke order_items
        orderItems.forEach(item => order.order_items.push(item));

        //simpan order
        await order.save();

        //hapus cart yang sudah diorder
        await CartItem.deleteMany({user: req.user._id});

        return res.json(order);
    } catch (err) {
        if (err && err.name === "ValidationError") {
            return res.json({
                error: 1,
                message: err.message,
                fields: err.errors,
            });
        }
        next(err);
    }
}

async function index(req, res, next)
{
    //ambil policy user yang sedang login
    let policy = policyFor(req.user);

    //cek apakah policy mengizinkan untuk membuat order
    if(!policy.can('view', 'Order'))
    {
        return res.json({
            error: 1,
            message: `You are not allowed to perform this action`
        });
    }

    try {
        //set limit dan skip untuk query
        let {limit = 10, skip = 0} = req.query;
        //hitung total order yang dilakukan user yg sedang login
        let count = await Order.find({user: req.user._id})
        .countDocuments();

        //ambil data order orderBy createdAt desc
        let orders = await Order.find({user:req.user._id})
        .limit(parseInt(limit))
        .skip(parseInt(skip))
        .populate('order_items')
        .sort('-createdAt');

        //response ke client
        return res.json({
            //tampilkan juga field virtual
            data: orders.map(order => order.toJSON({virtuals: true})),
            count
        });
    } catch (err) {
        if (err && err.name === "ValidationError") {
            return res.json({
                error: 1,
                message: err.message,
                fields: err.errors,
            });
        }
        next(err);
    }
}

module.exports = {
    store,
    index
}