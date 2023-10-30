const express                       = require('express');
const router                        = express.Router();
const subjectEnrollmentController   = require('../../../controllers/subjects/subjectEnrollmentController');

router.post('/', subjectEnrollmentController.handleSubjectEnrollment);

module.exports = router;