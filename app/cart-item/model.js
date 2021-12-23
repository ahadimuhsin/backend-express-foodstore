const mongoose = require('mongoose');
const {model, Schema} = mongoose;

//buat skema Cart Item
const cartItemSchema = Schema({
    name: {
        type: String,
        minlength : [4, 'Panjang nama makanan minimal 3 karakter'],
        required: [true, 'Nama makanan harus diisi']
    },
    qty: {
        type: Number,
        required: [true, 'Quantity harus diisi'],
        min: [1, 'Minimal Quantity adalah 1']
    },
    price: {
        type: Number,
        default: 0
    },
    image_url: String,
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    product: {
        type: Schema.Types.ObjectId,
        ref: 'Product'
    }
});

module.exports = model('CartItem', cartItemSchema);