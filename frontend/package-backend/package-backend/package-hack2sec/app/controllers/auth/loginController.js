const User      = require('../../model/User');
const Faculty   = require('../../model/Faculty');
const bcrypt    = require('bcrypt');
const jwt       = require('jsonwebtoken');

const handleLogin = async (req, res) => {
    /* De-serialze username and password */
    const { username, password } = req.body;
    
    if (!username || !password) {
        return res.status(400).json({ 'message': 'Username and password required.'});
    }

    /* Check if username exists */
    const foundUser = await User.findOne({ username: username }).exec();
    const foundFaculty = await Faculty.findOne({ empId: username }).exec();

    let user = null;
    if (!foundUser && !foundFaculty) {   
        /* HTTP 401: Unauthorized */
        return res.status(401).json({ 'message': 'Incorrect username or password.'});
    } else if (foundUser) {
        user = foundUser;
    } else if (foundFaculty) {
        user = foundFaculty;
    }

    /* Validate password */
    const match = await bcrypt.compare(password, user.password);

    if (match) {
        /* Derive RBAC values for the user */
        role = user.role;

        /* Create JWT access token for the user session */
        const accessToken = jwt.sign(
            {
                "UserInfo": {
                    "userId": user._id,
                    "role": user.role
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            /* TODO: Change the validaty back to 15m */
            { expiresIn: '1d' }
        );

        /* Create JWT refresh token for the user session */
        const refreshToken = jwt.sign(
            { "userId": user._id },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d' }
        );

        /* Store the refresh token in DB */
        user.refreshToken = refreshToken;
        const result = await user.save();

        /* Debug: log the refresh token */
        console.log(result)

        /* Send refersh token to user as cookie.
         * TODO: Add 'SameSite' configuration for front-end. Add 'secure' for HTTPS
         */
        // res.cookie('jwt', refreshToken, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });

        /* Send access token to user in response body */
        res.json({ accessToken });
    } else {
        res.status(401).json({ 'message': 'Incorrect username or password.' });
    }
}

module.exports = { handleLogin };