import express from "express";
import HomepageController from "../controllers/homepage.controller.js";
import AuthentificationService from "../services/authentification.service.js";

const router = express.Router();

router.use(AuthentificationService.requireLogin);

router
    .get("/", HomepageController.displayView);

export default router;