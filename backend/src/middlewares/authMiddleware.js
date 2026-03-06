import jwt from "jsonwebtoken";
import { errorResponse } from "../utils/responseFormatter.js";

export const verifyToken = (req, res, next) => {
    const token =
        req.cookies?.token || req.headers?.authorization?.split(" ")[1];

    if (!token) {
        return errorResponse(res, "Unauthorized: No token provided", 401);
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return errorResponse(
            res,
            "Unauthorized: Invalid or expired token",
            401,
        );
    }
};

export const isAdmin = (req, res, next) => {
    if (req.user?.role !== "admin") {
        return errorResponse(res, "Forbidden: Admins only", 403);
    }
    next();
};

