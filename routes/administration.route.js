import express from "express";
import AdministrationController from "../controllers/administration.controller.js";

const router = express.Router();

// router.use(AuthentificationService.requireRole("ADMIN"));

router
    .get("/genres/modify/:id", AdministrationController.displayModifierGenreForm)
    .get("/", AdministrationController.displayAdminPage)
    .get("/genres/:id", AdministrationController.supprimerGenre)
    .post("/genres/:id", AdministrationController.modifierGenre)
    .post("/genres", AdministrationController.addGenre)
    .post("/films", AdministrationController.addFilm);

export default router;