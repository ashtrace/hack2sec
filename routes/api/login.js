const express       = require('express');
const router        = express.Router();
const loginHandler  = require('../../controllers/loginController');

router.post('/', loginHandler.handleLogin);

module.exports = router;