const verfiyRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req?.roles) {
            /* Request does not exist, or it does not have associated role */
            return sendStatus(401);
        }

        const rolesArray = [...allowedRoles];

        /* Debug: log roles */
        console.log(req.roles);

        const result = req.roles.map(role => rolesArray.includes(role)).find(val => val === true);

        if (!result) {
            /* If no roles exist */
            return res.sendStatus(401);
        }

        next();
    }
}

module.exports = verfiyRoles;