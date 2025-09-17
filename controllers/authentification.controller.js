import UserRepository from "../repositories/users.repository.js";
import AuthentificationService from "../services/authentification.service.js";
import bcrypt from 'bcrypt';
import { VIEW_LIBELLE } from '../constantes/views.js';
import { ERROR_LIBELLE } from "../constantes/errors.js";
import { AUTHENTIFICATION_LIBELLE } from "../constantes/authentification.js";

const displayInscriptionForm = (req, res) => {
    res.render(VIEW_LIBELLE.AUTHENTIFICATION, { 
        title: "Inscription", 
        form: VIEW_LIBELLE.INSCRIPTION, 
        errors: [], 
        currentRoute: req.url, 
        AUTHENTIFICATION_LIBELLE: AUTHENTIFICATION_LIBELLE });
}

const displayLoginForm = (req, res) => {
    res.render(VIEW_LIBELLE.AUTHENTIFICATION, { title: "Connexion", form: VIEW_LIBELLE.LOGIN, errors: [], currentRoute: req.url, AUTHENTIFICATION_LIBELLE: AUTHENTIFICATION_LIBELLE });
}

const inscription = async (req, res) => {
    try {
        await AuthentificationService.inscription(req);
        redirectToConnexion(res);
    } catch (error) {
        res.render(VIEW_LIBELLE.AUTHENTIFICATION, { title: "Inscription", form: VIEW_LIBELLE.INSCRIPTION, errors: error.errors, currentRoute: req.url, AUTHENTIFICATION_LIBELLE: AUTHENTIFICATION_LIBELLE });
    }
}

const login = async (req, res) => {
    try {
        const user = await UserRepository.findByEmail(req.body.emailC);
        if (user === 0) {
            throw new Error();
        } else {               
            if (bcrypt.compareSync(req.body.passwordC, user.password)) {
                
                req.session.userLogged = {
                    id: user.id,
                    lastname: user.lastname,
                    firstname: user.firstname,
                    email: user.email,
                    role: user.role
                };
                
                res.redirect(`/${VIEW_LIBELLE.HOMEPAGE}`);

            } else {
  
            };
        }
    } catch (error) {
        res.render(VIEW_LIBELLE.AUTHENTIFICATION, { title: "Connexion", form: VIEW_LIBELLE.LOGIN, errors: [ERROR_LIBELLE.AUTHENTIFICATION_FAIL], AUTHENTIFICATION_LIBELLE: AUTHENTIFICATION_LIBELLE });
    }
}

const redirectToConnexion = (res) => {
    res.redirect(`/${VIEW_LIBELLE.AUTHENTIFICATION}/${VIEW_LIBELLE.LOGIN}`);
}

export default { displayInscriptionForm, displayLoginForm, inscription, login };