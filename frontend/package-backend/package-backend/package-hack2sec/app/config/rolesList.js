const ROLES_LIST = {
    'user': process.env.RBAC_USER_ID,
    'faculty': process.env.RBAC_FACULTY_ID,
    'admin': process.env.RBAC_ADMIN_ID
}

module.exports = ROLES_LIST;