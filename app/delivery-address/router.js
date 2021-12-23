const router = require('express').Router();

//multer untuk menerima data dalam bentuk form-data
const multer = require('multer');

//import category controller
const addressController = require('./controller');

//list endpoint
router.post('/delivery-addresses', multer().none(), addressController.store);
router.put('/delivery-adresses/:id', multer().none(), addressController.update);
router.delete('/delivery-address/"id', addressController.destroy);
router.get('/delivery-addresses', addressController.index);
module.exports = router;