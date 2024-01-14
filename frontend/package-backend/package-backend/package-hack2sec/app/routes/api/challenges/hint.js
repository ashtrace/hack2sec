const express           = require('express');
const router            = express.Router();
const hintController    = require('../../../controllers/challenges/hintController');

router.get('/:challenge_id', hintController.handleHint);

module.exports = router;