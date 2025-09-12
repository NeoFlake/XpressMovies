import FilmsRepository from "../repositories/films.repository.js";
import UserRepository from "../repositories/users.repository.js";
import FavoriRepository from "../repositories/favoris.repository.js";
import DateService from '../services/date.service.js';

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
        const isAdmin = req.session.userLogged.role === "ADMIN" ? true : false;
        res.render("homepage", { 
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
            }
        });
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
        req.flash("error", error.message);
        res.redirect("/homepage");
    }
}

const addNewFavori = async (req, res) => {
    try {
        const favori = await FavoriRepository.add({
            userId: req.session.userLogged.id,
            filmId: req.params.id
        });
        if (favori > 0) {
            res.redirect("/homepage");
        } else {
            throw new Error("Votre favori n'a pas pu être ajouté");
        }
    } catch (error) {
        req.flash("error", error.message);
        res.redirect("/homepage");
    }
}

export default { displayView, searchByTitle, addNewFavori };