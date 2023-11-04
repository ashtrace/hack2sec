const User  = require('../../model/User');

const handleUserDashboard = async (req, res) => {
    try {
        const foundUser = await User.findById(req.userId);

        /* Get category wise solves */
        const categoryCounts = {};
        foundUser.solvedChallenges.forEach(challenge => {
            const category = challenge.category;

            if (categoryCounts[category]) {
                categoryCounts[category] += 1;
            } else {
                categoryCounts[category] = 1;
            }
        });

        const dashboardData = {
            correctSolves: foundUser.correctSolves,
            incorrectSolves: foundUser.incorrectSolves,
            categoryCounts: categoryCounts,
            solvedChallenges: foundUser.solvedChallenges
        };

        return res.json(dashboardData);
    } catch (err) {
        console.error(err);
        return res.sendStatus(500);
    }
}

module.exports = { handleUserDashboard };