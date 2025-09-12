import express from "express";
import LogoutController from "../controllers/logout.controller.js";

const router = express.Router();

router
    .get("/", LogoutController.disconnect);

export default router;