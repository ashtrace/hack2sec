const jwt   = require('jsonwebtoken');

require('dotenv').config();

const verifyJWT = (req, res, next) => {
    /* Fetch authorization HTTP Header */
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.sendStatus(401);
    }
    /* Debug: log authorization token */
    console.log(authHeader);

    /* Validate the access token */
    const token = authHeader.split(' ')[1];
    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            if (err) {
                /* Token may be corrupted or tampered with, return 'Forbidden' */
                return res.sendStatus(403);
            }
            req.user = decoded.username;
            next();
        }
    )
}

module.exports = verifyJWT;