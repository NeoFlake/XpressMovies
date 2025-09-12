import UserRepository from "../repositories/users.repository.js";
import ValidationService from "../services/validation.service.js";
import bcrypt from 'bcrypt';

const saltRounds = 10;

const displayInscriptionForm = (req, res) => {
    res.render('authentification', { title: "Inscription", form: "inscription", errors: [] });
}

const displayLoginForm = (req, res) => {
    res.render('authentification', { title: "Connexion", form: "login", errors: [] });
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