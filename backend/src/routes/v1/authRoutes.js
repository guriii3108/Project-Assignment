import express from "express";
import { Router  } from "express";
import { register, login, logout, getProfile } from "../../controllers/authController.js";
import { verifyToken } from "../../middlewares/authMiddleware.js";
import validate from "../../middlewares/validate.js";
import { registerSchema, loginSchema } from "../../validators/authValidator.js";

const router = Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.post("/logout", logout);
router.get("/profile", verifyToken, getProfile);  // protected

export default router;
