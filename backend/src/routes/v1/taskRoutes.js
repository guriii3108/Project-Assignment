import express from "express";
import { Router } from "express";
import {
    createTask, getTasks, getTaskById,
    updateTask, deleteTask,
    getAllTasksAdmin, deleteTaskAdmin,
} from "../../controllers/taskController.js";
import { verifyToken, isAdmin } from "../../middlewares/authMiddleware.js";

const router = Router();

// User routes (JWT required)
router.post("/create", verifyToken, createTask);
router.get("/", verifyToken, getTasks);
router.get("/:id", verifyToken, getTaskById);
router.put("/:id", verifyToken, updateTask);
router.delete("/:id", verifyToken, deleteTask);

// Admin routes (JWT + admin role required)
router.get("/admin/all", verifyToken, isAdmin, getAllTasksAdmin);
router.delete("/admin/:id", verifyToken, isAdmin, deleteTaskAdmin);

export default router;
