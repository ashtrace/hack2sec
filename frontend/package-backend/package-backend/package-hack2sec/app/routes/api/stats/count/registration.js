const express           = require('express');
const router            = express.Router();
const countController   = require('../../../../controllers/stats/countController');
const ROLES_LIST        = require('../../../../config/rolesList');
const verifyRoles       = require('../../../../middleware/verifyRoles');

router.get('/', verifyRoles(ROLES_LIST.admin), countController.handleRegistrationCount);

module.exports = router;