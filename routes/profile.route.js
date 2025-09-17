import express from "express";
import ProfileController from "../controllers/profile.controller.js";
import RoleService from "../services/role.service.js";

const router = express.Router();

router.use(RoleService.requireLogin);

router
    .get("/", ProfileController.displayView)
    .get("/:id", ProfileController.remove)
    .post("/:id", ProfileController.update);

export default router;