import express from "express";
import ProfileController from "../controllers/profile.controller.js";
import AuthentificationService from "../services/authentification.service.js";

const router = express.Router();

router.use(AuthentificationService.requireLogin);

router
    .get("/", ProfileController.displayView)
    .get("/:id", ProfileController.remove)
    .post("/:id", ProfileController.update);

export default router;