//import model product
const Category = require("./model");
const config = require("../config");

//menyimpan kategori baru
async function store(req, res, next){
    try{
         // Cek policy
        let policy = policyFor(req.user);

        if(!policy.can('create', 'Category')){
            return res.json({
                error: 1,
                message: `Anda tidak memiliki akses untuk membuat kategori`
            });
        }

        //tangkap payload dari request
        let payload = req.body;

        //buat kategori baru dengan model Category
        let category = new Category(payload);

        //simpan
        await category.save();

        //return response dengan data category yg baru dibuat
        return res.json(category);
    }
    catch(err){
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

//mengupdate kategori
async function update(req, res, next){
    try{
        //tangkap payload dari request
        let payload = req.body;

        //buat kategori baru dengan model Category
        let category = await Category.findOneAndUpdate({_id: req.params.id}, payload, {
            new: true, runValidators: true
        });

        //return response dengan data category yg baru dibuat
        return res.json(category);
    }
    catch(err){
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

//hapus kategori
async function destroy(req, res, next) {
    try {
         // Cek policy
         let policy = policyFor(req.user);

         if(!policy.can('delete', 'Category')){
             return res.json({
                 error: 1,
                 message: `Anda tidak memiliki akses untuk menghapus kategori`
             });
         }

        let categories = await Category.findOneAndDelete({ _id: req.params.id });
        return res.json({
            title: 'success',
            message: 'Product deleted successfully',
            data: categories
        });
    } catch (err) {
        next(err);
    }
}
//list kategori
async function index(req, res, next) {
    try {
        let { limit = 10, skip = 0 } = req.query;

        let categories =
            await Category
            .find()
            .limit(parseInt(limit))
            .skip(parseInt(skip));

        return res.json(categories);
    } catch (err) {
        next(err);
    }
}

module.exports = {
    store,
    update,
    destroy,
    index
}