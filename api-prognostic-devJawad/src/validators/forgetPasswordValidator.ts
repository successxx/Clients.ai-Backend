
const Joi = require("joi");

export const forgetPasswordValidator = Joi.object({
    email: Joi.string().email().required(),
  });
  