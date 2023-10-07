const mongoose  = require('mongoose');
const Schema    = mongoose.Schema;

const challengeSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    points: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        requried: true,
    },
    description: String,
    url: String,
    hint: String,
    subject: String,
});

module.exports = mongoose.model('Challenge', challengeSchema);

/* Mongoose automatically looks for plural, lowercased version of model name.
 * Thus, for 'Challenge' model, it looks for 'challenges' collection in database.
 */