/* routes for web-root directory i.e. '/' */

const express       = require('express');
const router        = express.Router();
const path          = require('path')

router.get('^/$|/index(.html)?', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'index.html'));
    //res.sendFile(path.resolve('views/index.html'));
})

router.get('/login(.html)?', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'login.html'));
})

router.get('/logout(.html)?', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'logout.html'));
})

module.exports = router;