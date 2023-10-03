/* Simulating users database using json file, until MongoDB is UP */
const usersDB = {
    users: require('../model/users.json'),
    setUsers: function (data) {
        this.users = data
    }
}

const fsPromises    = require('fs').promises;
const path          = require('path');

const handleLogout = async (req, res) => {
    /* TODO: delete access token from client end (frontend task) */
    const cookies = req.cookies;
    
    if (!cookies?.jwt) {
        /* JWT Cookie does not exist, return No Content */
        return res.sendStatus(204);
    }

    const refreshToken = cookies.jwt;

    const foundUser = usersDB.users.find(person => person.refreshToken === refreshToken);
    if (!foundUser) {
        /* Cookie not found in database, clear the cookies */
        res.clearCookie('jwt', { httpOnly: true });
        return res.sendStatus(204);
    }

    /* Delete refresh token from database */
    const otherUsers = usersDB.users.filter(person => person.refreshToken !== foundUser.refreshToken);
    const currentUser = { ...foundUser, refreshToken: '' };
    usersDB.setUsers([...otherUsers, currentUser]);

    await fsPromises.writeFile(path.join(__dirname, '..', 'model', 'users.json'), JSON.stringify(usersDB.users));

    res.clearCookie('jwt', { httpOnly: true });

    res.sendStatus(204);
}

module.exports = { handleLogout };