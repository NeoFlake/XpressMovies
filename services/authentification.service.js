import UserRepository from "../repositories/users.repository.js";
import ValidationService from "../services/validation.service.js";
import bcrypt from 'bcrypt';
import { VIEW_LIBELLE } from '../constantes/views.js';
import { ERROR_LIBELLE } from "../constantes/errors.js";
import { AUTHENTIFICATION_LIBELLE } from "../constantes/authentification.js";

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

export default { inscription }