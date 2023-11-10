const Challenge         = require('../../model/Challenge');
const User              = require('../../model/User');
const bcrypt            = require('bcrypt');

const handleFlagValidation = async (req, res) => {

    try {
        const foundChallenge = await Challenge.findOne({ _id: req.body.challenge_id }).exec();
        
        /* Find the challenge */
        if (!foundChallenge) {
            return res.status(400).json({ "message": `No challenge with ID ${req.body.challenge_id} exists.` });
        }

        /* Validate flag */
        const match = await bcrypt.compare(req.body.flag, foundChallenge.flag);

        if (match) {
            const foundUser = await User.findOne({ _id: req.userId }).exec();

            if (foundUser.solvedChallenges.some(challenge => challenge.challengeId === req.body.challenge_id)) {
                return res.status(304).json({ "message": "Challenge already solved!" });
            } else {
                let hintCost = 0;
                if (foundUser.hintsTaken.some(challengeId => challengeId.toString() === foundChallenge._id.toString())) {
                    hintCost = 0.1 * foundChallenge.points;
                }

                foundUser.points += foundChallenge.points;
                foundUser.correctSolves += 1;

                const sovledChallenge = {
                    challengeId: foundChallenge._id,
                    name: foundChallenge.name,
                    points: foundChallenge.points - hintCost,
                    timeStamp: new Date().toISOString(),
                    category: foundChallenge.category
                }
                foundUser.solvedChallenges.push(sovledChallenge);

                await foundUser.save();
                
                return res.json({ "message": "Challenge solved!" });
            }
        } else {
            const foundUser = await User.findOne({ _id: req.userId }).exec();

            if (foundUser.solvedChallenges.some(challenge => challenge.challengeId === req.body.challenge_id)) {
                return res.json({ "message": "Challenge solved!" });
            } else {
                foundUser.incorrectSolves += 1;
                await foundUser.save();
                
                return res.status(400).json({ "message": "Incorrect flag value."});
            }
        }
    } catch (err) {
        console.error(err);
        return res.sendStatus(500);
    }
}

module.exports = { handleFlagValidation };