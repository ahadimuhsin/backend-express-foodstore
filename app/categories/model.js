const mongoose = require('mongoose');
const {model, Schema} = mongoose;

let categorySchema = Schema({
    name: {
        type: String,
        minLength: [3, 'Panjang kategori minimal 3 karakter'],
        maxLength: [20, 'Panjang kategori maksimal 20 karakter'],
        required: [true, 'Nama kategori harus diisi']
    }
});

module.exports = model('Category', categorySchema);