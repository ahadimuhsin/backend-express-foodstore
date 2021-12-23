const router = require('express').Router();
const multer = require('multer');

//import controller
const OrderController = require('./controller');

//routes
router.post('/orders', multer().none(), OrderController.store);
router.get('/orders', OrderController.index);


module.exports = router;