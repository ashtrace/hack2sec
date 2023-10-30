const express               = require('express');
const router                = express.Router();
const fileUpload            = require('express-fileupload');
const fileController        = require('../../../controllers/challenges/fileController');
const verifyFilePayload     = require('../../../middleware/verifyFilePayload');

router.post('/', fileUpload({ createParentPath: true }), verifyFilePayload,fileController.handleFileUpload);

module.exports = router;
