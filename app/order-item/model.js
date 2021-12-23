const mongoose = require('mongoose');
const {model, Schema} = mongoose;

const orderItemSchema = Schema({
    name: {
        type: String,
        minlength: [5, 'Panjang nama makanan minimal 50 karakter'],
        required: [true, 'Nama makanan harus diisi']
    },

    price: {
        type: Number,
        required: [true, 'Harga makanan harus diisi']
    },

    qty: {
        type: Number,
        required: [true, 'Jumlah makanan harus diisi'],
        min: [1, 'Jumlah makanan minimal 1']
    },

    product: {
        type :Schema.Types.ObjectId,
        ref: 'Product'
    },

    order: {
        type :Schema.Types.ObjectId,
        ref: 'Order'
    },
});

module.exports = model('OrderItem', orderItemSchema);