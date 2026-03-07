import express from "express";
import { Router  } from "express";
import rateLimit from "express-rate-limit";
import { register, login, logout, getProfile } from "../../controllers/authController.js";
import { verifyToken } from "../../middlewares/authMiddleware.js";
import validate from "../../middlewares/validate.js";
import { registerSchema, loginSchema } from "../../validators/authValidator.js";

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, //minutes in milliseconds
    max: 10, //max attempts(from same IP)
    message: { success: false, message: "Too many attempts, please try again after 15 minutes" },
    standardHeaders: true,   // sends RateLimit headers in response
    legacyHeaders: false, //old header format disabled
});


const router = Router();

router.post("/register",authLimiter, validate(registerSchema), register);
router.post("/login", authLimiter, validate(loginSchema), login);
router.post("/logout", logout);
router.get("/profile", verifyToken, getProfile);  // protected

export default router;
