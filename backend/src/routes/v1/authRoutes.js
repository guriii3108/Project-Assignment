import express from "express";
import { Router  } from "express";
import { register, login, logout, getProfile } from "../../controllers/authController.js";
import { verifyToken } from "../../middlewares/authMiddleware.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/profile", verifyToken, getProfile);  // protected

export default router;
