const requireRole = (role) => {
    return (req, res, next) => {
        if (req.session.userLogged && req.session.userLogged.role === role) {
            next();
        } else {
            res.redirect("/authentification/login");
        }
    };
}

const requireLogin = (req, res, next) => {
    if (req.session.userLogged) {
        next();
    } else {
        res.redirect("/authentification/login");
    }
}

export default{ requireRole, requireLogin };