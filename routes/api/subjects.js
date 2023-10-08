const express           = require('express');
const router            = express.Router();
const subjectController = require('../../controllers/subjectController');
const ROLES_LIST        = require('../../config/rolesList');
const verifyRoles       = require('../../middleware/verifyRoles');

router.route('/')
    .get(subjectController.getAllSubjects)
    .post(verifyRoles(ROLES_LIST.admin, ROLES_LIST.faculty),subjectController.createNewSubject)
    .put(verifyRoles(ROLES_LIST.admin, ROLES_LIST.faculty),subjectController.updateSubject)
    .delete(verifyRoles(ROLES_LIST.admin), subjectController.deleteSubject);

router.route('/:id')
    .get(subjectController.getSubject);

module.exports = router;