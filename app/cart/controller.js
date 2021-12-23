const CartItem = require('../cart-item/model');
const Product = require('../products/model');
const config = require('../config');
const { policyFor } = require('../policy');

async function update(req, res, next)
{
    let policy = policyFor(req.user);
    if(!policy.can('update', 'Cart'))
    {
        return res.json({
            error: 1,
            message: `You are not allowed to perform this action`
        });
    }

    try {
        
    //get req ID
    const {items} = req.body;

    //ekstrak _id dari masing2 item
    const products_id = items.map(item => item._id);

    //cari data produk di MongoDB sebagai products
    const products = await Product.find({_id : {$in: products_id}});

    //cari relate product dari product berdasarkan product._id dan item._id
    let cartItems = items.map(item => {
        let relatedProduct = products.find(product => 
            product._id.toString() === item._id);
            //return cart item sebagai objek
        return {
            _id: relatedProduct._id,
            product: relatedProduct._id,
            price: relatedProduct.price,
            image_url: relatedProduct.image_url,
            name: relatedProduct.name,
            user: req.user._id,
            qty: item.qty
        }
    });

    //hapus terlebih dahulu semua item yg ada di cartItem
    // await CartItem.deleteMany({
    //     user: req.user._id
    // });

    await CartItem.bulkWrite(cartItems.map(item => {
        return {
            updateOne: {
                filter: {user: req.user._id, product: item.product},
                update: item,
                upsert: true
            }
        }
    }));

    return res.json(cartItems);

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

//list keranjang
async function index(req, res, next)
{
    let policy = policyFor(req.user);

    if(!policy.can('read', 'Cart'))
    {
        return res.json({
            error: 1,
            message: `You are not allowed to perform this action`
        });
    }

    try {
        //cari item dari mongodb berdasarkan user
        let items = await CartItem.find({user: req.user._id})
        .populate('product');

        return res.json(items);
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
    update,
    index
}