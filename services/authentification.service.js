import UserRepository from "../repositories/users.repository.js";
import ValidationService from "../services/validation.service.js";
import bcrypt from 'bcrypt';
import { ERROR_LIBELLE } from "../constantes/errors.js";

const saltRounds = 10;

const inscription = async (req) => {
    try {
        await ValidationService.inscriptionSchema.validate(req.body, { abortEarly: false });
        const passwordHashed = await bcrypt.hash(req.body.passwordI, saltRounds);
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
        }
    } catch (error) {
        throw new Error(error.message);
    }
}

const login = async (req) => {
    try {
        const user = await UserRepository.findByEmail(req.body.emailC);
        if (user === 0) {
            throw new Error(ERROR_LIBELLE.AUTHENTIFICATION_FAIL);
        } else {
            if (bcrypt.compareSync(req.body.passwordC, user.password)) {
                req.session.userLogged = {
                    id: user.id,
                    lastname: user.lastname,
                    firstname: user.firstname,
                    email: user.email,
                    role: user.role
                };
            } else {
                throw new Error(ERROR_LIBELLE.AUTHENTIFICATION_FAIL);
            };
        }
    } catch (error) {
        throw new Error(error.message);
    }
}

export default { inscription, login }