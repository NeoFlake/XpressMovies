import GenresRepository from "../repositories/genres.repository.js";
import FilmsRepository from "../repositories/films.repository.js";
import DateService from "../services/date.service.js";
import ValidationService from "../services/validation.service.js";
import usersRepository from "../repositories/users.repository.js";

const displayAdminPage = async (req, res) => {
    try {
        const genres = await GenresRepository.findAll();
        let films = await FilmsRepository.findAll();
        let user = await usersRepository.findById(req.session.userLogged.id);

        if (films.length > 0) {
            films = DateService.formatterDateFilm(films);
        }

        const flashIdGenreToModify = req.flash("idGenreToModify");
        const flashDisplayModifyGenreForm = req.flash("displayModifyGenreForm");
        const flashIdFilmToModify = req.flash("idFilmToModify");
        const flashDisplayModifyFilmForm = req.flash("displayModifierFilmForm");

        const idGenreToModify = flashIdGenreToModify.length > 0 ? flashIdGenreToModify[0] : 0;
        const displayModifyGenreForm = flashDisplayModifyGenreForm.length > 0 ? flashDisplayModifyGenreForm[0] : false;
        const idFilmToModify = flashIdFilmToModify.length > 0 ? flashIdFilmToModify[0] : 0;
        const displayModifyFilmForm = flashDisplayModifyFilmForm.length > 0 ? flashDisplayModifyFilmForm[0] : false;

        const navbar = {
                    isAdmin: req.session.userLogged.role === "ADMIN" ? true : false,
                    favoris: user.favoris.filter(f => f !== null).length,
                    currentRoute: req.baseUrl,
                    lastname: user.lastname,
                    firstname: user.firstname
                };

        if (displayModifyGenreForm) {
            const genreToModify = await GenresRepository.findById(idGenreToModify);
            res.render("administration", {
                genres: {
                    list: genres,
                    displayModifyGenreForm: displayModifyGenreForm,
                    genreToModify: genreToModify
                },
                films: {
                    list: films,
                    displayModifyFilmForm: displayModifyFilmForm,
                    filmToModify: null
                },
                navbar: navbar,
                error: { genreError: req.flash("genreError"), filmError: req.flash("filmError") }
            });
        } else if (displayModifyFilmForm) {

            const filmToModify = await FilmsRepository.findById(idFilmToModify);

            res.render("administration", {
                genres: {
                    list: genres,
                    displayModifyGenreForm: displayModifyGenreForm,
                    genreToModify: null
                },
                films: {
                    list: films,
                    displayModifyFilmForm: displayModifyFilmForm,
                    filmToModify: filmToModify
                },
                navbar: navbar,
                error: { genreError: req.flash("genreError"), filmError: req.flash("filmError") }
            });
        } else {
            res.render("administration", {
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
                error: { genreError: req.flash("genreError"), filmError: req.flash("filmError") }
            });
        }
    } catch (error) {
        res.render("administration", {
            genres: { list: [] }, films: { list: [] }, navbar: navbar, error: { genreError: error.message }
        });
    }
}

const addGenre = async (req, res) => {
    try {
        await ValidationService.genreSchema.validate(req.body);
        const nameKnown = await GenresRepository.nameAlreadyKnown(req.body.name);
        if (nameKnown) {
            throw new Error("Cet intitulé de genre de film existe déjà");
        } else {
            const add = await GenresRepository.add(req.body.name);
            if (add > 0) {
                res.redirect("/administration");
            } else {
                throw new Error("L'intitulé de ce genre de film n'a pas pu être poussé en base");
            }
        }
    } catch (error) {
        req.flash("genreError", error.message);
        res.redirect("/administration");
    }
}

const displayModifierGenreForm = (req, res) => {
    req.flash("displayModifyGenreForm", true);
    req.flash("idGenreToModify", req.params.id);
    res.redirect("/administration");
}

const modifierGenre = async (req, res) => {
    try {
        if (req.params.id === req.body.id) {
            await ValidationService.modifyGenreSchema.validate(req.body);
            const nameKnown = await GenresRepository.nameAlreadyKnown(req.body.nameM);
            const genreOnBase = await GenresRepository.findById(req.body.id);
            if (genreOnBase.name !== req.body.nameM && nameKnown) {
                throw new Error("Cet intitulé de genre de film existe déjà");
            } else {
                const update = await GenresRepository.updateById(req.params.id, { id: req.body.id, name: req.body.nameM });
                if (update) {
                    res.redirect("/administration");
                } else {
                    throw new Error("L'intitulé de ce genre de film n'a pas pu être poussé en base");
                }
            }
        } else {
            throw new Error("Erreur technique lors de la soumission du formulaire");
        }
    } catch (error) {
        req.flash("genreError", error.message);
        res.redirect("/administration");
    }
}

const supprimerGenre = async (req, res) => {
    try {
        const deleted = await genresRepository.deleteById(req.params.id);
        if (deleted) {
            res.redirect("/administration");
        } else {
            throw new Error("Le genre que vous avez souhaité supprimé n'a pas pu être supprimé");
        }
    } catch (error) {
        req.flash("genreError", error.message);
        res.redirect("/administration");
    }
}

const addFilm = async (req, res) => {

    try {
        await ValidationService.filmSchema.validate(req.body);
        const titleKnown = await FilmsRepository.existByTitle(req.body.title);
        if (titleKnown) {
            throw new Error("Ce titre de film existe déjà");
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
            if (add) {
                res.redirect("/administration");
            } else {
                throw new Error("L'intitulé de ce genre de film n'a pas pu être poussé en base");
            }
        }
    } catch (error) {
        req.flash("filmError", error.message);
        res.redirect("/administration");
    }
}

const supprimerFilm = async (req, res) => {
    try {

        const deleted = await FilmsRepository.deleteById(req.params.id);
        if (deleted) {
            res.redirect("/administration");
        } else {
            throw new Error("Le film que vous avez souhaité supprimé n'a pas pu être supprimé");
        }
    } catch (error) {
        req.flash("filmError", error.message);
        res.redirect("/administration");
    }
}

const displayModifierFilmForm = (req, res) => {
    req.flash("displayModifierFilmForm", true);
    req.flash("idFilmToModify", req.params.id);
    res.redirect("/administration");
}

const modifierFilm = async (req, res) => {
    try {
        if (req.params.id === req.body.id) {
            await ValidationService.modifyFilmSchema.validate(req.body);
            const titleKnown = await FilmsRepository.existByTitle(req.body.titleM);
            const filmOnBase = await FilmsRepository.findById(req.body.id);
            if (filmOnBase.title !== req.body.titleM && titleKnown) {
                throw new Error("Cet intitulé de film existe déjà");
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
                if (update) {
                    res.redirect("/administration");
                } else {
                    throw new Error("Le film n'a pas pu être mis à jour");
                }
            }
        } else {
            throw new Error("Erreur technique lors de la soumission du formulaire");
        }
    } catch (error) {
        req.flash("filmError", error.message);
        res.redirect("/administration");
    }
}

export default { displayAdminPage, addGenre, displayModifierGenreForm, modifierGenre, supprimerGenre, addFilm, supprimerFilm, displayModifierFilmForm, modifierFilm };