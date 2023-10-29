const express = require('express');
const router    = express.Router();
const fileController = require('../../controllers/fileController');

router.route('/:filename')
    .get(fileController.handleFileDownload);

module.exports = router;