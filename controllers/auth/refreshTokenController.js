const User      = require('../../model/User');
const Faculty   = require('../../model/Faculty');
const jwt       = require('jsonwebtoken');

const handleRefreshToken = async (req, res) => {
    const cookies = req.cookies;
    
    if (!cookies?.jwt) {
        /* JWT Cookie does not exist, return Unauthorized */
        return res.status(401).json({ 'message': 'refresh token cookie does not exist.' });
    }

    const refreshToken = cookies.jwt;

    const foundUser = await User.findOne({ refreshToken }).exec();
    const foundFaculty = await Faculty.findOne({ refreshToken }).exec();

    if (foundUser) {
        /* Validate refresh token */
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
            if (err || foundUser._id.toString() !== decoded.userId) {
                return res.status(403).json({ 'messge': 'Cookie possibly tampered.' });
            }

            const accessToken = jwt.sign({
                "UserInfo": {
                    "userId": foundUser._id,
                    "role": foundUser.role
                }
            }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
            res.json({ accessToken });
        });
    } else if (foundFaculty) {
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
            if (err || foundFaculty._id.toString() !== decoded.userId) {
                return res.status(403).json({ 'message': 'Cookie possibly tampered.' });
            }

            const accessToken = jwt.sign({
                "UserInfo": {
                    "userId": foundFaculty._id,
                    "role": foundFaculty.role
                }
            }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
            res.json({ accessToken });
        });
    } else {
        return res.status(403).json({ 'message': 'Cookie possibly tampered.' });
    }
}

module.exports = { handleRefreshToken };