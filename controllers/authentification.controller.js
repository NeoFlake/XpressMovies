import UserRepository from "../repositories/users.repository.js";
import ValidationService from "../services/validation.service.js";
import bcrypt from 'bcrypt';
import { VIEW_LIBELLE } from '../constantes/views.js';
import { ERROR_LIBELLE } from "../constantes/errors.js";
import { AUTHENTIFICATION_LIBELLE } from "../constantes/authentification.js";

const saltRounds = 10;

const displayInscriptionForm = (req, res) => {
    res.render(VIEW_LIBELLE.AUTHENTIFICATION, { title: "Inscription", form: VIEW_LIBELLE.INSCRIPTION, errors: [], AUTHENTIFICATION_LIBELLE: AUTHENTIFICATION_LIBELLE });
}

const displayLoginForm = (req, res) => {
    res.render(VIEW_LIBELLE.AUTHENTIFICATION, { title: "Connexion", form: VIEW_LIBELLE.LOGIN, errors: [], AUTHENTIFICATION_LIBELLE: AUTHENTIFICATION_LIBELLE });
}

const inscription = async (req, res) => {
    try {
        await ValidationService.inscriptionSchema.validate(req.body, { abortEarly: false });
        bcrypt.hash(req.body.passwordI, saltRounds, async function (err, passwordHashed) {
            try {
                const user = {
                    lastname: req.body.lastnameI,
                    firstname: req.body.firstnameI,
                    email: req.body.emailI,
                    password: passwordHashed
                };
                const emailUsed = await UserRepository.findByEmail(user.email);
                if (emailUsed !== 0) {
                    throw new Error(ERROR_LIBELLE.EMAIL_ALREADY_EXIST);
                } else {
                    await UserRepository.add(user);
                    redirectToConnexion(res);
                }
            } catch (error) {

                res.render(VIEW_LIBELLE.AUTHENTIFICATION, { title: "Inscription", form: VIEW_LIBELLE.INSCRIPTION, errors: [error.message], AUTHENTIFICATION_LIBELLE: AUTHENTIFICATION_LIBELLE });
            }
        });
    } catch (error) {
        res.render(VIEW_LIBELLE.AUTHENTIFICATION, { title: "Inscription", form: VIEW_LIBELLE.INSCRIPTION, errors: error.errors, AUTHENTIFICATION_LIBELLE: AUTHENTIFICATION_LIBELLE });
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