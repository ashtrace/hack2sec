const User                      = require('../../model/User');
const Subject                   = require('../../model/Subject');
const bcrypt                    = require('bcrypt');
const { emailDuplicateChacker, emailDuplicateChecker } = require('../email/duplicateController');

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}, 'firstname lastname username roleNo points');
        if (!users || users.length === 0) {
            return res.status(204).json({ 'message': 'No users found.' });
        }
        return res.json(users);
    } catch(err) {
        console.error(err);
        return res.status(500).json({ 'message': 'Failed to retrieve user details.' });
    }
}

const getUserDetails = async (req, res) => {
    if(!req.params.user_id) {
        return res.status(400).json({ 'message': 'User id is required.' });
    }

    try {
        const user = await User.findById(req.params.user_id);
        if (!user) {
            return res.status(400).json({ 'message': `No user exists with id ${req.params.user_id}` });
        }

        let subjects = []
        if (user.subjects.length > 0) {
            for (const subject_id of user.subjects) {
                const foundSubject = await Subject.findById(subject_id);
                subjects.push(`${foundSubject.name} ${foundSubject.subjectCode}`);
            }
        }

        const result = {
            firstname: user.firstname,
            lastname: user.lastname,
            username: user.username,
            email: user.email,
            rollNo: user.rollNo,
            branch: user.branch,
            year: user.year,
            points: user.points,
            subjects: subjects
        }

        return res.json(result);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ 'message': `Failed to retrieve user details for ID: ${req.params.user_id}` });
    }
}

const updateUserDetails = async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(400).json({ 'message': `No user exists with ID` });
        }

        user.firstname  = req.body.firstname || user.firstname;
        user.lastname   = req.body.lastname || user.lastname;
        user.branch     = req.body.branch || user.branch;
        user.year       = req.body.year || user.year;
        
        if (req.body.email) {
            if (await emailDuplicateChecker(req.body.email)) {
                return res.status(409).json({ 'message': `${req.body.email} already used.` });
            }
            user.email = req.body.email;
        }

        if (req.body.subjects && req.body.subjects.length > 0) {
            for (const subject_id of req.body.subjects) {
                const foundSubject = await Subject.findById(subject_id);
                if (!foundSubject) {
                    return res.status(400).json({ 'message': `No subject exists with ID: ${subject_id}` });
                }
            }
            user.subjects = req.body.subjects;
        }        

        if (req.body.password) {
            user.password = await bcrypt.hash(req.body.password, 10);
        }

        await user.save();

        return res.status(201).json({ 'message': 'Updated user details.' });
    } catch(err) {
        console.error(err);
        return res.status(500).json({ 'message': `Failed to update user ID: ${req.userId}` });
    }
}

const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(400).json({ 'message': `No user exists with ID: ${req.userId}` });
        }

        await User.deleteOne({ _id: req.userId });

        return res.json({ 'message': `Deleted user ${user.firstname} ${user.lastname}` });
    } catch(err) {
        console.error(err);
        return res.status(500).json({ 'message': 'Failed to delete user.' });
    }
}

module.exports = {
    getAllUsers,
    getUserDetails,
    updateUserDetails,
    deleteUser
}