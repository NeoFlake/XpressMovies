import express from "express";
import AuthentificationService from "../services/authentification.service.js";

const router = express.Router();

router.use(AuthentificationService.requireRole("ABONNE"));

router
    .get("/", FavorisController.displayView);

export default router;