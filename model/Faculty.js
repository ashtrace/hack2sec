const mongoose  = require('mongoose');
const Schema    = mongoose.Schema;

const facultySchema = new Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    empId: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: process.env.RBAC_FACULTY_ID
    },
    subjects: Array
});

module.exports = mongoose.model('Faculty', facultySchema);