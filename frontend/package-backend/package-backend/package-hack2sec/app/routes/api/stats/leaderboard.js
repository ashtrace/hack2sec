const express               = require('express');
const router                = express.Router();
const leaderboardController = require('../../../controllers/stats/leaderboardController');

router.get('/', leaderboardController.handleLeaderboard);

module.exports = router;