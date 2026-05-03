const express = require('express');
const router = express.Router();
const { uploadMiddleware, uploadFiles, uploadText } = require('../controllers/uploadController');

router.post('/', uploadMiddleware, uploadFiles);
router.post('/text', uploadText);

module.exports = router;
