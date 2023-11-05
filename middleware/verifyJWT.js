const jwt   = require('jsonwebtoken');
const User  = require('../model/User');

const verifyUser = async userId => {
    const foundUser =  await User.findOne({ _id: userId }).exec();
    if (foundUser) return true;
    return false;
}

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
        async (err, decoded) => {
            try {
                if (await verifyUser(decoded.UserInfo.userId)) {
                    req.userId  = decoded.UserInfo.userId;
                    req.role    = decoded.UserInfo.role;
                    next();
                } else {
                    /* Token may be corrupted or tampered with, return 'Forbidden' */
                    return res.status(403).json({ 'message': 'Invalid access token.' });
                }
            } catch (err) {
                console.error(err);
                return res.status(403).json({ 'message': 'Invalid access token.' });
            }
        }
    )
}

module.exports = verifyJWT;