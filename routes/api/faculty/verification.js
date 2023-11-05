const express   = require('express');
const router    = express.Router();
const verificationController    = require('../../../controllers/faculty/verificationController');

router.get('/', verificationController.getAllUnapprovedFaculties);
router.get('/:facultyId', verificationController.handleVerification);

module.exports = router;