import { VIEW_LIBELLE } from "../constantes/views.js";
import { FRONT } from "../constantes/profile.js";
import { AUTHENTIFICATION_LIBELLE } from "../constantes/authentification.js";
import ProfileService from "../services/profile.service.js";

const displayView = async (req, res) => {
    try {
        const profile = await ProfileService.displayView(req);
        res.render(VIEW_LIBELLE.PROFILE, profile);
    } catch (error) {
        res.render(VIEW_LIBELLE.PROFILE, {
            FRONT: FRONT, 
            AUTHENTIFICATION_LIBELLE: AUTHENTIFICATION_LIBELLE, 
            VIEW_LIBELLE: VIEW_LIBELLE
        });
    }
}

const update = async (req, res) => {
    try {
        await ProfileService.update(req);
        res.redirect(`/${VIEW_LIBELLE.PROFILE}`);
    } catch (error) {
        res.redirect(`/${VIEW_LIBELLE.PROFILE}`);
    }
}

const remove = async (req, res) => {
    try {
        await ProfileService.remove(req);
        res.redirect(`/${VIEW_LIBELLE.AUTHENTIFICATION}${VIEW_LIBELLE.LOGIN}`);
    } catch (error) {
        res.redirect(`/${VIEW_LIBELLE.PROFILE}`);
    }
}

export default { displayView, update, remove };