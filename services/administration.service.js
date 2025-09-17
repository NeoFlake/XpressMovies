import GenresRepository from "../repositories/genres.repository.js";
import FilmsRepository from "../repositories/films.repository.js";
import DateService from "../services/date.service.js";
import ValidationService from "../services/validation.service.js";
import UsersRepository from "../repositories/users.repository.js";
import { FRONTEND } from "../constantes/administration.js";
import { VIEW_LIBELLE, ROLE_LIBELLE } from "../constantes/views.js";
import { ERROR_LIBELLE } from "../constantes/errors.js";

const displayAdminPage = async (req) => {
    try {
        const genres = await GenresRepository.findAll();
        let films = await FilmsRepository.findAll();
        let user = await UsersRepository.findById(req.session.userLogged.id);

        if (films.length > 0) {
            films = DateService.formatterDateFilm(films);
        }

        const flashIdGenreToModify = req.flash("idGenreToModify");
        const flashDisplayModifyGenreForm = req.flash("displayModifyGenreForm");
        const flashIdFilmToModify = req.flash("idFilmToModify");
        const flashDisplayModifyFilmForm = req.flash("displayModifierFilmForm");
        const anchor = req.flash("anchor");

        const idGenreToModify = flashIdGenreToModify.length > 0 ? flashIdGenreToModify[0] : 0;
        const displayModifyGenreForm = flashDisplayModifyGenreForm.length > 0 ? flashDisplayModifyGenreForm[0] : false;
        const idFilmToModify = flashIdFilmToModify.length > 0 ? flashIdFilmToModify[0] : 0;
        const displayModifyFilmForm = flashDisplayModifyFilmForm.length > 0 ? flashDisplayModifyFilmForm[0] : false;

        const isAdmin = req.session.userLogged.role === ROLE_LIBELLE.ADMIN ? true : false;

        const navbar = {
            isAdmin: isAdmin,
            favoris: user.favoris.filter(f => f !== null).length,
            currentRoute: req.baseUrl,
            lastname: user.lastname,
            firstname: user.firstname
        };

        const card = {
            user: user,
            films: films,
            isAdmin: isAdmin,
            currentRoute: req.baseUrl
        };

        const viewData = {
            user: user,
            films: films,
            genres: {
                list: genres,
                displayModifyGenreForm: displayModifyGenreForm,
                genreToModify: null
            },
            films: {
                list: films,
                displayModifyFilmForm: displayModifyFilmForm,
                filmToModify: null
            },
            navbar: navbar,
            card: card,
            FRONTEND: FRONTEND,
            VIEW_LIBELLE: VIEW_LIBELLE,
            anchor: anchor,
            error: { genreError: req.flash("genreError"), filmError: req.flash("filmError") }
        };

        if (displayModifyGenreForm) {
            const genreToModify = await GenresRepository.findById(idGenreToModify);
            viewData.genres.genreToModify = genreToModify;
        } else if (displayModifyFilmForm) {
            const filmToModify = await FilmsRepository.findById(idFilmToModify);
            viewData.films.filmToModify = filmToModify;
        }
        return viewData;
    } catch (error) {
        throw new Error(ERROR_LIBELLE.ADMINISTRATION_DISPLAY_ERROR);
    }
}

const addGenre = async (req) => {
    req.flash("anchor");
    try {
        await ValidationService.genreSchema.validate(req.body);
        const nameKnown = await GenresRepository.nameAlreadyKnown(req.body.name);
        if (nameKnown) {
            throw new Error(ERROR_LIBELLE.GENRE_TITLE_ALREADY_EXIST);
        } else {
            const add = await GenresRepository.add(req.body.name);
            if (add === 0) {
                throw new Error(ERROR_LIBELLE.ADD_GENRE_DB_ERROR);
            }
        }
    } catch (error) {
        req.flash("genreError", error.message);
        throw new Error();
    }
}

const displayModifierGenreForm = (req) => {
    req.flash("anchor", "genreForm");
    req.flash("displayModifyGenreForm", true);
    req.flash("idGenreToModify", req.params.id);
}

