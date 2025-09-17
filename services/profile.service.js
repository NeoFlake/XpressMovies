import { ERROR_LIBELLE } from "../constantes/errors.js";
import { ROLE_LIBELLE, VIEW_LIBELLE } from "../constantes/views.js";
import { FRONT } from "../constantes/profile.js";
import { AUTHENTIFICATION_LIBELLE } from "../constantes/authentification.js";
import UserRepository from "../repositories/users.repository.js";
import validationService from "../services/validation.service.js";
import bcrypt from 'bcrypt';

const saltRounds = 10;

const displayView = async (req) => {
    try {
        const user = await UserRepository.findById(req.session.userLogged.id);
        return {
            user: user,
            navbar: {
                isAdmin: req.session.userLogged.role === ROLE_LIBELLE.ADMIN ? true : false,
                favoris: user.favoris.filter(f => f !== null).length,
                currentRoute: req.baseUrl,
                lastname: user.lastname,
                firstname: user.firstname
            },
            FRONT: FRONT,
            AUTHENTIFICATION_LIBELLE: AUTHENTIFICATION_LIBELLE,
            VIEW_LIBELLE: VIEW_LIBELLE
        };
    } catch (error) {
        throw new Error(ERROR_LIBELLE.PROFILE_DISPLAY_ERROR);
    }
}

const update = async (req) => {
    try {
        await validationService.updateProfileSchema.validate(req.body);
        const emailAlreadyExist = await UserRepository.findByEmail(req.body.email);
        const user = await UserRepository.findById(req.session.userLogged.id);
        if (req.params.id === req.body.id) {
            if (req.body.email !== user.email && emailAlreadyExist.length > 0) {
                throw new Error(ERROR_LIBELLE.EMAIL_ALDREADY_EXIST);
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
                            updatedUser.password = await bcrypt.hash(req.body.newPassword, saltRounds);
                            const update = await UserRepository.updateById(req.body.id, updatedUser);
                            if (update === 0) {
                                throw new Error(ERROR_LIBELLE.UPDATE_PROFILE_FAIL);
                            }
                        } else {
                            throw new Error(ERROR_LIBELLE.UPDATE_PASSWORD_FAIL);
                        }
                    } else {
                        const update = await UserRepository.updateById(req.body.id, updatedUser);
                        if (update === 0) {
                            throw new Error(ERROR_LIBELLE.UPDATE_PROFILE_DB_ERROR);
                        }
                    }
                } else {
                    throw new Error(ERROR_LIBELLE.BAD_PASSWORD);
                }
            }
        } else {
            throw new Error(ERROR_LIBELLE.TECHNICAL_ERROR_WHEN_PROFILE_MODIFICATION);
        }
    } catch (error) {
        throw new Error(error.message);
    }
}

const remove = async (req) => {
    try {
        const remove = await UserRepository.deleteById(req.params.id);
        if (remove > 0) {
            delete req.session.userLogged;
        } else {
            throw new Error(ERROR_LIBELLE.REMOVE_PROFILE_FAIL);
        }
    } catch (error) {
        throw new Error(ERROR_LIBELLE.REMOVE_PROFILE_FAIL);
    }
}

export default { displayView, update, remove };