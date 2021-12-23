const DeliveryAddress = require('./model');
const {policyFor} = require('../policy');
const {subject} = require('@casl/ability');

async function index(req, res, next)
{
    const policy = policyFor(req.user);

    //cek policynya dulu
    if(!policy.can('view', 'DeliveryAddress'))
    {
        return res.json({
            error: 1,
            message: `You are not allowed to perform this action`
        });
    }

    try {
        //untuk pagination
        let {limit = 10, skip = 0} = req.query;

        //baca berapa jumlah data alamat pengiriman yang dimiliki oleh user yg
        //sedang login
        const count = await DeliveryAddress.find({user: req.user._id})
        .countDocuments();

        //get data alamat pengiriman
        const deliveryAddress = await DeliveryAddress.find({user: req.user._id})
        .limit(parseInt(limit))
        .skip(parent(skip))
        .sort({createdAt: 'desc'});

        return res.json({
            data: deliveryAddress,
            count: count
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

async function store(req, res, next)
{
    let policy = policyFor(req.user);
    if(!policy.can('create', 'DeliveryAddress')){
        return res.json({
            error: 1,
            message: `You are not allowed to perform this action`
        });
    }

    try {
        let payload = req.body;
        let user = req.user;

        //buat instance DeliveryAddress
        let address = new DeliveryAddress({...payload, user: user._id});

        //simpan ke db
        await address.save();

        //return json
        return res.json(address);
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

async function update(req, res, next)
{
    let policy = policyFor(req.user);

    try {
        //get id dari req.params
        let {id} = req.params;

        //buat payload dan keluarkan _id
        let {_id, ...payload} = req.body;

        //ambil data address
        let address = await DeliveryAddress.findOne({_id: id});

        let subjectAddress = subject('DeliveryAddress', 
        {...address, user_id: address.user});

        if(!policy.can('update', subjectAddress)){
            return res.json({
                error: 1,
                message: `You are not allowed to perform this action`
            });
        }

        //update ke MongoDB
        address = await DeliveryAddress.findOneAndUpdate({_id: id}, payload,
            {new: true});

        return res.json(address);
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

async function destroy(req, res, next)
{
    let policy = policyFor(req.user);

    try {
        let {id} = req.params;
        //cari address yang mau dihapus
        let address = await DeliveryAddress.findOne({_id: id});
        //buat subject address untuk liat policynya
        let subjectAddress = subject({...address, user: address.user});

        if(!policy.can('delete', subjectAddress))
        {
            return res.json({
                error: 1,
                message: `You are not allowed to delete this resource`
            });
        }

        //proses hapus
        await DeliveryAddress.findOneAndDelete({_id: id});

        //response ke client
        return res.json(address);
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

module.exports ={
    store,
    update,
    destroy,
    index
}