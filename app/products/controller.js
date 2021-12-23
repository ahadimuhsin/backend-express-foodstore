//import model product
const Product = require("./model");
const Category = require("../categories/model");
const Tag = require("../tags/model");
const config = require("../config");
const fs = require("fs");
const path = require("path");
const {policyFor} = require('../policy/index');

//menyimpan product baru
async function store(req, res, next) {
  try {
    // Cek policy
    let policy = policyFor(req.user);

    if(!policy.can('create', 'Product')){
      return res.json({
        error: 1,
        message: `Anda tidak memiliki akses untuk membuat produk`
      });
    }

    //tangkap data form yang dikirimkan oleh client
    let payload = req.body;
    //kalo di dalam request ada atribut kategori
    if (payload.category) {
      let category = await Category.findOne({
        name: { $regex: payload.category, $options: "i" },
      });

      if (category) {
        payload = { ...payload, category: category._id };
      } else {
        delete payload.category;
      }
    }

    if (payload.tags && payload.tags.length) {
      let tags = await Tag.find({ name: { $in: payload.tags } });
      //cek apakah tags ada isinya
      if (tags.length) {
        //jika ada, ambil _id untuk masing2 Tag dan gabungkan dengan payload
        payload = { ...payload, tags: tags.map((tag) => tag._id) };
      }
    }

    if (req.file) {
      //lokasi sementara file
      let tmp_path = req.file.path;
      //ambil ekstensi file
      let original_ext =
        req.file.originalname.split(".")[
          req.file.originalname.split(".").length - 1
        ];
      //buat custom name
      let file_name = req.file.filename + "." + original_ext;
      //lokasi tujuan file upload
      let target_path = path.resolve(
        config.rootPath,
        `public/upload/${file_name}`
      );

      //baca file yang ada di lokasi sementara
      const src = fs.createReadStream(tmp_path);

      //pindahkan ke lokasi tujuan
      const dest = fs.createWriteStream(target_path);

      //pindahkan file dari src ke dest
      src.pipe(dest);

      src.on("end", async () => {
        //ambil payload yg ada imagenya
        let product = new Product({ ...payload, image_url: file_name });
        //simpan product yang baru dibuat ke MongoDB
        await product.save();

        //retur respon ke client dengan data product yg baru dibuat
        return res.json(product);
      });
      src.on("error", async () => {
        next(err);
      });
    } else {
      //buat product baru dari payload
      let product = new Product(payload);

      //simpan product yang baru dibuat ke MongoDB
      await product.save();

      //retur respon ke client dengan data product yg baru dibuat
      return res.json(product);
    }
  } catch (err) {
    //   Cek Tipe Error
    if (err && err.name === "ValidationError") {
      return res.json({
        error: 1,
        message: err.message,
        fields: err.errors,
      });
    }
    next(err);
  }
}