const modifierGenre = async (req) => {
    req.flash("anchor", "genreForm");
    try {
        if (req.params.id === req.body.id) {
            await ValidationService.modifyGenreSchema.validate(req.body);
            const nameKnown = await GenresRepository.nameAlreadyKnown(req.body.nameM);
            const genreOnBase = await GenresRepository.findById(req.body.id);
            if (genreOnBase.name !== req.body.nameM && nameKnown) {
                throw new Error(ERROR_LIBELLE.GENRE_TITLE_ALREADY_EXIST);
            } else {
                const update = await GenresRepository.updateById(req.params.id, { id: req.body.id, name: req.body.nameM });
                if (update === false) {
                    throw new Error(ERROR_LIBELLE.ADD_GENRE_DB_ERROR);
                }
            }
        } else {
            throw new Error(ERROR_LIBELLE.TECHNICAL_ERROR_ON_SUBMISSION);
        }
    } catch (error) {
        req.flash("genreError", error.message);
        throw new Error();
    }
}

const supprimerGenre = async (req) => {
    req.flash("anchor", "genreForm");
    try {
        const deleted = await GenresRepository.deleteById(req.params.id);
        if (deleted === false) {
            throw new Error(ERROR_LIBELLE.REMOVE_GENRE_FAIL);
        }
    } catch (error) {
        req.flash("genreError", error.message);
        throw new Error();
    }
}

const addFilm = async (req) => {
    req.flash("anchor", "filmForm");
    try {
        await ValidationService.filmSchema.validate(req.body);
        const titleKnown = await FilmsRepository.existByTitle(req.body.title);
        if (titleKnown) {
            throw new Error(ERROR_LIBELLE.FILM_TITLE_ALREADY_EXIST);
        } else {
            const filmToAdd = {
                title: req.body.title,
                genres: req.body.genres,
                poster: req.body.poster,
                releaseDate: req.body.releaseDate,
                description: req.body.description,
                adminId: req.session.userLogged.id
            }
            const add = await FilmsRepository.add(filmToAdd);
            if (add === false) {
                throw new Error(ERROR_LIBELLE.ADD_FILM_DB_ERROR);
            }
        }
    } catch (error) {
        req.flash("filmError", error.message);
        throw new Error();
    }
}

const supprimerFilm = async (req) => {
    req.flash("anchor", "filmForm");
    try {
        const deleted = await FilmsRepository.deleteById(req.params.id);
        if (deleted === 0) {
            throw new Error(ERROR_LIBELLE.REMOVE_FILM_FAIL);
        }
    } catch (error) {
        req.flash("filmError", error.message);
        throw new Error();
    }
}

const displayModifierFilmForm = (req) => {
    req.flash("anchor", "filmForm");
    req.flash("displayModifierFilmForm", true);
    req.flash("idFilmToModify", req.params.id);
}

const modifierFilm = async (req) => {
    req.flash("anchor", "filmForm");
    try {
        if (req.params.id === req.body.id) {
            await ValidationService.modifyFilmSchema.validate(req.body);
            const titleKnown = await FilmsRepository.existByTitle(req.body.titleM);
            const filmOnBase = await FilmsRepository.findById(req.body.id);
            if (filmOnBase.title !== req.body.titleM && titleKnown) {
                throw new Error(ERROR_LIBELLE.FILM_TITLE_ALREADY_EXIST);
            } else {
                const update = await FilmsRepository.updateById(req.params.id, {
                    id: req.body.id,
                    title: req.body.titleM,
                    poster: req.body.posterM,
                    releaseDate: req.body.releaseDateM,
                    description: req.body.descriptionM,
                    addedDate: filmOnBase.addedDate,
                    genres: req.body.genresM,
                    adminId: req.session.userLogged.id
                });
                if (update === 0) {
                    throw new Error(ERROR_LIBELLE.UPDATE_FILM_FAIL);
                }
            }
        } else {
            throw new Error(ERROR_LIBELLE.TECHNICAL_ERROR_ON_SUBMISSION);
        }
    } catch (error) {
        req.flash("filmError", error.message);
        throw new Error();
    }
}

export default { displayAdminPage, addGenre, displayModifierGenreForm, modifierGenre, supprimerGenre, addFilm, supprimerFilm, displayModifierFilmForm, modifierFilm };