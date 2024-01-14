const User      = require('../../model/User');
const Faculty   = require('../../model/Faculty');
const Challenge = require('../../model/Challenge');
const Subject   = require('../../model/Subject');

const handleRegistrationCount = async (req, res) => {
    try {
        const userCount = await User.countDocuments();
        return res.json({ 'users': userCount });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ 'message': 'Failed to fetch user count.' });
    }
}

const handleFacultyCount = async (req, res) => {
    try {
        const facultyCount = await Faculty.countDocuments();
        return res.json({ 'faculties': facultyCount });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ 'mesage': 'Failed to fetch faculty count.' });
    }
}

const handleChallengeCount = async (req, res) => {
    try {
        const challengeCount = await Challenge.countDocuments();
        return res.json({ 'challenges': challengeCount });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ 'message': 'Failed to fetch challenge count.' });
    }
}

const handleSubjectCount = async (req, res) => {
    try {
        const subjectCount = await Subject.countDocuments();
        return res.json({ 'subjects': subjectCount });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ 'message': 'Failed to fetch subject count.' });
    }
}

module.exports = {
    handleRegistrationCount,
    handleFacultyCount,
    handleChallengeCount,
    handleSubjectCount
}