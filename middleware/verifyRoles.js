const verfiyRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req?.role) {
            /* Request does not exist, or it does not have associated role */
            return sendStatus(401);
        }

        const rolesArray = [...allowedRoles];

        /* Debug: log role */
        console.log(req.role);

        const result = rolesArray.includes(req.role);

        if (!result) {
            /* If no role exist */
            return res.sendStatus(401);
        }

        next();
    }
}

module.exports = verfiyRoles;