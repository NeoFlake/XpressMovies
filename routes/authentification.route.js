import express from "express";
import AuthentificationController from '../controllers/authentification.controller.js';

const router = express.Router();

router
.get("/inscription", AuthentificationController.displayInscriptionForm)
.post("/inscription", AuthentificationController.inscription)
.get("/login", AuthentificationController.displayLoginForm)
.post("/login", AuthentificationController.login);

export default router;