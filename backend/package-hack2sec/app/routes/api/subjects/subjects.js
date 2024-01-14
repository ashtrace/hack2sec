const express           = require('express');
const router            = express.Router();
const subjectController = require('../../../controllers/subjects/subjectController');
const verifyJWT         = require('../../../middleware/verifyJWT');
const ROLES_LIST        = require('../../../config/rolesList');
const verifyRoles       = require('../../../middleware/verifyRoles');

router.route('/')
    .get(subjectController.getAllSubjects)
    .post(verifyJWT, verifyRoles(ROLES_LIST.admin, ROLES_LIST.faculty),subjectController.createNewSubject)
    .put(verifyJWT, verifyRoles(ROLES_LIST.admin, ROLES_LIST.faculty),subjectController.updateSubject)
    .delete(verifyJWT, verifyRoles(ROLES_LIST.admin), subjectController.deleteSubject);

router.route('/:id')
    .get(subjectController.getSubject);

module.exports = router;