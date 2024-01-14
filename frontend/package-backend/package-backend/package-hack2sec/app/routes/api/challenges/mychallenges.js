const express               = require('express');
const router                = express.Router();
const challengeController   = require('../../../controllers/challenges/challengeController');
const verfiyRoles           = require('../../../middleware/verifyRoles');
const ROLES_LIST            = require('../../../config/rolesList');

router.get('/', verfiyRoles(ROLES_LIST.admin, ROLES_LIST.faculty), challengeController.getCreatedChallenges);

module.exports = router;