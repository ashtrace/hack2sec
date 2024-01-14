const express               = require('express');
const router                = express.Router();
const fileUpload            = require('express-fileupload');
const fileController        = require('../../../controllers/challenges/fileController');
const verifyRoles           = require('../../../middleware/verifyRoles');
const ROLES_LIST            = require('../../../config/rolesList');
const verifyFilePayload     = require('../../../middleware/verifyFilePayload');

router.post('/', fileUpload({ createParentPath: true }), verifyRoles(ROLES_LIST.admin, ROLES_LIST.faculty), verifyFilePayload,fileController.handleFileUpload);

module.exports = router;