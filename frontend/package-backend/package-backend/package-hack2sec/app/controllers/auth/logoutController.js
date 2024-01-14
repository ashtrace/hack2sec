const User = require('../../model/User');

const handleLogout = async (req, res) => {
    /* TODO: delete access token from client end (frontend task) */

    const cookies = req.cookies;
    
    if (!cookies?.jwt) {
        /* JWT Cookie does not exist, return No Content */
        return res.sendStatus(204);
    }

    const refreshToken = cookies.jwt;

    const foundUser = await User.findOne({ refreshToken }).exec();
    if (!foundUser) {
        /* Cookie not found in database, clear the cookies */
        res.clearCookie('jwt', { httpOnly: true });
        return res.sendStatus(204);
    }

    /* Delete refresh token from database */
    foundUser.refreshToken = '';
    const result = await foundUser.save();

    /* Debug: log the deletion of refreshToken */
    console.log(result);

    res.clearCookie('jwt', { httpOnly: true });

    res.sendStatus(204);
}

module.exports = { handleLogout };