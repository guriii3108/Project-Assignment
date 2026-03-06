import Joi from "joi";

export const createTaskSchema = Joi.object({
    title: Joi.string().min(1).max(100).required(), //required while creating
    description: Joi.string().max(500).optional().allow(""),
    status: Joi.string().valid("pending", "in-progress", "completed").optional(),
});

export const updateTaskSchema = Joi.object({
    title: Joi.string().min(1).max(100).optional(), //optional while updating
    description: Joi.string().max(500).optional().allow(""),
    status: Joi.string().valid("pending", "in-progress", "completed").optional(),
});
