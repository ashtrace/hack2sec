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

        const rank = await User.aggregate([
            { $match: { points: { $gt: foundUser.points }}},
            { $group: { _id: null, rank: { $sum: 1 }}}
        ]);

        const userRank = rank.length > 0 ? rank[0].rank + 1 : 1;

        const dashboardData = {
            name: `${foundUser.firstname} ${foundUser.lastname}`,
            username: foundUser.username,
            rank: userRank,
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