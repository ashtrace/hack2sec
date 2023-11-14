const UnapprovedFaculty = require('../../model/UnapprovedFaculty');
const ApprovedFaculty   = require('../../model/Faculty');
const User              = require('../../model/User');

const handleNewFaculty = async (req, res) => {
    const {firstname, lastname, empId, email} = req.body;

    if (!firstname || !lastname || !empId || !email) {
        return res.status(400).json({ 'message': 'Firstname, Lastname, Employee ID and E-mail are required.'});
    }

    let duplicateUnapproved = await UnapprovedFaculty.findOne({ empId: empId }).exec();

    if (duplicateUnapproved) {
        return res.status(409).json({ 'message': `${empId} already submitted for verfication as user: ${duplicateUnapproved.firstname} ${duplicateUnapproved.lastname}.` });
    }

    duplicateUnapproved = await UnapprovedFaculty.findOne({ email: email }).exec();
    if (duplicateUnapproved) {
        return res.status(409).json({ 'message': `${email} already submitted for verfication as user: ${duplicateUnapproved.firstname} ${duplicateUnapproved.lastname}.` });
    }

    let duplicateApproved = await ApprovedFaculty.findOne({ empId: empId }).exec();
    
    if (duplicateApproved) {
        return res.status(409).json({ 'message': `${empId} already registered as user: ${duplicateApproved.firstname} ${duplicateApproved.lastname}.` });
    }

    duplicateApproved = await ApprovedFaculty.findOne({ email: email }).exec();
    if (duplicateApproved) {
        return res.status(409).json({ 'message': `${email} already registered for user: ${duplicateApproved.firstname} ${duplicateApproved.lastname}.` });
    }
    
    const duplicateUser = await User.findOne({ email: email }).exec();
    if (duplicateUser) {
        return res.status(409).json({ 'message': `User with email: ${duplicateUser.email} already exists.` });
    }

    try {
        const result = await UnapprovedFaculty.create({
            "firstname": firstname,
            "lastname": lastname,
            "empId": empId,
            "email": email,
            "subject": req.body.subject || null
        });

        /* Debug: Log the result */
        console.log(result);

        return res.status(201).json({ 'message': `New faculty "${firstname} ${lastname}" submited for verification.`});
    } catch (err) {
        console.error(err);
        return res.sendStatus(500);
    }
}

module.exports = { handleNewFaculty };