const Challenge                 = require('../../model/Challenge');
const Subject                   = require('../../model/Subject');
const { deleteFile }    = require('./fileController');
const bcrypt                    = require('bcrypt');

const getAllChallenges = async (req, res) => {
    const challenges = await Challenge.find({}, '-flag -hint -__v');
    if (!challenges) {
        return res.status(404).json({ 'message': 'No challenges found.' });
    }
    res.json(challenges);
}

const createNewChallenge = async (req, res) => {
    if (!req?.body?.name || !req?.body?.points || !req?.body?.category || !req?.body?.flag || !req?.body?.subject_id || (!req?.body?.url && !req?.body?.filename)) {
        return res.status(400).json({ 'message': 'Name, points, category, flag, subject_id and either of url or filename are required.' });
    }

    if (req.body.hint && !req.body?.hint_enabled) {
        return res.status(400).json({ 'message': 'hint_enabled value is required if hint is provided.' });
    }

    const duplicate = await Challenge.findOne({ name: req.body.name }).exec();
    if (duplicate) {
        return res.status(409).json({ 'message': `Challenge with name ${duplicate.name} already exists.`});
    }

    try {
        const foundSubject = await Subject.findById(req.body.subject_id);
        const subject = `${foundSubject.name} (${foundSubject.subjectCode})`;

        hashedFlag = await bcrypt.hash(req.body.flag, 10);
        const result = await Challenge.create({
            name: req.body.name,
            points: req.body.points,
            category: req.body.category,
            flag: hashedFlag,
            subjectId: req.body.subject_id,
            subject: subject,
            description: req.body.description || null,
            attachments: {
                url: req.body.url || null,
                files: req.body.filename || null
            },
            hintEnabled: req.body.hint_enabled || false,
            hint: req.body.hint || null,
            topic: req.body.topic || null,
            resource: req.body.resource || null
        });

        return res.status(201).json({ 'message': `New challenge ${result.name} created.`});
    } catch (err) {
        console.error(err);
        return res.status(500).json({ 'message': 'Challenge creation failed!' });
    }
}

const updateChallege = async (req, res) => {
    if (!req?.body?.challenge_id) {
        return res.status(400).json({ 'message': 'challenge_id parameter required.' });
    }

    if (req.body.hint && !req.body?.hint_enabled) {
        return res.status(400).json({ 'message': 'hint_enabled value is required if hint is provided.' });
    }

    if (req?.body?.name) {
        const duplicate = await Challenge.findOne({ name: req.body.name });
        if (duplicate) {
            return res.status(409).json({ 'message': `Challenge with name ${duplicate.name} already exists.`});
        }
    }

    try {
        const foundChallenge = await Challenge.findById(req.body.challenge_id);
        if (!foundChallenge) {
            return res.status(404).json({ 'message': `Challenge ID ${req.body.id} not found.`});
        }

        foundChallenge.name                 = req.body.name || foundChallenge.name;
        foundChallenge.points               = req.body.points || foundChallenge.points;
        foundChallenge.category             = req.body.category || foundChallenge.category;
        foundChallenge.flag                 = req.body.flag || foundChallenge.flag;
        foundChallenge.subjectId            = req.body.subject_id || foundChallenge.subjectId;
        foundChallenge.description          = req.body.description || foundChallenge.description;
        foundChallenge.attachments.url      = req.body.url || foundChallenge.attachments.url;
        foundChallenge.hintEnabled          = req.body.hint_enabled || foundChallenge.hintEnabled;
        foundChallenge.hint                 = req.body.hint || foundChallenge.hint;
        foundChallenge.topic                = req.body.topic || foundChallenge.topic;
        foundChallenge.resource             = req.body.resource || foundChallenge.resource;

        if (req?.body?.filename) {
            if (foundChallenge.attachments.files) {
                if (deleteFile(foundChallenge.attachments.files)) {
                    foundChallenge.attachments.files = req.body.filename;
                } else {
                    return res.status(500).json({ 'message': 'Failed to delete old challenge files.' });
                }
            } else {
                foundChallenge.attachments.files = req.body.filename;
            }
        }

        await foundChallenge.save();

        return res.status(200).json({ 'message': `Challenge ${foundChallenge.name} updated.` });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ 'message': 'Failed update the challenge' });
    }
}

const deleteChallenge = async (req, res) => {
    if (!req?.body?.challenge_id) {
        return res.status(400).json({ 'message': 'challenge_id parameter required.' });
    }

    try {
        const foundChallenge = await Challenge.findById(req.body.challenge_id);

        if (!foundChallenge) {
            return res.status(404).json({ 'message': `Challenge ID ${req.body.id} not found.` });
        }

        if (foundChallenge.attachments.files) {
            if (!deleteFile(foundChallenge.attachments.files)) {
                return res.status(500).json({ 'message': 'Failed to delete challenge files.' });
            }
        }

        await Challenge.deleteOne({ _id: foundChallenge._id });

        return res.json({ 'message': `Deleted challenge ${req.body.challenge_id}.` });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ 'message': 'Failed to delete challenge' });
    }

}

const getChallenge = async (req, res) => {
    if (!req?.params?.challenge_id) {
        return res.status(400).json({ 'message': 'challenge_id parameter required.' });
    }
    try {
        const foundChallenge = await Challenge.findById(req.params.challenge_id);

        if (!foundChallenge) {
            return res.status(404).json({ 'message': `No challenge with id ${req.params.id} found.` });
        }

        const foundSubject = await Subject.findById(foundChallenge.subjectId);
        const subject = `${foundSubject.name} ${foundSubject.subjectCode}`;

        const result = {
            name: foundChallenge.name,
            description: foundChallenge.description,
            points: foundChallenge.points,
            subject: subject,
            subject_id: foundChallenge.subjectId,
            topic: foundChallenge.topic,
            resource: foundChallenge.resource,
            hint_enabled: foundChallenge.hintEnabled,
            category: foundChallenge.category,
            url: foundChallenge.attachments.url,
            filename: foundChallenge.attachments.files,
            hint_enabled: foundChallenge.hintEnabled,
            hint: foundChallenge.hint
        }

        return res.json(result);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ 'message': `Failed to retrieve challenge ${req.params.challenge_id}.` });
    }
}

module.exports = {
    getAllChallenges,
    createNewChallenge,
    updateChallege,
    deleteChallenge,
    getChallenge
}
