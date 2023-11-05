const mongoose  = require('mongoose');
const Schema    = mongoose.Schema;

const unapprovedFacultySchema = new Schema ({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true,
    },
    empId: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('UnapprovedFaculty', unapprovedFacultySchema);