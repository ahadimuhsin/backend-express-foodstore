//import router dari express
const router = require('express').Router();
const multer = require('multer');
const os = require('os');

//import product controller
const productController = require('./controller');
//membuat multer yg menerima gambar dengan nama request 'image'
const multer_image_store_products = multer({ dest: os.tmpdir() }).single('image');
//pasangkan route endpoint dengan method store
router.post('/products', multer_image_store_products, productController.store);
router.get('/products', productController.index);
router.put('/products/:id', multer_image_store_products, productController.update);
router.delete('/products/:id', productController.destroy);

module.exports = router