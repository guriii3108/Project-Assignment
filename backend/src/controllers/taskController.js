import Task from "../models/Task.js";
import { successResponse, errorResponse } from "../utils/responseFormatter.js";

// Create a task
export const createTask = async (req, res) => {
    try {
        const { title, description, status, priority, dueDate } = req.body;
        if (!title) return errorResponse(res, "Title is required", 400);

        const task = await Task.create({
            title,
            description,
            status,
            priority,
            dueDate,
            owner: req.user.userId,
        });
        return successResponse(res, task, "Task created", 201);
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};

// Get all tasks (own tasks for user)
export const getTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ owner: req.user.userId }).sort({
            createdAt: -1,
        });
        return successResponse(res, tasks, "Tasks fetched");
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};

// Get single task
export const getTaskById = async (req, res) => {
    try {
        const task = await Task.findOne({
            _id: req.params.id,
            owner: req.user.userId,
        });
        if (!task) return errorResponse(res, "Task not found", 404);
        return successResponse(res, task, "Task fetched");
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};

// Update task
export const updateTask = async (req, res) => {
    try {
        const task = await Task.findOneAndUpdate(
            { _id: req.params.id, owner: req.user.userId },
            req.body,
            { new: true, runValidators: true },
        );
        if (!task) return errorResponse(res, "Task not found", 404);
        return successResponse(res, task, "Task updated");
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};

// Delete task
export const deleteTask = async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({
            _id: req.params.id,
            owner: req.user.userId,
        });
        if (!task) return errorResponse(res, "Task not found", 404);
        return successResponse(res, null, "Task deleted");
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};

// ---- ADMIN ONLY ----

// Get ALL tasks (admin sees everyone's)
export const getAllTasksAdmin = async (req, res) => {
    try {
        const tasks = await Task.find()
            .populate("owner", "name email role")
            .sort({ createdAt: -1 });
        return successResponse(res, tasks, "All tasks fetched");
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};

// Delete any task (admin)
export const deleteTaskAdmin = async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);
        if (!task) return errorResponse(res, "Task not found", 404);
        return successResponse(res, null, "Task deleted by admin");
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};
