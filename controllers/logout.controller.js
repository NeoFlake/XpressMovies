const disconnect = (req, res) => {
    req.session.destroy(() => {
        res.redirect("/authentification/login");
    });
}

export default { disconnect };