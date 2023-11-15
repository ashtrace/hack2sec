const express           = require('express');
const router            = express.Router();
const userController    = require('../../../controllers/users/userController');

router.route('/')
    .get(userController.getAllUsers)
    .put(userController.updateUserDetails)
    .delete(userController.deleteUser);

router.get('/:user_id', userController.getUserDetails);

module.exports = router;