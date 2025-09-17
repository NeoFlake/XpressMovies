import { VIEW_LIBELLE } from "../constantes/views.js";
import HomepageService from "../services/homepage.service.js";

const displayView = async (req, res) => {
    try {
        const data = await HomepageService.displayView(req);
        res.render(VIEW_LIBELLE.HOMEPAGE, data);
    } catch (error) {
        res.render(VIEW_LIBELLE.HOMEPAGE, {
            films: [],
            error: error.message,
            user: null,
            films: null,
            isAdmin: false,
            navbar: null,
            card: null,
            FRONTEND: FRONTEND,
            VIEW_LIBELLE: VIEW_LIBELLE
        });
    }
}

const searchByTitle = async (req, res) => {
    try {
        await HomepageService.searchByTitle(req);
        res.redirect(`/${VIEW_LIBELLE.HOMEPAGE}`);
    } catch (error) {
        req.flash("error", error.message);
        res.redirect(`/${VIEW_LIBELLE.HOMEPAGE}`);
    }
}

const addNewFavori = async (req, res) => {
    try {
        await HomepageService.addNewFavori(req);
        res.redirect(`/${VIEW_LIBELLE.HOMEPAGE}`);
    } catch (error) {
        req.flash("error", error.message);
        res.redirect(`/${VIEW_LIBELLE.HOMEPAGE}`);
    }
}

export default { displayView, searchByTitle, addNewFavori };