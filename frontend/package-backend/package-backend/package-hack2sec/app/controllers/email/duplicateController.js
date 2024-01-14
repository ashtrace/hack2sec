const UnapprovedFaculty = require('../../model/UnapprovedFaculty');
const ApprovedFaculty   = require('../../model/Faculty');
const User              = require('../../model/User');

async function emailDuplicateChecker(email) {
    let duplicate = await User.findOne({ email: email }).exec();
    if (duplicate) {
        return true;
    }

    duplicate = await UnapprovedFaculty.findOne({ email: email }).exec();
    if (duplicate) {
        return true;
    }

    duplicate = await ApprovedFaculty.findOne({ email: email }).exec();
    if (duplicate) {
        return true;
    }

    return false;
}

module.exports = {
    emailDuplicateChecker
}