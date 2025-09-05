import UserRepository from "../repositories/users.repository.js";
import yup from '../config/yup.config.js';
import bcrypt from 'bcrypt';

const saltRounds = 10;

const inscriptionSchema = yup.object().shape({
    lastnameI: yup
        .string()
        .required()
        .matches(/^[A-Z][a-zA-Z]{2,18}$/),
    firstnameI: yup
        .string()
        .required()
        .matches(/^[A-Z][a-zA-Z]{2,18}$/),
    emailI: yup
        .string()
        .required()
        .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z]+\.[a-zA-Z]+$/),
    passwordI: yup
        .string()
        .required()
        .matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{10,}$/)
});

const displayInscriptionForm = (req, res) => {
    res.render('authentification', { title: "Inscription", form: "inscription", errors: [] });
}

const displayLoginForm = (req, res) => {
    res.render('authentification', { title: "Connexion", form: "login", errors: [] });
}

const inscription = async (req, res, next) => {
    try {
        await inscriptionSchema.validate(req.body, { abortEarly: false });
        bcrypt.hash(req.body.passwordI, saltRounds, async function (err, passwordHashed) {
            try {
                const user = {
                    lastname: req.body.lastnameI,
                    firstname: req.body.firstnameI,
                    email: req.body.emailI,
                    password: passwordHashed
                };
                await UserRepository.add(user);
                redirectToConnexion(res);
            } catch (error) {
                res.render('authentification', { title: "Inscription", form: "inscription", errors: [error] });
            }
        });
    } catch (error) {
        res.render('authentification', { title: "Inscription", form: "inscription", errors: [error] });
    }
}

const redirectToConnexion = (res) => {
    res.redirect("/authentification/login");
}

export default { displayInscriptionForm, displayLoginForm, inscription };