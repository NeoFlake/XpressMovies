import express from "express";
import AuthentificationController from '../controllers/authentification.controller.js';
import { VIEW_LIBELLE } from "../constantes/views.js";

const router = express.Router();

router
.get(`/${VIEW_LIBELLE.INSCRIPTION}`, AuthentificationController.displayInscriptionForm)
.post(`/${VIEW_LIBELLE.INSCRIPTION}`, AuthentificationController.inscription)
.get(`/${VIEW_LIBELLE.LOGIN}`, AuthentificationController.displayLoginForm)
.post(`/${VIEW_LIBELLE.LOGIN}`, AuthentificationController.login);

export default router;