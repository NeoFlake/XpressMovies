import express from "express";
import AdministrationController from "../controllers/administration.controller.js";
import AuthentificationService from "../services/authentification.service.js";

const router = express.Router();

//router.use(AuthentificationService.requireRole("ADMIN"));

router
    .get("/genres/modify/:id", AdministrationController.displayModifierGenreForm)
    .get("/", AdministrationController.displayAdminPage)
    .get("/genres/:id", AdministrationController.supprimerGenre)
    .get("/films/:id", AdministrationController.supprimerFilm)
    .post("/genres/:id", AdministrationController.modifierGenre)
    .post("/genres", AdministrationController.addGenre)
    .post("/films", AdministrationController.addFilm);

export default router;