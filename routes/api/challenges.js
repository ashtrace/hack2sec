const express               = require('express');
const router                = express.Router();
const challengeController   = require('../../controllers/challengeController');
const ROLES_LIST            = require('../../config/rolesList');
const verifyRoles           = require('../../middleware/verifyRoles');

router.route('/')
    .get(challengeController.getAllChallenges)
    .post(verifyRoles(ROLES_LIST.admin, ROLES_LIST.faculty), challengeController.createNewChallenge)
    .put(verifyRoles(ROLES_LIST.admin, ROLES_LIST.faculty), challengeController.updateChallege)
    .delete(verifyRoles(ROLES_LIST.admin), challengeController.deleteChallenge);

router.route('/:id')
    .get(challengeController.getChallenge);

module.exports = router;