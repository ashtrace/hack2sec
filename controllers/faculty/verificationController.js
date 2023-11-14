const UnapprovedFaculty = require('../../model/UnapprovedFaculty');
const Faculty           = require('../../model/Faculty');
const mailController    = require('../email/mailController');
const bcrypt            = require('bcrypt');

const getAllUnapprovedFaculties = async (req, res) => {
    const faculties = await UnapprovedFaculty.find();
    if (!faculties) {
        return res.status(404).json({ 'message': 'No faculties to approve.' });
    }
    res.json(faculties);
}

function generatePassword() {
    const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let password = "";

    for (let i = 0; i < parseInt(process.env.FACULTY_PASSWORD_LENGTH); ++i) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        password += charset.charAt(randomIndex);
    }
    return password;
}

const handleVerification = async (req, res) => {
    try {
        const unapprovedFaculty = await UnapprovedFaculty.findById(req.params.facultyId);

        if (!unapprovedFaculty) {
            return res.status(400).json({ 'message': `No faculty exists with ID ${req.params.facultyId}` });
        }

        const password = generatePassword();
        const hashedPwd = await bcrypt.hash(password, 10);

        const approvedFaculty = await Faculty.create({
            "firstname": unapprovedFaculty.firstname,
            "lastname": unapprovedFaculty.lastname,
            "empId": unapprovedFaculty.empId,
            "email": unapprovedFaculty.email,
            "password": hashedPwd
        });

        /* Debug: Log the verfied faculty */
        console.log(approvedFaculty);

        /* Delete corresponding faculty entry from unapproved list */
        await UnapprovedFaculty.findByIdAndDelete(unapprovedFaculty._id);

        /* Send the password to the faculty */
        const subject = "Password for Hack2Sec Faculty Account.";
        const body = {
            text: `The password for ${approvedFaculty.firstname} ${approvedFaculty.lastname} (${approvedFaculty.empId}) is ${password}`,
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
                <p>The password for ${approvedFaculty.firstname} ${approvedFaculty.lastname} (${approvedFaculty.empId}) is <strong>${password}</strong>.</p>
                <p>Regards,</p>
                <p>Team Hack2Sec</p>
            </body>
            </html>
            `
       }
      
        const mailed = mailController.sendmail(approvedFaculty.email, subject, body);

        if (mailed) {
            return res.status(201).json({ 'message': `Faculty ${approvedFaculty.firstname} ${approvedFaculty.lastname} approved! Their password '${password}' is sent at ${approvedFaculty.email}.`});
        } else {
            return res.status(500).json({ 'message': `Failed to send password '${password} to ${approvedFaculty.email}.`});
        }

    } catch(err) {
        console.error(err);
        return res.sendStatus(500);
    }
}


const handleRejection = async (req, res) => {
    try {
        if (!req?.body?.faculty_id) {
            return res.status(400).json({ 'message': 'faculty_id is required.' });
        }

        const unapprovedFaculty = await UnapprovedFaculty.findById(req.body.faculty_id);

        if (!unapprovedFaculty) {
            return res.status(400).json({ 'message': `No faculty exists with ID ${req.body.faculty_id}` });
        }

        /* Send rejection mail to faculty */
        const subject = "Rejection of Hack2sec faculty registration request.";
        const body = {
            text: 'Your submission for Hack2Sec Faculty account has been rejected. Please contact administrator for further details.',
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
                <p>Your request for faculty account allocation with employee ID ${unapprovedFaculty.empId} has been rejected.</p>
                <p>Please contact your local campus Hack2Sec administrator for further details.</p>
                <p>Regards,</p>
                <p>Team Hack2Sec</p>
            </body>
            </html>
            `
        }

        const mailed = mailController.sendmail(unapprovedFaculty.email, subject, body);

        if (mailed) {
            await UnapprovedFaculty.findByIdAndDelete(unapprovedFaculty._id);
    
            return res.status(201).json({ 'message': `Rejection mail sent for ${unapprovedFaculty.firstname} ${unapprovedFaculty.lastname} at ${unapprovedFaculty.email}.` });
        } else {
            return res.status(500).json({ 'message': `Failed to send rejection mail for ${unapprovedFaculty.firstname} ${unapprovedFaculty.lastname} at ${unapprovedFaculty.email}` });
        }

    } catch (err) {
        console.error(err);
        return res.status(500).json({ 'message': 'Failed to reject faculty.' });
    }
}

module.exports = {
    getAllUnapprovedFaculties,
    handleVerification,
    handleRejection
}