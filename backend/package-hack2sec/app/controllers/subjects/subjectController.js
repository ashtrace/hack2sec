const Subject = require('../../model/Subject');

const getAllSubjects = async (req, res) => {
    const subjects = await Subject.find();
    if (!subjects) {
        return res.status(404).json({ "message": "No subjects found." });
    }
    res.json(subjects);
}

const createNewSubject = async (req, res) => {
    if (!req?.body?.name || !req?.body?.subject_code) {
        return res.status(400).json({ "message": "Name and subject code are required." });
    }

    const duplicate = await Subject.findOne({ subjectCode: req.body.subject_code }).exec();
    if (duplicate) {
        /* HTTP 409: Conflict */
        return res.sendStatus(409);
    }

    try {
        const result = await Subject.create({
            name: req.body.name,
            subjectCode: req.body.subject_code,
            syllabus: req.body.syllabus || null
        });
        
        res.status(201).json(result);
    } catch (err) {
        console.error(err);
    }
    
}

const updateSubject = async (req, res) => {
    if (!req?.body?.id) {
        return res.status(400).json({ "message": "ID parameter required." });
    }

    const subject = await Subject.findById(req.body.id);
    if (!subject) {
        return res.status(404).json({ "message": `Subject ID ${req.body.id} not found`});
    }

    if (req.body?.name) {
        subject.name = req.body.name;
    }
    if (req.body?.subject_code) {
        subject.subjectCode = req.body.subject_code;
    }
    if (req.body?.syllabus) {
        subject.syllabus = req.body.syllabus;
    }

    const result = await subject.save();

    res.json(result);
}

const deleteSubject = async (req, res) => {
    if (!req?.body?.id) {
        return res.status(400).json({ "message": "ID parameter required." });
    }

    const subject = await Subject.findById(req.body.id);

    if (!subject) {
        return res.status(404).json({ "message": `Subject ID ${req.body.id} not found.` });
    }

    const result = await Subject.findByIdAndDelete(req.body.id);

    res.json(result);
}

const getSubject = async (req, res) => {
    if (!req?.params?.id) {
        return res.status(400).json({ "message": "ID parameter required." });
    }

    const subject = await Subject.findOne({ _id: req.params.id }).exec();

    if (!subject) {
        return res.status(404).json({ "message": `Subject ID ${req.params.id} not found.` });
    }

    res.json(subject);
}

module.exports = {
    getAllSubjects,
    createNewSubject,
    updateSubject,
    deleteSubject,
    getSubject
}