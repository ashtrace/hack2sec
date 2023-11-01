const express = require('express');
const router    = express.Router();
const fileController = require('../../../controllers/challenges/fileController');

router.get('/:etag', fileController.handleFileDownload);

module.exports = router;