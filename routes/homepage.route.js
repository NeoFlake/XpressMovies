import express from "express";
import AuthentificationController from "../controllers/authentification.controller.js";
import AuthentificationService from "../services/authentification.service.js";

const router = express.Router();

router
    .get("/", AuthentificationService.requireLogin , AuthentificationController.displayLoginForm);

export default router;