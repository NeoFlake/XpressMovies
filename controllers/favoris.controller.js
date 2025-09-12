import FavorisRepository from "../repositories/favoris.repository.js";
import UsersRepository from "../repositories/users.repository.js";
import DateService from "../services/date.service.js";

const displayView = async (req, res) => {
    try {
        const user = await UsersRepository.findById(req.session.userLogged.id);
        
        if (user.favoris.filter(f => f !== null).length > 0) {
            const films = DateService.formatterDateFilm(user.favoris);
            
            res.render("favoris", {
                films: films,
                navbar: {
                    isAdmin: req.session.userLogged.role === "ADMIN" ? true : false,
                    favoris: user.favoris.filter(f => f !== null).length,
                    currentRoute: req.baseUrl,
                    lastname: user.lastname,
                    firstname: user.firstname
                }
            });
        } else {
            console.log("Je rentre ici et ce n'est pas normal");
            
            res.redirect("/homepage");
        }
    } catch (error) {
        console.log("Je rentre ici et c'est encore moins normal", error.message);
        
        res.redirect("/homepage");
    }
}

const remove = async (req, res) => {
    try {
        const withdrawFavorite = FavorisRepository.removeByUserAndFilmId(req.session.userLogged.id, req.params.id);
        if (withdrawFavorite > 0) {
            res.redirect("/favoris");
        } else {
            throw new Error("Le retrait de la liste des favoris n'a pu s'effectuer");
        }
    } catch (error) {
        res.redirect("/favoris");
    }
}

export default { displayView, remove }