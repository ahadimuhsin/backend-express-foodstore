const mongoose = require('mongoose');
const {model, Schema} = mongoose;

const invoiceSchema = Schema({
    sub_total: {
        type: Number,
        required: [true, 'Sub Total harus diisi']
    },

    delivery_fee: {
        type: Number,
        required: [true, 'Delivery Fee harus diisi']
    },
    delivery_address: {
        provinsi: {
            type: String,
            required: [true, 'Provinsi harus disii']
        },
        kabupaten: {
            type: String,
            required: [true, 'Kabupaten harus disii']
        },
        kecamatan: {
            type: String,
            required: [true, 'Kecamatan harus disii']
        },
        kelurahan: {
            type: String,
            required: [true, 'Kelurahan harus disii']
        },
        detail: {
            type: String
        }
    },

    total: {
        type: Number,
        required: [true, 'Total harus diisi']
    },

    payment_status: {
        type: String,
        enum: ['waiting_payment', 'paid'],
        default: 'waiting_payment'
    },

    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },

    order: {
        type: Schema.Types.ObjectId,
        ref: 'Order'
    }
}, {timestamps: true});

module.exports = model('Invoice', invoiceSchema);