import FavorisService from "../services/favoris.service.js";
import { VIEW_LIBELLE } from "../constantes/views.js";

const displayView = async (req, res) => {
    try {
        const favoris = await FavorisService.displayView(req);
        res.render(VIEW_LIBELLE.FAVORIS, favoris);
    } catch (error) {
        res.redirect(`/${VIEW_LIBELLE.HOMEPAGE}`);
    }
}

const remove = async (req, res) => {
    try {
        await FavorisService.remove(req);
        res.redirect(`/${VIEW_LIBELLE.FAVORIS}`);
    } catch (error) {
        res.redirect(`/${VIEW_LIBELLE.FAVORIS}`);
    }
}

export default { displayView, remove }