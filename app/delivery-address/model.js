const mongoose = require('mongoose');
const {model, Schema} = mongoose;

const deliveryAddressSchema = Schema({
    nama: {
        type: String,
        required: [true, 'Alamat harus diisi'],
        maxLength: [255, 'Panjang maksimal Alamat adalah 255 karakter']
    },
    kelurahan: {
        type: String,
        required: [true, 'Kelurahan harus diisi'],
        maxLength: [255, 'Panjang maksimal Kelurahan adalah 255 karakter']
    },
    kecamatan: {
        type: String,
        required: [true, 'Kecamatan harus diisi'],
        maxLength: [255, 'Panjang maksimal Kecamatan adalah 255 karakter']
    },
    kabupaten: {
        type: String,
        required: [true, 'Kabupaten harus diisi'],
        maxLength: [255, 'Panjang maksimal Kabupaten adalah 255 karakter']
    },
    provinsi: {
        type: String,
        required: [true, 'Provinsi harus diisi'],
        maxLength: [255, 'Panjang maksimal Provinsi adalah 255 karakter']
    },
    detail: {
        type: String,
        required: [true, 'Detail alamat harus diisi'],
        maxLength: [10000, 'Panjang maksimal detail alamat adalah 10000 karakter']
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}, {timestamps: true});

module.exports = model('DeliveryAddress', deliveryAddressSchema);