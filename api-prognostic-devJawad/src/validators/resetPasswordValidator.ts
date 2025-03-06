
const Joi = require("joi");

export const resetPasswordValidator =  Joi.object({
    email: Joi.string().email().required(),
    token: Joi.string().required(),
    newPassword: Joi.string()
    .min(8)
    .regex(
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[#?!@$%^&*-]).{8,}$/
    )
    .required()
    .messages({
      "string.min": "Password should have a minimum length of 8 characters",
      "string.pattern.base":
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
    }),
})