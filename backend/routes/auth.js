import express from "express";
const router = express.Router();

import { register, login, getMe, getAllUsers, makeAdmin } from "../controllers/authController.js";
import { admin, protect } from "../middleware/authMiddleware.js";

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, getMe);
router.get("/users", protect, admin, getAllUsers);
router.patch("/users/:id/role", protect, admin, makeAdmin);

export default router;
