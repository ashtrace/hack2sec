const mongoose  = require('mongoose');
const Schema    = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: Number,
        default: 1
    },
    subjects: [
        {
            type: String
        }
    ],
    refreshToken: String
});

module.exports = mongoose.model('User', userSchema);