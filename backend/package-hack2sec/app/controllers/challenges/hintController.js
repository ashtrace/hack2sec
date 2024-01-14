const Challenge = require('../../model/Challenge');
const User      = require('../../model/User');

const handleHint = async (req, res) => {
    if (!req?.params?.challenge_id) {
        return res.status(400).json({ 'message': 'challenge_id is required.' });
    }

    try {
        const challenge = await Challenge.findById(req.params.challenge_id);
        if (!challenge) {
            return res.status(400).json({ 'message': `No challenge exists with ID ${req.params.challenge_id}` });
        }

        /* If this user (faculty) created the challenge or it is an administrator */
        if (challenge.creatorId === req.userId || process.env.RBAC_ADMIN_ID === req.role ) {
            return res.json({ 'message': `The hint is '${challenge.hint}'` });
        }

        /* If a faculty requests hint for a challenge they did NOT create */
        if (challenge.creatorId !== req.userId && process.env.RBAC_FACULTY_ID === req.role ) {
            return res.status(403).json({ 'message': 'You do not have permission to view hint of this challenge.' });
        }

        const user = await User.findById(req.userId);

        if (user.hintsTaken.includes(challenge._id)) {
            return res.json({ 'message': challenge.hint });
        }

        if (user.solvedChallenges.some(solvedChallenge => solvedChallenge.challengeId === challenge._id.toString())) {
            return res.status(304).json({ 'message': 'Challenge already solved.' });
        }

        if (!challenge.hintEnabled) {
            return res.status(403).json({ 'message': `Hint for challenge ${challenge._id} is disabled.` });
        }

        const cost = 0.1 * challenge.points;
        
        if (user.points > cost) {
            user.points -= cost;
            user.hintsTaken.push(challenge._id);
    
            await user.save();
    
            return res.json({ 'message': challenge.hint });
        } else {
            return res.status(402).json({ 'message': 'User does not have enough points to unlock this hint' });
        }
        
    } catch (err) {
        console.error(err);
        return res.status(500).json({ 'message': 'Failed to unlock hint.' });
    }

}

module.exports = { handleHint };