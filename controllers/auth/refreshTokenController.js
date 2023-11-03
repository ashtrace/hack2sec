const User  = require('../../model/User');
const jwt   = require('jsonwebtoken');

const handleRefreshToken = async (req, res) => {
    const cookies = req.cookies;
    
    if (!cookies?.jwt) {
        /* JWT Cookie does not exist, return Unauthorized */
        return res.sendStatus(401);
    }

    const refreshToken = cookies.jwt;

    const foundUser = await User.findOne({ refreshToken }).exec();
    if (!foundUser) {
        /* Refersh Token might be tampered with, return Forbidden */
        return res.sendStatus(403);
    }

    /* Validate refresh token */
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
        if (err || foundUser._id.toString() !== decoded.userId) {
            return res.sendStatus(403);
        }

        const role = foundUser.role;
        const accessToken = jwt.sign({
            "UserInfo": {
                "userId":foundUser._id,
                "role": role
            }
        }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
        res.json({ accessToken });
    });
}

module.exports = { handleRefreshToken };