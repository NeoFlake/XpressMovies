import FilmsRepository from "../repositories/films.repository.js";
import UserRepository from "../repositories/users.repository.js";
import FavorisRepository from "../repositories/favoris.repository.js";
import DateService from '../services/date.service.js';
import ValidationService from "../services/validation.service.js";
import { FRONTEND } from "../constantes/homepage.js";
import { VIEW_LIBELLE, ROLE_LIBELLE } from "../constantes/views.js";
import { ERROR_LIBELLE } from "../constantes/errors.js";

const displayView = async (req) => {
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

        return {
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
        };
    } catch (error) {
        throw new Error(ERROR_LIBELLE.LOADING_FILMS_FAIL);
    }
}

const searchByTitle = async (req) => {
    try {
        await ValidationService.searchByTitleSchema.validate(req.body);
        req.flash("searchByTitle", true);
        req.flash("titleSearched", req.body.title);
    } catch (error) {
        throw Error(ERROR_LIBELLE.TITLE_NOT_FOUND);
    }
}

const addNewFavori = async (req) => {
    try {
        const favori = await FavorisRepository.add({
            userId: req.session.userLogged.id,
            filmId: req.params.id
        }); 
        if (favori === 0) {
            throw new Error(ERROR_LIBELLE.NEW_FAVORI_ERROR);
        }
    } catch (error) {
        throw new Error(error.message);
    }
}

export default { displayView, searchByTitle, addNewFavori }