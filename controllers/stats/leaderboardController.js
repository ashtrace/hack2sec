const User = require("../../model/User")

const handleLeaderboard = (req, res) => {

    User.find({}, 'username points').sort('-points')
    .then(users => {
        return res.json(users);
    })
    .catch(err => {
        console.error(err);
    });
}

module.exports = { handleLeaderboard };