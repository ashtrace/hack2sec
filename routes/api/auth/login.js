const express       = require('express');
const router        = express.Router();
const loginHandler  = require('../../../controllers/auth/loginController');

router.post('/', loginHandler.handleLogin);

module.exports = router;