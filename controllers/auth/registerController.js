const User                      = require('../../model/User');
const { emailDuplicateChecker } = require('../../controllers/email/duplicateController');
const bcrypt                    = require('bcrypt'); /* To hash passwords */

const handleNewUser = async (req, res) => {
    if ( !req?.body?.firstname || !req?.body?.lastname || !req?.body?.username || !req?.body?.password || !req?.body?.email || !req?.body?.roll_no || !req?.body?.branch || !req?.body?.year) {
        return res.status(400).json({ 'message': 'firstname, lastname, username, password, email, roll_no, branch and year are required.'});
    }

    const {firstname, lastname, username, password, email, roll_no, branch, year } = req.body;

    /* Check for duplicates in database */
    let duplicate = await User.findOne({ username: username }).exec();
    if (duplicate) {
        return res.status(409).json({ 'message': `User with username ${username} already exists.` });
    }

    duplicate = await User.findOne({ rollNo: roll_no }).exec();
    if (duplicate) {
        return res.status(409).json({ 'message': `User with roll ${duplicate.rollNo} already exists.` });
    }

    if (await emailDuplicateChecker(email)) {
        return res.status(409).json({ 'message': `${email} already used.` });
    }

    try {
        /* Hash the password */
        const hashedPwd = await bcrypt.hash(password, 10);
        
        /* Store the new user */
        const result = await User.create({
            "firstname": firstname,
            "lastname": lastname,
            "username": username,
            "password": hashedPwd,
            "email": email,
            "rollNo": roll_no,
            "branch": branch,
            "year": year
        });

        /* Debug: Log the result */
        console.log(result);

        return res.status(201).json({ 'message': `New user ${username} created!`})
    } catch(err) {
        console.error(err);
        res.sendStatus(500);
    }
}

module.exports = { handleNewUser };