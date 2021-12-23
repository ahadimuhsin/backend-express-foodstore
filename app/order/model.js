const mongoose = require('mongoose');
const {model, Schema} = mongoose;
//library auto increment dengan mongodb
const AutoIncrement = require('mongoose-sequence')(mongoose);
//model invoice
const Invoice = require('../invoice/model');

const orderSchema = Schema({
    status: {
        type: String,
        enum: ['waiting_payment', 'processing', 'in_delivery', 'delivered'],
        default: 'waiting_payment'
    },
    delivery_fee: {
        type: Number,
        default: 0
    },

    // order_number: {
    //     type: Number
    // },

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
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },

    order_items: {
        type: Schema.Types.ObjectId,
        ref: 'OrderItem'
    }
}, {timestamps: true});
//set order_number sebagai auto increment
orderSchema.plugin(AutoIncrement, {inc_field: 'order_number'});

//virtual field, hanya ada di level Mongoose
//menghitung total item yang ada dan total item yg didapatkan dari order_items,
//kemudian masing2 ambil qty lalu jumlahkan semuanya
orderSchema.virtual('items_count').get(function(){
    return this.order_items.reduce((total, item) => {
        return total + parseInt(item.qty)
    }, 0)
});

//menggunakan hook post-save dalam membuat invoice
orderSchema.post('save', async function()
{
    //lakukan proses pembuatan invoice

    //1 htiung sub total
    let sub_total = this.order_items
    .reduce((sum, item) => sum += (item.price * item.qty), 0);

    //2 buat objek invoice baru
    let invoice = new Invoice({
        user : this.user,
        order: this._id,
        sub_total: sub_total,
        delivery_fee: parseInt(this.delivery_fee),
        total: parseInt(sub_total + this.delivery_fee),
        delivery_address: this.delivery_address
    });

    await invoice.save();
});

module.exports = model('Order', orderSchema);