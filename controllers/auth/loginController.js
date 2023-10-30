const User      = require('../../model/User');
const bcrypt    = require('bcrypt');
const jwt       = require('jsonwebtoken');

const handleLogin = async (req, res) => {
    /* De-serialze username and password */
    const {user, pwd } = req.body;
    
    if (!user || !pwd) {
        return res.status(400).json({ 'message': 'Username and password required.'});
    }

    /* Check if username exists */
    const foundUser = await User.findOne({ username: user }).exec();

    if (!foundUser) {
        /* HTTP 401: Unauthorized */
        return res.status(401).json( { 'message': 'Incorrect username or password.'});
    }

    /* Validate password */
    const match = await bcrypt.compare(pwd, foundUser.password);

    if (match) {
        /* Derive RBAC values for the user */
        role = foundUser.role;

        /* Create JWT access token for the user session */
        const accessToken = jwt.sign(
            {
                "UserInfo": {
                    "username":foundUser.username,
                    "role": role
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '5m' }
        );

        /* Create JWT refresh token for the user session */
        const refreshToken = jwt.sign(
            { "username":foundUser.username },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d' }
        );

        /* Store the refresh token in DB */
        foundUser.refreshToken = refreshToken;
        const result = await foundUser.save();

        /* Debug: log the refresh token */
        console.log(result)

        /* Send refersh token to user as cookie.
         * TODO: Add SameSite configuration for front-end
         */
        res.cookie('jwt', refreshToken, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 })

        /* Send access token to user in response body */
        res.json({ accessToken });
    
    } else {
        res.status(401).json( { 'message': 'Incorrect username or password.'});
    }
}

module.exports = { handleLogin };