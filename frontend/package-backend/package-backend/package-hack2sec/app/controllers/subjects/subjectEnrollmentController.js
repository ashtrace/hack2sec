const User      = require('../../model/User');
const Subject  = require('../../model/Subject');

const handleSubjectEnrollment = async (req, res) => {
    const subjects  = req.body.subjects;

    /* Validate if subjects are provided */
    if (!subjects.length) {
        return res.status(400).json({ 'message': 'At least one subject required.' });
    }

    try {
        const notFoundSubjects = [];
        for (const subject of subjects) {
        const foundSubject = await Subject.findOne({ _id: subject }).exec();
            if (!foundSubject) {
                notFoundSubjects.push(subject);
            }
        }
        
        if (notFoundSubjects.length > 0) {
            return res.status(404).json({ message: `Subjects not found: ${notFoundSubjects.join(', ')}` });
        }

        const foundUser = await User.findOne({_id : req.userId }).exec();

        const newSubjects = [...new Set(foundUser.subjects.concat(subjects))];

        foundUser.subjects = newSubjects;

        const result = foundUser.save()
        
        return res.json({ 'message': 'Added subjects to user' });
    } catch (err) {
        console.error(err);
        return res.status(500).jso({ 'message': 'Failed to enroll user to given subjects.' });
    }
}

module.exports = { handleSubjectEnrollment };