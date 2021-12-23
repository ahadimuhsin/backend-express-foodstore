const mongoose = require('mongoose');
const {model, Schema} = mongoose;
//library hashing dengan bcrypt
const bcrypt = require('bcrypt');
const HASH_ROUND = 10;
//library auto increment dengan mongodb
const AutoIncrement = require('mongoose-sequence')(mongoose);

let userSchema = Schema ({
    full_name : {
        type: String,
        required: [true, 'Nama harus diisi'],
        minlength : [3, 'Panjang nama minimal 3 karakter'],
        maxlength: [255, 'Panjang nama maksimal 255 karakter']
    },
    customer_id: {
        type: Number
    },
    email: {
        type: String,
        required: [true, 'Email harus diisi'],
        maxlength: [255, 'Panjang email maksimal 255 karakter']
    },
    password: {
        type: String,
        required: [true, 'Password harus diisi'],
        minlength : [6, 'Panjang password minimal 6 karakter'],
        maxlength: [255, 'Panjang password maksimal 255 karakter']
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    token: [String]
}, {timestamps: true});
//validasi email valid
userSchema.path('email').validate(function(value){
    //regex email
    const EMAIL_RE = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;

    //test email, hasilnya true atau false
    //jika true, validasi berhasil
    //jika false, validasi gagal
    return EMAIL_RE.test(value);
}, attr => `${attr.value} harus merupakan email yang valid!`);

//validasi apakah email sudah terdaftar di collection/belum
//gunakan async karena akan melakukan operasi pencarian
userSchema.path('email').validate(async function(value){
    try{
        //hitung ada berapa email yg sama dari model User
        const count = await this.model('User').count({email: value});

        return !count;
    }
    catch(err)
    {
        throw err;
    }
}, attr => `${attr.value} sudah terdaftar`);

//ubah plain password jadi bentuk hash
userSchema.pre('save', function(next){
    this.password = bcrypt.hashSync(this.password, HASH_ROUND);
    next();
});

//set customer_id jadi autoincrement
userSchema.plugin(AutoIncrement, {inc_field: 'customer_id'});

module.exports = model('User', userSchema);