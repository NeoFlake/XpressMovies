import FavorisRepository from "../repositories/favoris.repository.js";
import UsersRepository from "../repositories/users.repository.js";
import DateService from "../services/date.service.js";
import { FAVORI_LIBELLE, ROLE_LIBELLE } from "../constantes/views.js";
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

            return {
                films: films,
                navbar: navbar,
                card: card,
                FAVORI_LIBELLE: FAVORI_LIBELLE
            }
        } else {
            throw new Error(ERROR_LIBELLE.NO_FAVORI_FOUND);
        }
    } catch (error) {
        throw new Error(ERROR_LIBELLE.NO_FAVORI_FOUND);
    }
}

const remove = async (req) => {
    try {
        const withdrawFavorite = await FavorisRepository.removeByUserAndFilmId(req.session.userLogged.id, req.params.id);
        if (withdrawFavorite === 0) {
            throw new Error(ERROR_LIBELLE.REMOVE_FAVORI_FAIL);
        }
    } catch (error) {
        throw new Error(ERROR_LIBELLE.REMOVE_FAVORI_FAIL);
    }
}

export default { displayView, remove }