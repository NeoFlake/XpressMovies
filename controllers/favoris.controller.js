import FavorisRepository from "../repositories/favoris.repository.js";
import UsersRepository from "../repositories/users.repository.js";
import DateService from "../services/date.service.js";
import { FAVORI_LIBELLE, ROLE_LIBELLE } from "../constantes/views.js";
import { VIEW_LIBELLE } from "../constantes/views.js";
import { ERROR_LIBELLE } from "../constantes/errors.js";

const displayView = async (req, res) => {
    try {
        const user = await UsersRepository.findById(req.session.userLogged.id);

        if (user.favoris.filter(f => f !== null).length > 0) {
            const films = DateService.formatterDateFilm(user.favoris);

            const isAdmin = req.session.userLogged.role === ROLE_LIBELLE.ADMIN ? true : false;

            const card = {
                user: user,
                films: films,
                isAdmin: isAdmin,
                currentRoute: req.baseUrl
            };

            const navbar = {
                isAdmin: isAdmin,
                favoris: user.favoris.filter(f => f !== null).length,
                currentRoute: req.baseUrl,
                lastname: user.lastname,
                firstname: user.firstname
            };

            res.render(VIEW_LIBELLE.FAVORIS, {
                films: films,
                navbar: navbar,
                card: card,
                FAVORI_LIBELLE: FAVORI_LIBELLE
            });

        } else {
            res.redirect(`/${VIEW_LIBELLE.HOMEPAGE}`);
        }
    } catch (error) {
        res.redirect(`/${VIEW_LIBELLE.HOMEPAGE}`);
    }
}

const remove = async (req, res) => {
    try {
        const withdrawFavorite = await FavorisRepository.removeByUserAndFilmId(req.session.userLogged.id, req.params.id);
        if (withdrawFavorite > 0) {
            res.redirect(`/${VIEW_LIBELLE.FAVORIS}`);
        } else {
            throw new Error(ERROR_LIBELLE.REMOVE_FAVORI_FAIL);
        }
    } catch (error) {
        res.redirect(`/${VIEW_LIBELLE.FAVORIS}`);
    }
}

export default { displayView, remove }