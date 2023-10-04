/* Simulating users database using json file, until MongoDB is UP */
const usersDB = {
    users: require('../model/users.json'),
    setUsers: function (data) {
        this.users = data
    }
}

const jwt           = require('jsonwebtoken');

const handleRefreshToken = (req, res) => {
    const cookies = req.cookies;
    
    if (!cookies?.jwt) {
        /* JWT Cookie does not exist, return Unauthorized */
        return res.sendStatus(401);
    }

    const refreshToken = cookies.jwt;

    const foundUser = usersDB.users.find(person => person.refreshToken === refreshToken);
    if (!foundUser) {
        /* Refersh Token might be tampered with, return Forbidden */
        return res.sendStatus(403);
    }

    const roles = Object.values(foundUser.roles);

    /* Validate refresh token */
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
        if (err || foundUser.username !== decoded.username) {
            return res.sendStatus(403);
        }
        const accessToken = jwt.sign(            {
            "UserInfo": {
                "username":foundUser.username,
                "roles": roles
            }
        }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '5m' });
        res.json({ accessToken });
    });
}

module.exports = { handleRefreshToken };