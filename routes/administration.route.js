import express from "express";
import AdministrationController from "../controllers/administration.controller.js";
import RoleService from "../services/role.service.js";

const router = express.Router();

router.use(RoleService.requireRole("ADMIN"));

router
    .get("/genres/update/:id", AdministrationController.displayModifierGenreForm)
    .get("/films/update/:id", AdministrationController.displayModifierFilmForm)
    .get("/", AdministrationController.displayAdminPage)
    .get("/genres/:id", AdministrationController.supprimerGenre)
    .get("/films/:id", AdministrationController.supprimerFilm)
    .post("/genres/:id", AdministrationController.modifierGenre)
    .post("/genres", AdministrationController.addGenre)
    .post("/films", AdministrationController.addFilm)
    .post("/films/:id", AdministrationController.modifierFilm);

export default router;