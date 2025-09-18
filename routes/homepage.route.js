import express from "express";
import HomepageController from "../controllers/homepage.controller.js";
import RoleService from "../services/role.service.js";
import { VIEW_LIBELLE } from "../constantes/views.js";

const router = express.Router();

router.use(RoleService.requireLogin);

router
    .get("/", HomepageController.displayView)
    .get(`/${VIEW_LIBELLE.FAVORIS}/:id`, HomepageController.addNewFavori)
    .post("/", HomepageController.searchByTitle);

export default router;