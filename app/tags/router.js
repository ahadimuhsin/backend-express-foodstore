//import router
const router = require('express').Router();

//import multer
const multer = require('multer');

//import tag controller
const tagController = require('./controller');

//buat route baru
router.post('/tags', multer().none(), tagController.store);
router.put('/tags/:id', multer().none(), tagController.update);
router.delete('/tags/:id', tagController.destroy);

module.exports = router;