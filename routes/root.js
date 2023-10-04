/* routes for web-root directory i.e. '/' */

const express       = require('express');
const router        = express.Router();
const path          = require('path')
const verifyJWT     = require('../middleware/verifyJWT');
const ROLES_LIST    = require('../config/rolesList');
const verfiyRoles   = require('../middleware/verifyRoles');

router.route('^/$|index(.html)?')
    .get((req, res) => {
        res.sendFile(path.join(__dirname, '..', 'views', 'index.html'));
    });

router.route('/dashboard(.html)?')
    .get(verifyJWT, (req, res) => {
        res.sendFile(path.join(__dirname, '..', 'views', 'dashboard.html'));
    });


router.route('/upload(.html)?')
    .get(verifyJWT, verfiyRoles(ROLES_LIST.admin, ROLES_LIST.faculty), (req, res) => {
        res.sendFile(path.join(__dirname, '..', 'views', 'upload.html'));
    });

router.route('/admin(.html)?')
    .get(verifyJWT, verfiyRoles(ROLES_LIST.admin), (req, res) => {
        res.sendFile(path.join(__dirname, '..', 'views', 'admin.html'));
    })

module.exports = router;