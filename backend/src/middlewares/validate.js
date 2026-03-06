import Joi from "joi";

const validate = (schema) => (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
        const message = error.details.map((d) => d.message).join(", ");
        return res.status(400).json({ success: false, message });
    }
    next();
};

export default validate;

//abort early means it returns all error at once.. not juss the first line