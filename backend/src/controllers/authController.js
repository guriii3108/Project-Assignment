import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { successResponse, errorResponse } from "../utils/responseFormatter.js";

// REGISTER
export const register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        if (!name || !email || !password) {
            return errorResponse(res, "All fields are required", 400);
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return errorResponse(res, "Email already registered", 409);
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: role === "admin" ? "admin" : "user",
        });

        return successResponse(
            res,
            {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
            "User registered successfully",
            201,
        );
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};

// LOGIN
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return errorResponse(res, "Email and password are required", 400);
        }

        const user = await User.findOne({ email });
        if (!user) {
            return errorResponse(res, "Invalid credentials", 401);
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return errorResponse(res, "Invalid credentials", 401);
        }

        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1d" },
        );

        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 1 * 24 * 60 * 60 * 1000, // 1 day
            sameSite: "none",
        });

        return successResponse(
            res,
            {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token,
            },
            "Login successful",
        );
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};

// LOGOUT
export const logout = async (req, res) => {
    try {
        res.clearCookie("token");
        return successResponse(res, null, "Logged out successfully");
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};

// GET PROFILE (protected)
export const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select("-password");
        if (!user) return errorResponse(res, "User not found", 404);
        return successResponse(res, user, "Profile fetched");
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};
