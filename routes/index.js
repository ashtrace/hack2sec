const express       = require('express');
const router        = express.Router({ caseSensitive: true });
const path          = require('path')

router.get('/', (req, res) => {
    return res.sendFile(path.resolve('views/index.html'));
})

module.exports = router;