import FilmsRepository from "../repositories/films.repository.js";

const displayView = async (req, res) => {
    try {
        const films = await FilmsRepository.findAll();
        res.render("homepage", {films: films, error: "", isAdmin: req.session.userLogged.role === "ADMIN" ? true : false});
    } catch (error) {
        res.render("homepage", {films: [], error: error.message});
    }
}

export default { displayView };