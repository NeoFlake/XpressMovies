import FilmsRepository from "../repositories/films.repository.js";
import UserRepository from "../repositories/users.repository.js";
import FavoriRepository from "../repositories/favoris.repository.js";
import DateService from '../services/date.service.js';
import { FRONTEND } from "../constantes/homepage.js";
import { VIEW_LIBELLE, ROLE_LIBELLE } from "../constantes/views.js";
import { ERROR_LIBELLE } from "../constantes/errors.js";

const displayView = async (req, res) => {
    try {
        let films = [];
        const user = await UserRepository.findById(req.session.userLogged.id);

        const flashSearchByTitle = req.flash("searchByTitle");
        const flashTitleSearched = req.flash("titleSearched");

        const searchByTitle = flashSearchByTitle.length > 0 ? flashSearchByTitle[0] : false;
        const titleSearched = flashTitleSearched.length > 0 ? flashTitleSearched[0] : "";

        if (searchByTitle) {
            films = await FilmsRepository.findLikeByTitle(titleSearched);
        } else {
            films = await FilmsRepository.findAll();
        }
        films = DateService.formatterDateFilm(films);
        const isAdmin = req.session.userLogged.role === ROLE_LIBELLE.ADMIN ? true : false;

        const card = {
            user: user,
            films: films,
            isAdmin: isAdmin,
            currentRoute: req.baseUrl
        };

        res.render(VIEW_LIBELLE.HOMEPAGE, {
            user: user,
            films: films,
            error: "",
            isAdmin: isAdmin,
            navbar: {
                isAdmin: isAdmin,
                favoris: user.favoris.filter(f => f !== null).length,
                currentRoute: req.baseUrl,
                lastname: user.lastname,
                firstname: user.firstname
            },
            card: card,
            FRONTEND: FRONTEND,
            VIEW_LIBELLE: VIEW_LIBELLE
        });
    } catch (error) {
        res.render(VIEW_LIBELLE.HOMEPAGE, { films: [], error: error.message });
    }
}

const searchByTitle = async (req, res) => {
    try {
        await searchByTitleSchema.validate(req.body);
        req.flash("searchByTitle", true);
        req.flash("titleSearched", req.body.title);
        res.redirect(`/${VIEW_LIBELLE.HOMEPAGE}`);
    } catch (error) {
        req.flash("error", error.message);
        res.redirect(`/${VIEW_LIBELLE.HOMEPAGE}`);
    }
}

const addNewFavori = async (req, res) => {
    try {
        const favori = await FavoriRepository.add({
            userId: req.session.userLogged.id,
            filmId: req.params.id
        });
        if (favori > 0) {
            res.redirect(`/${VIEW_LIBELLE.HOMEPAGE}`);
        } else {
            throw new Error(ERROR_LIBELLE.NEW_FAVORI_ERROR);
        }
    } catch (error) {
        req.flash("error", error.message);
        res.redirect(`/${VIEW_LIBELLE.HOMEPAGE}`);
    }
}

export default { displayView, searchByTitle, addNewFavori };