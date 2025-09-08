import express from "express";
import AuthentificationController from '../controllers/authentification.controller.js';

const router = express.Router();

router
    .get("", AuthentificationController.displayInscriptionForm);

export default router;