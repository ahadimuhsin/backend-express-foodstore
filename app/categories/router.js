const router = require('express').Router();

//multer untuk menerima data dalam bentuk form-data
const multer = require('multer');

//import category controller
const categoryController = require('./controller');

//list endpoint
router.post('/categories', multer().none(), categoryController.store);
router.put('/categories/:id', multer().none(), categoryController.update);
router.delete('/categories/:id', categoryController.destroy);
router.get('/categories', categoryController.index);

module.exports = router;