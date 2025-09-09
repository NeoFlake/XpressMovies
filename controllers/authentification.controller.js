import UserRepository from "../repositories/users.repository.js";
import yup from '../config/yup.config.js';
import bcrypt from 'bcrypt';

const saltRounds = 10;

const inscriptionSchema = yup.object().shape({
    lastnameI: yup
        .string("Nom invalide")
        .required("Le nom est obligatoire pour s'inscrire")
        .matches(/^[A-Z]/, "Le nom doit commencer par une majuscule")
        .matches(/^[A-Z][a-zA-Z]{2,18}$/, "Le nom doit faire entre 3 et 19 caractères et ne contenir que des lettres"),

    firstnameI: yup
        .string("Prénom invalide")
        .required("Le prénom est obligatoire pour s'inscrire")
        .matches(/^[A-Z]/, "Le prénom doit commencer par une majuscule")
        .matches(/^[A-Z][a-zA-Z]{2,18}$/, "Le prénom doit faire entre 3 et 19 caractères et ne contenir que des lettres"),

    emailI: yup
        .string("Email invalide")
        .required("L'email est obligatoire pour s'inscrire")
        .matches(/[a-zA-Z0-9._%+-]+/, "L'email doit contenir uniquement des caractères valides avant le @")
        .matches(/@[a-zA-Z]+/, "L'email doit contenir un @ suivi d'un nom de domaine")
        .matches(/\.[a-zA-Z]+$/, "L'email doit se terminer par un domaine valide (.com, .fr, etc.)"),

    passwordI: yup
        .string()
        .required("Le mot de passe est obligatoire pour s'inscrire")
        .min(10, "Le mot de passe doit contenir au moins 10 caractères")
        .matches(/[A-Z]/, "Le mot de passe doit contenir au moins une majuscule")
        .matches(/\d/, "Le mot de passe doit contenir au moins un chiffre")
        .matches(/[^a-zA-Z0-9]/, "Le mot de passe doit contenir au moins un caractère spécial")
});

const displayInscriptionForm = (req, res) => {
    res.render('authentification', { title: "Inscription", form: "inscription", errors: [] });
}

const displayLoginForm = (req, res) => {
    res.render('authentification', { title: "Connexion", form: "login", errors: [] });
}

const inscription = async (req, res) => {
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
                const emailUsed = await UserRepository.findByEmail(user.email);
                if (emailUsed !== 0) {
                    throw new Error("Veuillez changer d'email");
                } else {
                    await UserRepository.add(user);
                    redirectToConnexion(res);
                }
            } catch (error) {

                res.render('authentification', { title: "Inscription", form: "inscription", errors: [error.message] });
            }
        });
    } catch (error) {
        res.render('authentification', { title: "Inscription", form: "inscription", errors: error.errors });
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
                
                res.redirect("/homepage");

            } else {
  
            };
        }
    } catch (error) {
        res.render('authentification', { title: "Connexion", form: "login", errors: ["Vos identifiants sont incorrects"] });
    }
}

const redirectToConnexion = (res) => {
    res.redirect("/authentification/login");
}

export default { displayInscriptionForm, displayLoginForm, inscription, login };