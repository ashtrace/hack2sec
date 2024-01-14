const mongoose  = require('mongoose');
const Schema    = mongoose.Schema;

const userSchema = new Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    rollNo: {
        type: String,
        required: true
    },
    branch: {
        type: String,
        required: true
    },
    year: {
        type: Number,
        required: true,
        default: 1
    },
    role: {
        type: String,
        default: process.env.RBAC_USER_ID
    },
    points: {
        type: Number,
        default: 0
    },
    hintsTaken: Array,
    correctSolves: {
        type: Number,
        default: 0
    },
    incorrectSolves: {
        type: Number,
        default: 0
    },
    subjects: Array,
    solvedChallenges: [
        {
            challengeId: String,
            name: String,
            points: Number,
            timeStamp: String,
            category: String
        }
    ],
    refreshToken: String,
    pwdResetToken: String
});

module.exports = mongoose.model('User', userSchema);