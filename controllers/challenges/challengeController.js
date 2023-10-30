const Challenge = require('../../model/Challenge');
const bcrypt    = require('bcrypt');

const getAllChallenges = async (req, res) => {
    const challenges = await Challenge.find();
    if (!challenges) {
        return res.status(404).json({ "message": "No challenges found." });
    }
    res.json(challenges);
}

const createNewChallenge = async (req, res) => {
    if (!req?.body?.name || !req?.body?.points || !req?.body?.category || !req?.body?.flag || !req?.body?.subject_id) {
        return res.status(400).json({ "message": "Name, points, category, flag and subject_id are required." });
    }

    try {
        hashedFlag = await bcrypt.hash(req.body.flag, 10);
        const result = await Challenge.create({
            name: req.body.name,
            points: req.body.points,
            category: req.body.category,
            flag: hashedFlag,
            subject_id: req.body.subject_id
        });

        res.status(201).json(result);
    } catch (err) {
        console.error(err);
    }
}

const updateChallege = async (req, res) => {
    if (!req?.body?.id) {
        return res.status(400).json({ "message": "ID parameter required." });
    }

    const challenge = await Challenge.findOne({ _id: req.body.id }).exec();
    if (!challenge) {
        return res.status(404).json({ "message": `Challenge ID ${req.body.id} not found.`});
    }

    if (req.body?.name) {
        challenge.name = req.body.name;
    }
    if (req.body?.points) {
        challenge.points = req.body.points;
    }
    if (req.body?.category) {
        challenge.category = req.body.category;
    }

    const result = await challenge.save();

    res.json(result);
}

const deleteChallenge = async (req, res) => {
    if (!req?.body?.id) {
        return res.status(400).json({ "message": "ID parameter required." });
    }

    const challenge = await Challenge.findOne({ _id: req.body.id }).exec();

    if (!challenge) {
        return res.status(404).json({ "message": `Challenge ID ${req.body.id} not found.` });
    }

    const result = await Challenge.deleteOne({ _id: req.body.id });
    
    res.json(result);
}

const getChallenge = async (req, res) => {
    if (!req?.params?.id) {
        return res.status(400).json({ "message": "ID parameter required." });
    }
    
    const challenge = await Challenge.findOne({ _id: req.params.id }).exec();

    if (!challenge) {
        return res.status(404).json({ "message": `Challenge ID ${req.params.id} not found.` });
    }

    res.json(challenge);
}

module.exports = {
    getAllChallenges,
    createNewChallenge,
    updateChallege,
    deleteChallenge,
    getChallenge
}