const Challenge = require('../../model/Challenge');
const User      = require('../../model/User');
const bcrypt    = require('bcrypt');

const handleFlagValidation = async (req, res) => {
    const foundChallenge = await Challenge.findOne({ _id: req.body.challenge_id }).exec();
    
    /* Find the challenge */
    if (!foundChallenge) {
        return res.status(400).json({ "message": `No challenge with ID ${req.body.challenge_id} exists.` });
    }

    /* Validate flag */
    const match = await bcrypt.compare(req.body.flag, foundChallenge.flag);

    if (match) {
        try {
            const foundUser = await User.findOne({ username: req.user }).exec();

            if (!foundUser) {
                return res.status(401).json({ "message": "Incorrect username." });
            }

            if (foundUser.solved_challenges.includes(req.body.challenge_id)) {
                return res.json({ "message": "Challenge solved!" });
            } else {
                foundUser.points += foundChallenge.points;
                foundUser.solved_challenges.push(req.body.challenge_id);
                const result = foundUser.save();
                
                return res.json({ "message": "Challenge solved!" });
            }
            
        } catch (err) {
            console.error(err);
            return res.sendStatus(500);
        }
    } else {
        return res.status(400).json({ "message": "Incorrect flag value."});
    }
}

module.exports = { handleFlagValidation };