//melihat list product
async function index(req, res, next) {
  try {
    let { limit = 10, skip = 0, q = "", category = "", tags = [] } = req.query;

    let criteria = {};

    if (q.length) {
      //gabungkan dengan criteria
      criteria = {
        ...criteria,
        name: { $regex: `${q}`, $options: "i" },
      };
    }

    if (category.length) {
      category = await Category.findOne({
        name: { $regex: `${category}` },
        $options: "i",
      });

      if(category){
          criteria = {...criteria, category: category._id}
      }
    }

    if(tags.length){
        tags = await Tag.find({name: {$in: tags}});

        criteria = {...criteria, tags: {$in: tags.map(tag => tag._id)}}
    }

    let products = await Product.find(criteria)
      .limit(parseInt(limit))
      .skip(parseInt(skip))
      .populate("category")
      .populate("tags");
    
      //get total produk
    let count = await Product.find(criteria).countDocuments();

    return res.json({data: products, count});
  } catch (err) {
    next(err);
  }
}
//mengupdate product
async function update(req, res, next) {
  try {
     // Cek policy
    let policy = policyFor(req.user);

    if(!policy.can('update', 'Product')){
      return res.json({
        error: 1,
        message: `Anda tidak memiliki akses untuk mengupdate produk`
      });
    }
    //get params id
    // let _id = mongoose.Types.ObjectId(req.params.id);;
    //tangkap data form yang dikirimkan oleh client
    let payload = req.body;

    if (payload.category) {
      let category = await Category.findOne({
        name: { $regex: payload.category, $options: "i" },
      });

      if (category) {
        payload = { ...payload, category: category._id };
      } else {
        delete payload.category;
      }
    }

    if (payload.tags && payload.tags.length) {
      let tags = await Tag.find({ name: { $in: payload.tags } });
      //cek apakah tags ada isinya
      if (tags.length) {
        //jika ada, ambil _id untuk masing2 Tag dan gabungkan dengan payload
        payload = { ...payload, tags: tags.map((tag) => tag._id) };
      }
    }

    if (req.file) {
      //lokasi sementara file
      let tmp_path = req.file.path;
      //ambil ekstensi file
      let original_ext =
        req.file.originalname.split(".")[
          req.file.originalname.split(".").length - 1
        ];
      //buat custom name
      let file_name = req.file.filename + "." + original_ext;
      //lokasi tujuan file upload
      let target_path = path.resolve(
        config.rootPath,
        `public/upload/${file_name}`
      );

      //baca file yang ada di lokasi sementara
      const src = fs.createReadStream(tmp_path);

      //pindahkan ke lokasi tujuan
      const dest = fs.createWriteStream(target_path);

      //pindahkan file dari src ke dest
      src.pipe(dest);

      src.on("end", async () => {
        //ambil data product berdasarkan ID
        let product = await Product.findOne({ _id: req.params.id });

        //ambil path lengkap ke tempat penyimpanan file berdasarkan image_url
        let currentImage = `${config.rootPath}/public/upload/${product.image_url}`;

        //cek apakah file ada di file system
        if (fs.existsSync(currentImage)) {
          //hapus jika ada
          fs.unlinkSync(currentImage);
        }

        //update produk berdasarkan _id
        product = await Product.findOneAndUpdate(
          { _id: req.params.id },
          { ...payload, image_url: file_name },
          { new: true, runValidators: true }
        );
        //simpan product yang baru dibuat ke MongoDB
        await product.save();

        //retur respon ke client dengan data product yg baru dibuat
        return res.json(product);
      });
      src.on("error", async () => {
        next(err);
      });
    } else {
      //ambil id product yang ingin diedit
      let product = await Product.findOneAndUpdate(
        { _id: req.params.id },
        payload,
        { new: true, runValidators: true }
      );
      console.log(req.params.id);

      //simpan product yang baru dibuat ke MongoDB
      await product.save();

      //retur respon ke client dengan data product yg baru dibuat
      return res.json(product);
    }
  } catch (err) {
    //   Cek Tipe Error
    if (err && err.name === "ValidationError") {
      return res.json({
        error: 1,
        message: err.message,
        fields: err.errors,
      });
    }
    next(err);
  }
}
//menghapus product
async function destroy(req, res, next) {
  try {
     // Cek policy
    let policy = policyFor(req.user);

    if(!policy.can('delete', 'Product')){
      return res.json({
        error: 1,
        message: `Anda tidak memiliki akses untuk menghapus produk`
      });
    }

    let product = await Product.findOneAndDelete({ _id: req.params.id });

    //ambil path lengkap ke tempat penyimpanan file berdasarkan image_url
    let currentImage = `${config.rootPath}/public/upload/${product.image_url}`;
    //cek apakah file ada di file system
    if (fs.existsSync(currentImage)) {
      //hapus jika ada
      fs.unlinkSync(currentImage);
    }
    return res.json({
      title: "success",
      message: "Product deleted successfully",
    });
  } catch (err) {
    next(err);
  }
}
module.exports = {
  store,
  index,
  update,
  destroy,
};
