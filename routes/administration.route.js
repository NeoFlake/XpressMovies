import express from "express";
import AdministrationController from "../controllers/administration.controller.js";
import RoleService from "../services/role.service.js";
import { ROLE_LIBELLE, VIEW_LIBELLE } from "../constantes/views.js";

const router = express.Router();

router.use(RoleService.requireRole(ROLE_LIBELLE.ADMIN));

router
    .get(`/${VIEW_LIBELLE.GENRES}/${VIEW_LIBELLE.UPDATE}/:id`, AdministrationController.displayModifierGenreForm)
    .get(`/${VIEW_LIBELLE.FILMS}/${VIEW_LIBELLE.UPDATE}/:id`, AdministrationController.displayModifierFilmForm)
    .get("/", AdministrationController.displayAdminPage)
    .get(`/${VIEW_LIBELLE.GENRES}/:id`, AdministrationController.supprimerGenre)
    .get(`/${VIEW_LIBELLE.FILMS}/:id`, AdministrationController.supprimerFilm)
    .post(`/${VIEW_LIBELLE.GENRES}/:id`, AdministrationController.modifierGenre)
    .post(`/${VIEW_LIBELLE.GENRES}`, AdministrationController.addGenre)
    .post(`/${VIEW_LIBELLE.FILMS}`, AdministrationController.addFilm)
    .post(`/${VIEW_LIBELLE.FILMS}/:id`, AdministrationController.modifierFilm);

export default router;