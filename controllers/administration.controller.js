import GenresRepository from "../repositories/genres.repository.js";
import FilmsRepository from "../repositories/films.repository.js";
import yup from '../config/yup.config.js';
import dayjs from "dayjs";
import "dayjs/locale/fr.js";

dayjs.locale("fr");

const modifyGenreSchema = yup.object().shape({
    nameM: yup
        .string("Genre invalide")
        .required("L'intitulé de genre est obligatoire pour la validation")
        .matches(/^[A-Za-zÀ-ÖØ-öø-ÿ ]{3,64}$/, "Cet intitulé de genre n'est pas disponible")
});

const genreSchema = yup.object().shape({
    nameM: yup
        .string("Genre invalide")
        .required("L'intitulé de genre est obligatoire pour la validation")
        .matches(/^[A-Za-zÀ-ÖØ-öø-ÿ ]{3,64}$/, "Cet intitulé de genre n'est pas disponible")
});

const filmSchema = yup.object().shape({
    title: yup
        .string("Titre invalide")
        .required("L'intitulé du film est obligatoire pour la validation")
        .matches(/^[A-Za-zÀ-ÖØ-öø-ÿ0-9 \-\/_]{3,200}$/, "Cet intitulé de genre n'est pas disponible"),

    genres: yup
        .array()
        .of(yup.number().required())
        .min(1, "Un genre minimum est obligatoire pour la validation")
        .required("Un genre minimum est obligatoire pour la validation"),

    poster: yup
        .string("Lien poster invalide")
        .required("L'affiche du film est obligatoire pour la validation")
        .matches(/^(https?:\/\/[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(?:[\/\w\-._~:%+?#=]*)\.(?:jpg|jpeg|png|gif|webp|svg))$/i, "l'adresse de l'affiche n'est pas valide"),

    releaseDate: yup
        .date("Le format doit être au format date")
        .required("La date de sorti du film est obligatoire pour la validation"),

    description: yup
        .string("Pitch invalide")
        .required("Le pitch du film est obligatoire pour la validation")
});

const displayAdminPage = async (req, res) => {
    try {
        const genres = await GenresRepository.findAll();
        let films = await FilmsRepository.findAll();

        if (films.length > 0) {   
            films = formatterDateFilm(films);
        }

        let genreToModify = null;

        const flashIdGenreToModify = req.flash("idGenreToModify");
        const flashDisplayModifyGenreForm = req.flash("displayModifyGenreForm");

        const idGenreToModify = flashIdGenreToModify.length > 0 ? flashIdGenreToModify[0] : 0;
        const displayModifyGenreForm = flashDisplayModifyGenreForm.length > 0 ? flashDisplayModifyGenreForm[0] : false;

        if (displayModifyGenreForm) {
            genreToModify = await GenresRepository.findById(idGenreToModify);
            res.render("administration", {
                genres: {
                    list: genres,
                    displayModifyGenreForm: displayModifyGenreForm,
                    genreToModify: genreToModify
                },
                films: {
                    list: films
                },
                error: { genreError: req.flash("genreError") }
            });
        } else {
            res.render("administration", {
                genres: {
                    list: genres,
                    displayModifyGenreForm: displayModifyGenreForm,
                    genreToModify: genreToModify
                },
                films: {
                    list: films
                },
                error: { genreError: req.flash("genreError") }
            });
        }
    } catch (error) {
        let errorMessage = error.message;
        let genreError = req.flash("genreError");
        if (genreError.length > 0) {
            errorMessage = genreError[0];
        }
        res.render("administration", { genres: { list: [] }, films: { list: [] }, error: { genreError: errorMessage } });
    }
}

const addGenre = async (req, res) => {
    try {
        await genreSchema.validate(req.body);
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
            await modifyGenreSchema.validate(req.body);
            const nameKnown = await GenresRepository.nameAlreadyKnown(req.body.nameM);
            if (nameKnown) {
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
        await filmSchema.validate(req.body);
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
                adminId: 4
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

const formatterDateFilm = (films) => {
    let results = films;
    
    results.forEach(film => {
        film.releaseDate = dayjs(film.releaseDate).format("dddd D MMMM YYYY");
    });
    
    return results;
}

export default { displayAdminPage, addGenre, displayModifierGenreForm, modifierGenre, supprimerGenre, addFilm };