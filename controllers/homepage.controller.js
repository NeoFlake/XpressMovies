import FilmsRepository from "../repositories/films.repository.js";
import UserRepository from "../repositories/users.repository.js";
import yup from '../config/yup.config.js';
import dayjs from "dayjs";
import "dayjs/locale/fr.js";

dayjs.locale("fr");

const searchByTitleSchema = yup.object().shape({
    title: yup
        .string("Titre invalide")
        .required("L'intitulé du film est obligatoire pour la validation")
        .matches(/^[A-Za-zÀ-ÖØ-öø-ÿ0-9 \-\/_]{3,200}$/, "Ce titre de film n'est pas disponible"),
});

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

            console.log(films);
            
        } else {
            films = await FilmsRepository.findAll();
        }
        res.render("homepage", { films: films, error: "", isAdmin: req.session.userLogged.role === "ADMIN" ? true : false });
    } catch (error) {
        res.render("homepage", { films: [], error: error.message });
    }
}

const searchByTitle = async (req, res) => {
    try {
        await searchByTitleSchema.validate(req.body);
        req.flash("searchByTitle", true);
        req.flash("titleSearched", req.body.title);
        res.redirect("/homepage");
    } catch (error) {
        res.redirect("/homepage");
    }
}

export default { displayView, searchByTitle };