import express from "express";
import RoleService from "../services/role.service.js";
import FavorisController from "../controllers/favoris.controller.js";
import { ROLE_LIBELLE } from "../constantes/views.js";

const router = express.Router();

router.use(RoleService.requireRole(ROLE_LIBELLE.ABONNE));

router
    .get("/", FavorisController.displayView)
    .get("/:id", FavorisController.remove);

export default router;