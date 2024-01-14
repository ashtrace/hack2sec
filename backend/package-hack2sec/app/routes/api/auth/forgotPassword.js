const express       = require('express');
const router        = express.Router();
const passwordController    = require('../../../controllers/auth/passwordController');

router.post('/', passwordController.handleForgotPassword);
router.post('/:token', passwordController.handleResetPassword);

module.exports = router