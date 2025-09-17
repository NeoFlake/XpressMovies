import AdministrationService from "../services/administration.service.js";
import { VIEW_LIBELLE } from "../constantes/views.js";

const displayAdminPage = async (req, res) => {
    try {
        const viewData = await AdministrationService.displayAdminPage(req);
        res.render(VIEW_LIBELLE.ADMINISTRATION, viewData);
    } catch (error) {
        res.redirect(`/${VIEW_LIBELLE.ADMINISTRATION}`);
    }
}

const displayModifierFilmForm = (req, res) => {
    AdministrationService.displayModifierFilmForm(req);
    res.redirect(`/${VIEW_LIBELLE.ADMINISTRATION}`);
}

const displayModifierGenreForm = (req, res) => {
    AdministrationService.displayModifierGenreForm(req);
    res.redirect(`/${VIEW_LIBELLE.ADMINISTRATION}`);
}

const addGenre = async (req, res) => {
    try {
        await AdministrationService.addGenre(req);
        res.redirect(`/${VIEW_LIBELLE.ADMINISTRATION}`);
    } catch (error) {
        res.redirect(`/${VIEW_LIBELLE.ADMINISTRATION}`);
    }
}

const modifierGenre = async (req, res) => {
    try {
        await AdministrationService.modifierGenre(req);
        res.redirect(`/${VIEW_LIBELLE.ADMINISTRATION}`);
    } catch (error) {
        res.redirect(`/${VIEW_LIBELLE.ADMINISTRATION}`);
    }
}

const supprimerGenre = async (req, res) => {
    try {
        await AdministrationService.supprimerGenre(req);
        res.redirect(`/${VIEW_LIBELLE.ADMINISTRATION}`);
    } catch (error) {
        res.redirect(`/${VIEW_LIBELLE.ADMINISTRATION}`);
    }
}

const addFilm = async (req, res) => {
    try {
        await AdministrationService.addFilm(req);
        res.redirect(`/${VIEW_LIBELLE.ADMINISTRATION}`);
    } catch (error) {
        res.redirect(`/${VIEW_LIBELLE.ADMINISTRATION}`);
    }
}

const supprimerFilm = async (req, res) => {
    try {
        await AdministrationService.supprimerFilm(req);
        res.redirect(`/${VIEW_LIBELLE.ADMINISTRATION}`);
    } catch (error) {
        res.redirect(`/${VIEW_LIBELLE.ADMINISTRATION}`);
    }
}

const modifierFilm = async (req, res) => {
    try {
        await AdministrationService.modifierFilm(req);
        res.redirect(`/${VIEW_LIBELLE.ADMINISTRATION}`);
    } catch (error) {
        res.redirect(`/${VIEW_LIBELLE.ADMINISTRATION}`);
    }
}

export default { displayAdminPage, addGenre, displayModifierGenreForm, modifierGenre, supprimerGenre, addFilm, supprimerFilm, displayModifierFilmForm, modifierFilm };