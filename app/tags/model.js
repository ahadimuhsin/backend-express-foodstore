//import mongoose
const mongoose = require('mongoose');

//create model dan schema
const {model, Schema} = mongoose;

//buat schema
const tagSchema = Schema({
    name: {
        type: String,
        minLength: [3, 'Panjang nama tag minimal 3 karakter'],
        maxLength: [20, 'Panjang nama tag maksimal 20 karakter'],
        required: [true, 'Nama Tag harus diisi']
    }
});

module.exports = model('Tag', tagSchema)