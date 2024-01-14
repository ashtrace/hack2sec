const Faculty                   = require('../../model/Faculty');
const Subject                   = require('../../model/Subject');
const bcrypt                    = require('bcrypt');
const { emailDuplicateChecker } = require('../email/duplicateController');

const getAllFaculties = async (req, res) => {
    try {
        const faculties = await Faculty.find({}, '-__v -refreshToken -password -role');
        if (!faculties || faculties.length === 0) {
            return res.status(204).json({ 'message': 'No faculties found.' });
        }
        return res.json(faculties);
    } catch(err) {
        console.error(err);
        return res.status(500).json({ 'message': 'Failed to retrieve faculty details.' });
    }
}

const getFacultyDetails = async (req, res) => {
    if (!req.params.faculty_id) {
        return res.status(400).json({ 'message': 'Faculty Id is required.' });
    }

    try {
        const faculty = await Faculty.findById(req.params.faculty_id);
        if (!faculty) {
            return res.status(400).json({ 'message': `No faculty exists with ID ${req.params.faculty_id}` });
        }

        let subject = null;
        if (faculty.subject) {
            const foundSubject = await Subject.findById(faculty.subject);
            subject = `${foundSubject.name} ${foundSubject.subjectCode}`;
        }

        const result = {
            firstname: faculty.firstname,
            lastname: faculty.lastname,
            empId: faculty.empId,
            email: faculty.email,
            subject: subject,
            subject_id: faculty.subject
        }

        return res.json(result);
        
    } catch (err) {
        console.error(err);
        return res.status(500).json({ 'message': `Failed to retrieve faculty details for ID ${req.params.faculty_id}.` });
    }
}

const updateFacultyDetails = async (req, res) => {
    try {
        const faculty = await Faculty.findById(req.userId);
        if (!faculty) {
            return res.status(400).json({ 'message': `No faculty exists with ID ${req.userId}` });
        }

        faculty.firstname   = req.body.firstname || faculty.firstname;
        faculty.lastname    = req.body.lastname || faculty.lastname;
        
        if (req.body.email) {
            if (await emailDuplicateChecker(req.body.email)) {
                return res.status(409).json({ 'message': `${req.body.email} already used.` });
            }
            faculty.email = req.body.email;
        }

        if (req.body.subject) {
            const subject = await Subject.findById(req.body.subject);
            if (!subject) {
                return res.status(400).json({ 'message': `No subject exists with ID ${req.body.subject}` });
            }
            faculty.subject = req.body.subject;
        }

        if (req.body.password) {
            faculty.password = await bcrypt.hash(req.body.password, 10);
        }

        await faculty.save();

        return res.status(201).json({ 'message': 'Updated faculty details.' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ 'message': `Failed to update faculty details for ID ${req.userId}.` });
    }
}

const deleteFaculty = async (req, res) => {
    try {
        const faculty = await Faculty.findById(req.userId);
        if (!faculty) {
            return res.status(400).json({ 'message': `No faculty exists with ID ${req.userId}` });
        }

        await Faculty.deleteOne({ _id: req.userId });

        return res.json({ 'message': `Delete faculty '${faculty.firstname} ${faculty.lastname}'.` });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ 'message': 'Failed to delete faculty.' });
    }
}

module.exports = {
    getAllFaculties,
    getFacultyDetails,
    updateFacultyDetails,
    deleteFaculty
}