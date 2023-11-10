const fs        = require('fs');
const User      = require('../../model/User');
const moment    = require('moment');

async function readServerStartDate() {
    try {
        const startDate = await fs.promises.readFile('server-start-date.txt', 'utf-8');
        return moment(startDate.trim(), 'MM/DD/YYYY');
    } catch (error) {
        console.error('Error reading server start date:', error.message);
        throw error;
    }
}

function calculateUserPointsOnDate(user, date, prevPoints) {
    /* Iterate through user's solvedChallenges and calculate points for the given date
     * by considering challenges sovled on that date, and add it to previous points
     */
    let points = prevPoints;
    for (const solvedChallenge of user.solvedChallenges) {
        const solvedDate = moment(solvedChallenge.timeStamp);
        if (solvedDate.isSame(date, 'day')) {
            points += solvedChallenge.points;
        }
    }
    return points;
}


const handleLeaderboard = async (req, res) => {
    try {
        const serverStartDate = await readServerStartDate();
        const today = moment();

        /* Fetch top 10 Users with maximum points */
        const topUsers = await User.find({ points: { $gt: 0 } }).sort({ points: -1 }).limit(10);

        const leaderboard = {
            X: new Set(),
            Y: []
        };

        /* Iterate through top 10 users to generate their solve-history */
        for (const user of topUsers) {
            const userData = {
                username: user.username,
                scores: []
            };

            /* Iterate through dates from server start date to today */
            let currentDate = serverStartDate.clone();
            let userPoints = 0;
            while (currentDate.isSameOrBefore(today, 'day')) {
                /* Store points upto this date */
                const formattedDate = currentDate.format('MM/DD/YYYY');
                leaderboard.X.add(formattedDate);

                userPoints = calculateUserPointsOnDate(user, currentDate, userPoints);
                userData.scores.push(userPoints);

                /* Move to the next date */
                currentDate.add(1, 'day');
            }

            /* Add user's points by date to the leaderboard */
            leaderboard.Y.push(userData);
        }

        leaderboard.X = Array.from(leaderboard.X);

        return res.json(leaderboard);
    } catch (error) {
        console.error('Error handling leaderboard:', error.message);
        throw error;
    }
}

module.exports = { handleLeaderboard };