import UserRepository from "../repositories/users.repository.js";
import validationService from "../services/validation.service.js";
import bcrypt from 'bcrypt';

const saltRounds = 10;

const displayView = async (req, res) => {
    try {
        const user = await UserRepository.findById(req.session.userLogged.id);
        res.render("profile", { user: user });
    } catch (error) {
        res.render("profile");
    }
}

const update = async (req, res) => {
    try {
        await validationService.updateProfileSchema.validate(req.body);
        const emailAlreadyExist = await UserRepository.findByEmail(req.body.email);
        const user = await UserRepository.findById(req.session.userLogged.id);
        if (req.params.id === req.body.id) {
            if (req.body.email !== user.email && emailAlreadyExist.length > 0) {
                throw new Error("Vous ne pouvez pas utiliser cet email");
            } else {
                if (bcrypt.compareSync(req.body.password, user.password)) {
                    let updatedUser = {
                        lastname: req.body.lastname,
                        firstname: req.body.firstname,
                        email: req.body.email,
                        password: user.password
                    };
                    if (req.body.newPassword.length > 0) {
                        if (req.body.newPassword === req.body.confirmPassword) {
                            bcrypt.hash(req.body.newPassword, saltRounds, async function (err, passwordHashed) {
                                try {
                                    updatedUser.password = passwordHashed;
                                    const update = await UserRepository.updateById(req.body.id, updatedUser);
                                    if (update > 0) {
                                        res.redirect("/profile");
                                    } else {
                                        throw new Error("Échec lors de la sauvegarde de votre mise à jour");
                                    }
                                } catch (error) {
                                    res.redirect("/profile");
                                }
                            });
                        } else {
                            throw new Error("Votre nouveau mot de passe n'est pas confirmé");
                        }
                    } else {
                        const update = await UserRepository.updateById(req.body.id, updatedUser);
                        if (update > 0) {
                            res.redirect("/profile");
                        } else {
                            throw new Error("Échec lors de la sauvegarde de votre mise à jour");
                        }
                    }
                } else {
                    throw new Error("Mot de passe incorrect");
                }
            }
        } else {
            throw new Error("Erreur technique lors de la tentative de modification de votre compte; contactez le service de maintenance");
        }
    } catch (error) {
        res.redirect("/profile");
    }
}

export default { displayView, update };