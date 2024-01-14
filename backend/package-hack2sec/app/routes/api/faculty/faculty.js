const express           = require('express');
const router            = express.Router();
const facultyController = require('../../../controllers/faculty/facultyController');
const verifyRoles       = require('../../../middleware/verifyRoles');
const ROLES_LIST        = require('../../../config/rolesList');

router.route('/')
    .get(facultyController.getAllFaculties)
    .put(verifyRoles(ROLES_LIST.faculty), facultyController.updateFacultyDetails)
    .delete(verifyRoles(ROLES_LIST.faculty), facultyController.deleteFaculty);

router.get('/:faculty_id', facultyController.getFacultyDetails)

module.exports = router;