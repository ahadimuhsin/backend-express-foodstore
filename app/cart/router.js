const router = require('express').Router();
const multer = require('multer');
//import controller
const cartController = require('./controller');

router.put('/carts', multer().none(), cartController.update);
router.get('/carts', cartController.index);

module.exports = router;