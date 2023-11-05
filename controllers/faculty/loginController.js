const Faculty   = require('../../model/Faculty');
const bcrypt    = require('bcrypt');
const jwt       = require('jsonwebtoken');

const handleFacultyLogin = async (req, res) => {
    const { empId, password } = req.body;

    if (!empId || !password ) {
        return res.status(400).json({ 'message': 'Employee ID and password are required.' });
    }

    const foundFaculty = await Faculty.findOne({ empId: empId }).exec();

    if (!foundFaculty) {
        return res.status(401).json({ 'message': 'Incorrect username or password.' });
    }

    const match = await bcrypt.compare(password, foundFaculty.password);

    if (match) {
        role = foundFaculty.role;

        const accessToken = jwt.sign(
            {
                "UserInfo": {
                    "userId": foundFaculty._id,
                    "role": foundFaculty.role
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            /* TODO: Change the validaty back to 15m */
            { expiresIn: '5m' }
        );

        const refreshToken = jwt.sign(
            { "userId": foundFaculty._id },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d' }
        );

        foundFaculty.refreshToken = refreshToken;
        const result = await foundFaculty.save();

        /* Debug: Log the refresh token */
        console.log(result);

        /* Send refresh token to user as cookie.
         * TODO: Add 'SameSite' configuration for front-end. Add 'secure' for HTTPS
         */
        res.cookie('jwt', refreshToken, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });

        res.json({ accessToken });
    } else {
        res.status(401).json({ 'message': 'Incorrect username or password.' });
    }
}

module.exports = { handleFacultyLogin };