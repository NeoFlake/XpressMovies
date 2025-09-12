import yup from '../config/yup.config.js';

const modifyGenreSchema = yup.object().shape({
    nameM: yup
        .string("Genre invalide")
        .required("L'intitulé de genre est obligatoire pour la validation")
        .matches(/^[A-Za-zÀ-ÖØ-öø-ÿ ]{3,64}$/, "Cet intitulé de genre n'est pas disponible")
});

const genreSchema = yup.object().shape({
    name: yup
        .string("Genre invalide")
        .required("L'intitulé du genre est obligatoire pour la validation")
        .matches(/^[A-Za-zÀ-ÖØ-öø-ÿ ]{3,64}$/, "Cet intitulé de genre n'est pas disponible")
});

const filmSchema = yup.object().shape({
    title: yup
        .string("Titre invalide")
        .required("L'intitulé du film est obligatoire pour la validation")
        .matches(/^[A-Za-zÀ-ÖØ-öø-ÿ0-9 \-\/_]{3,200}$/, "Cet intitulé de genre n'est pas disponible"),

    genres: yup
        .array()
        .of(yup.number().required())
        .min(1, "Un genre minimum est obligatoire pour la validation")
        .required("Un genre minimum est obligatoire pour la validation"),

    poster: yup
        .string("Lien poster invalide")
        .required("L'affiche du film est obligatoire pour la validation")
        .matches(/^(https?:\/\/[^\s]+?\.(?:jpg|jpeg|png|gif|webp|svg))(?:\?.*)?$/i, "l'adresse de l'affiche n'est pas valide"),

    releaseDate: yup
        .date("Le format doit être au format date")
        .required("La date de sorti du film est obligatoire pour la validation"),

    description: yup
        .string("Pitch invalide")
        .required("Le pitch du film est obligatoire pour la validation")
});

const modifyFilmSchema = yup.object().shape({
    titleM: yup
        .string("Titre invalide")
        .required("L'intitulé du film est obligatoire pour la validation")
        .matches(/^[A-Za-zÀ-ÖØ-öø-ÿ0-9 \-\/_]{3,200}$/, "Cet intitulé de genre n'est pas disponible"),

    genresM: yup
        .array()
        .of(yup.number().required())
        .min(1, "Un genre minimum est obligatoire pour la validation")
        .required("Un genre minimum est obligatoire pour la validation"),

    posterM: yup
        .string("Lien poster invalide")
        .required("L'affiche du film est obligatoire pour la validation")
        .matches(/^(https?:\/\/[^\s]+?\.(?:jpg|jpeg|png|gif|webp|svg))(?:\?.*)?$/i, "l'adresse de l'affiche n'est pas valide"),

    releaseDateM: yup
        .date("Le format doit être au format date")
        .required("La date de sorti du film est obligatoire pour la validation"),

    descriptionM: yup
        .string("Pitch invalide")
        .required("Le pitch du film est obligatoire pour la validation")
});

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

const searchByTitleSchema = yup.object().shape({
    title: yup
        .string("Titre invalide")
        .required("L'intitulé du film est obligatoire pour la validation")
        .matches(/^[A-Za-zÀ-ÖØ-öø-ÿ0-9 \-\/_]{3,200}$/, "Ce titre de film n'est pas disponible"),
});

const updateProfileSchema = yup.object().shape({
    lastname: yup
        .string("Nom invalide")
        .required("Le nom est obligatoire pour modifier son compte")
        .matches(/^[A-Z]/, "Le nom doit commencer par une majuscule")
        .matches(/^[A-Z][a-zA-Z]{2,18}$/, "Le nom doit faire entre 3 et 19 caractères et ne contenir que des lettres"),

    firstname: yup
        .string("Prénom invalide")
        .required("Le prénom est obligatoire pour modifier son compte")
        .matches(/^[A-Z]/, "Le prénom doit commencer par une majuscule")
        .matches(/^[A-Z][a-zA-Z]{2,18}$/, "Le prénom doit faire entre 3 et 19 caractères et ne contenir que des lettres"),

    email: yup
        .string("Email invalide")
        .required("L'email est obligatoire pour modifier son compte")
        .matches(/[a-zA-Z0-9._%+-]+/, "L'email doit contenir uniquement des caractères valides avant le @")
        .matches(/@[a-zA-Z]+/, "L'email doit contenir un @ suivi d'un nom de domaine")
        .matches(/\.[a-zA-Z]+$/, "L'email doit se terminer par un domaine valide (.com, .fr, etc.)"),

    password: yup
        .string()
        .required("Le mot de passe est obligatoire pour modifier son compte")
        .min(10, "Le mot de passe doit contenir au moins 10 caractères")
        .matches(/[A-Z]/, "Le mot de passe doit contenir au moins une majuscule")
        .matches(/\d/, "Le mot de passe doit contenir au moins un chiffre")
        .matches(/[^a-zA-Z0-9]/, "Le mot de passe doit contenir au moins un caractère spécial"),

    newPassword: yup
        .string()
        .nullable()
        .notRequired()
        .test(
            "password-rules",
            "Le nouveau mot de passe doit contenir au moins 10 caractères, une majuscule, un chiffre et un caractère spécial",
            (value) => {
                if (!value) return true; // ignoré si vide
                return (
                    value.length >= 10 &&
                    /[A-Z]/.test(value) &&
                    /\d/.test(value) &&
                    /[^a-zA-Z0-9]/.test(value)
                );
            }
        ),

    confirmPassword: yup
        .string()
        .nullable()
        .notRequired()
        .test(
            "password-rules",
            "La confirmation du mot de passe doit contenir au moins 10 caractères, une majuscule, un chiffre et un caractère spécial",
            (value) => {
                if (!value) return true; // ignoré si vide
                return (
                    value.length >= 10 &&
                    /[A-Z]/.test(value) &&
                    /\d/.test(value) &&
                    /[^a-zA-Z0-9]/.test(value)
                );
            }
        )
});


export default { modifyGenreSchema, genreSchema, filmSchema, modifyFilmSchema, inscriptionSchema, searchByTitleSchema, updateProfileSchema };