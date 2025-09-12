const disconnect = (req, res) => {
    req.session.destroy(err => {
        res.redirect("/authentification/login");
    });
}

export default { disconnect };