/* routes for web-root directory i.e. '/' */

const express       = require('express');
const router        = express.Router();
const path          = require('path')
const verifyJWT     = require('../middleware/verfiyJWT');

router.route('^/$|index(.html)?')
    .get((req, res) => {
        res.sendFile(path.join(__dirname, '..', 'views', 'index.html'));
    });

router.route('/dashboard(.html)?')
    .get(verifyJWT, (req, res) => {
        res.sendFile(path.join(__dirname, '..', 'views', 'dashboard.html'));
    });

module.exports = router;