const Invoice = require('./model');
const {policyFor} = require('../policy');
const {subject} = require('@casl/ability');

async function show(req, res, next)
{
    try {
        // ambil order_id dari params
        let {order_id} = req.params;

        //ambil data invoice berdasarkan order_id
        let invoice = await Invoice.findOne({order: order_id})
        .populate('order')
        .populate('user');

        //ambil policy user yang sedang login
        let policy = policyFor(req.user);

        let subjectInvoice = subject('Invoice', {...invoice, user_id: invoice.user._id});

        //cek apakah policy mengizinkan untuk membuat order
        if(!policy.can('read', subjectInvoice))
        {
            return res.json({
                error: 1,
                message: `You are not allowed to perform this action`
            });
        }
        
        return res.json(invoice);
    } catch (err) {
        if (err && err.name === "ValidationError") {
            return res.json({
                error: 1,
                message: 'Terjadi kesalahan dalam mengambil invoice',
                // fields: err.errors,
            });
        }
        next(err);
    }
}

module.exports = {
    show
}