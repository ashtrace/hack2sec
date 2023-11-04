const express   = require('express');
const router    = express.Router();
const userDashboardController   = require('../../../controllers/stats/userDashboardController');

router.get('/', userDashboardController.handleUserDashboard);

module.exports = router;