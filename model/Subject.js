const mongoose  = require('mongoose');
const Schema    = mongoose.Schema;

const subjectSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    subject_code: {
        type: String,
        require: true
    },
    syllabus: String
});

module.exports = mongoose.model('Subject', subjectSchema);