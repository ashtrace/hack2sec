const jwt   = require('jsonwebtoken');

const verifyJWT = (req, res, next) => {
    /* Fetch authorization HTTP Header */
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader?.startsWith('Bearer ')) {
        return res.sendStatus(401);
    }

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
            req.user    = decoded.UserInfo.username;
            req.roles   = decoded.UserInfo.roles;
            next();
        }
    )
}

module.exports = verifyJWT;