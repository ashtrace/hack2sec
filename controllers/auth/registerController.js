const User      = require('../../model/User');
const bcrypt    = require('bcrypt'); /* To hash passwords */

const handleNewUser = async (req, res) => {
    /* De-serialze username and password */
    const {user, pwd } = req.body;
    
    if (!user || !pwd) {
        return res.status(400).json({ 'message': 'Username and password required.'});
    }

    /* Check for duplicate usernames in database */
    const duplicate = await User.findOne({ username: user }).exec();
    if (duplicate) {
        /* HTTP 409: Conflict */
        return res.sendStatus(409);
    }

    try {
        /* Hash the password */
        const hashedPwd = await bcrypt.hash(pwd, 10);
        
        /* Store the new user */
        const result = await User.create({
            "username": user,
            "password": hashedPwd
        });

        /* Debug: Log the result */
        console.log(result);

        return res.status(201).json( { 'message': `New user ${user} created!`})
    } catch(err) {
        res.status(500).json({ 'message': err.message });
    }
}

module.exports = { handleNewUser };