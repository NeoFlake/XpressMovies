import express from "express";
import AuthentificationService from "../services/authentification.service.js";
import FavorisController from "../controllers/favoris.controller.js";

const router = express.Router();

router.use(AuthentificationService.requireRole("ABONNE"));

router
    .get("/", FavorisController.displayView)
    .get("/:id", FavorisController.remove);

export default router;