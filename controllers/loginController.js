/* Simulating users database using json file, until MongoDB is UP */
const usersDB = {
    users: require('../model/users.json'),
    setUsers: function (data) {
        this.users = data
    }
}

const bcrypt = require('bcrypt');

const handleLogin = async (req, res) => {
    /* De-serialze username and password */
    const {user, pwd } = req.body;
    
    if (!user || !pwd) {
        return res.status(400).json({ 'message': 'Username and password required.'});
    }

    /* Check if username exists */
    const foundUser = usersDB.users.find(person => person.username === user);

    if (!foundUser) {
        /* HTTP 401: Unauthorized */
        return res.status(401).json( { 'message': 'Incorrect username or password.'});
    }

    /* Validate password */
    const match = await bcrypt.compare(pwd, foundUser.password);

    if (match) {
        res.json({ 'message': `User ${user} is logged in!`});
    } else {
        res.status(401).json( { 'message': 'Incorrect username or password.'});
    }
}

module.exports = { handleLogin };