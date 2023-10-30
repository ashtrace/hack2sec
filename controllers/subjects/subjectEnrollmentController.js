const User      = require('../../model/User');

const handleSubjectEnrollment = async (req, res) => {
    const username  = req.user;
    const subjects  = req.body.subjects;

    if (!subjects.length) {
        return res.status(400).json({ 'message': 'At least one subject required.' });
    }

    const founderUser = await User.findOne({ username: username }).exec();

    if (!founderUser) {
        return res.status(404).json({ 'message': 'User does not exist.' });
    }

    try {
        const newSubjects = [...new Set(founderUser.subjects.concat(subjects))];

        founderUser.subjects = newSubjects;

        const result = founderUser.save()
        
        return res.json(result);
    } catch (err) {
        console.error(err);
        return res.sendStatus(500);
    }
}

module.exports = { handleSubjectEnrollment };