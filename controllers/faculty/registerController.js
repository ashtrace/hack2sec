const UnapprovedFaculty = require('../../model/UnapprovedFaculty');

const handleNewFaculty = async (req, res) => {
    const {firstname, lastname, empId, email} = req.body;

    if (!firstname || !lastname || !empId || !email) {
        return res.status(400).json({ 'message': 'Firstname, Lastname, Employee ID and E-mail are required.'});
    }

    const duplicate = await UnapprovedFaculty.findOne({ empId: empId }).exec();

    if (duplicate) {
        return res.sendStatus(409);
    }

    try {
        const result = await UnapprovedFaculty.create({
            "firstname": firstname,
            "lastname": lastname,
            "empId": empId,
            "email": email
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