const User                      = require('../../model/User');
const { emailDuplicateChecker } = require('../../controllers/email/duplicateController');
const mailController            = require('../email/mailController');
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

        const subject = "Welcome to Hack2Sec.";
        const body = {
            text: `You've successfully registered on Hack2Sec as ${username}.`,
            html: `
            <html>
            <head>
                <style>
                p {
                    margin: 0;
                    padding: 0;
                }
                </style>
            </head>
            <body>
                <p>Greetings,</p>
                <p>You've successfully registered on Hack2Sec as ${username}. Please log-in with your registered username and password to access the platform.</p>
                <p>Regards,</p>
                <p>Team Hack2Sec</p>
            </body>
            </html>
            `
        }

        const mailed = mailController.sendmail(email, subject, body);

        if (mailed) {    
            return res.status(201).json({ 'message': `New user ${username} created!`})
        } else {
            return res.status(500).json({ 'message': `Failed to send mail for ${firstname} ${lastname} at ${email}` });
        }
    } catch(err) {
        console.error(err);
        res.sendStatus(500);
    }
}

module.exports = { handleNewUser };