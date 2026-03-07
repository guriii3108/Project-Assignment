import Joi from "joi";

export const createTaskSchema = Joi.object({
    title: Joi.string().min(1).max(100).required(), //required while creating
    description: Joi.string().max(500).optional().allow(""),
    status: Joi.string()
        .valid("pending", "in-progress", "completed")
        .optional(),
    priority: Joi.string()
        .valid("low", "medium", "high", "critical")
        .optional(),
    dueDate: Joi.date().iso().optional().allow(null),
});

export const updateTaskSchema = Joi.object({
    title: Joi.string().min(1).max(100).optional(), //optional while updating
    description: Joi.string().max(500).optional().allow(""),
    status: Joi.string()
        .valid("pending", "in-progress", "completed")
        .optional(),
    priority: Joi.string()
        .valid("low", "medium", "high", "critical")
        .optional(),
    dueDate: Joi.date().iso().optional().allow(null),
});
