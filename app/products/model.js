const mongoose = require("mongoose");
//ambil model dan skema dari paket mongoose
const { model, Schema } = mongoose;

//buat schema
const productSchema = Schema(
  {
    name: {
      type: String,
      minlength: [3, "Panjang nama minimal 3 karakter"],
      maxlength: [255, "Panjang nama makanan maksimal 255 karakter"],
      required: [true, "Nama produk harus diisi"],
    },
    description: {
      type: String,
      maxlength: [1000, "Panjang deskripsi maksimal 1000 karakter"],
    },
    price: {
      type: Number,
      default: 0,
    },
    image_url: String,
    category:{
      type: Schema.Types.ObjectId,
      ref: 'Category'
    },
    tags: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Tag'
      }
    ]
  },
  {
    timestamps: true,
  }
);
//buat model
Product = model('Product', productSchema);

//export model tersebut
module.exports = Product;