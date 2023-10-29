const express               = require('express');
const router                = express.Router();
const fileUpload            = require('express-fileupload');
const fileController        = require('../../controllers/fileController');
const verifyFilePayload     = require('../../middleware/verifyFilePayload');

router.route('/')
    .post(fileUpload({ createParentPath: true }), verifyFilePayload,fileController.handleFileUpload);

module.exports = router;
