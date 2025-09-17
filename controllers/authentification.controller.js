import AuthentificationService from "../services/authentification.service.js";
import { VIEW_LIBELLE } from '../constantes/views.js';
import { AUTHENTIFICATION_LIBELLE } from "../constantes/authentification.js";

const displayInscriptionForm = (req, res) => {
    res.render(VIEW_LIBELLE.AUTHENTIFICATION, { 
        title: AUTHENTIFICATION_LIBELLE.INSCRIPTION_PAGE_TITLE, 
        form: VIEW_LIBELLE.INSCRIPTION, 
        errors: [], 
        currentRoute: req.url, 
        AUTHENTIFICATION_LIBELLE: AUTHENTIFICATION_LIBELLE,
        VIEW_LIBELLE: VIEW_LIBELLE
    });
}

const displayLoginForm = (req, res) => {
    res.render(VIEW_LIBELLE.AUTHENTIFICATION, { 
        title: AUTHENTIFICATION_LIBELLE.LOGIN_PAGE_TITLE, 
        form: VIEW_LIBELLE.LOGIN, 
        errors: [], 
        currentRoute: req.url, 
        AUTHENTIFICATION_LIBELLE: AUTHENTIFICATION_LIBELLE,
        VIEW_LIBELLE: VIEW_LIBELLE
    });
}

const inscription = async (req, res) => {
    try {
        await AuthentificationService.inscription(req);
        redirectToConnexion(res);
    } catch (error) {
        res.render(VIEW_LIBELLE.AUTHENTIFICATION, { 
            title: AUTHENTIFICATION_LIBELLE.INSCRIPTION_PAGE_TITLE, 
            form: VIEW_LIBELLE.INSCRIPTION, 
            errors: error.errors, 
            currentRoute: req.url, 
            AUTHENTIFICATION_LIBELLE: AUTHENTIFICATION_LIBELLE,
            VIEW_LIBELLE: VIEW_LIBELLE
        });
    }
}

const login = async (req, res) => {
    try {
        await AuthentificationService.login(req);
        res.redirect(`/${VIEW_LIBELLE.HOMEPAGE}`);
    } catch (error) {
        res.render(VIEW_LIBELLE.AUTHENTIFICATION, { 
            title: AUTHENTIFICATION_LIBELLE.LOGIN_PAGE_TITLE, 
            form: VIEW_LIBELLE.LOGIN, 
            errors: [error.message], 
            AUTHENTIFICATION_LIBELLE: AUTHENTIFICATION_LIBELLE,
            VIEW_LIBELLE: VIEW_LIBELLE,
            currentRoute: req.url
        });
    }
}

const redirectToConnexion = (res) => {
    res.redirect(`/${VIEW_LIBELLE.AUTHENTIFICATION}/${VIEW_LIBELLE.LOGIN}`);
}

export default { displayInscriptionForm, displayLoginForm, inscription, login };