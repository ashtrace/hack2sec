const express           = require('express');
const router            = express.Router();
const loginController   = require('../../../controllers/faculty/loginController');

router.post('/', loginController.handleFacultyLogin);

module.exports = router;