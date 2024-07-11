const verifyRole = (acceptedRoles) => {
    return function(req, res, next) {
        if (acceptedRoles.includes(req.user.role)) {
            next();
        } else {
            res.status(403).send('Acces interzis');
        }
    }
};

module.exports = verifyRole;