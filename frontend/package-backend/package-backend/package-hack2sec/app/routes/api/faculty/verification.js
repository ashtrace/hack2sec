const express                   = require('express');
const router                    = express.Router();
const verificationController    = require('../../../controllers/faculty/verificationController');
const verifyRoles               = require('../../../middleware/verifyRoles');
const ROLES_LIST                = require('../../../config/rolesList');

router.route('/')
    .get(verifyRoles(ROLES_LIST.admin) ,verificationController.getAllUnapprovedFaculties)
    .delete(verifyRoles(ROLES_LIST.admin), verificationController.handleRejection);

router.get('/:facultyId', verifyRoles(ROLES_LIST.admin) ,verificationController.handleVerification);

module.exports = router;