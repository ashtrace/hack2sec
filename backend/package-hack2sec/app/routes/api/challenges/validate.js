const express           = require('express');
const router            = express.Router();
const flagController    = require('../../../controllers/challenges/flagController');

router.post('/', flagController.handleFlagValidation);

module.exports = router;