import Joi from "joi";


const leadSourceEnum = ["WEB", "PHONE", "EMAIL", "REFERRAL", "OTHER"];


export const leadSchema = Joi.object({
  firstName: Joi.string().required().messages({
    "string.base": "First name must be a string",
    "any.required": "First name is required",
  }),
  lastName: Joi.string().optional().allow(null, "").messages({
    "string.base": "Last name must be a string",
  }),
  email: Joi.string().email().required().messages({
    "string.email": "Email must be a valid email address",
    "any.required": "Email is required",
  }),
  phone: Joi.string().optional().allow(null, "").messages({
    "string.base": "Phone number must be a string",
  }),
  source: Joi.string()
    .valid(...leadSourceEnum)
    .required()
    .messages({
      "any.only": `Source must be one of ${leadSourceEnum.join(", ")}`,
      "any.required": "Source is required",
    }),
});


export const leadIdSchema = Joi.object({
  id: Joi.number().integer().positive().required().messages({
    "number.base": "ID must be a number",
    "any.required": "ID is required",
  }),
});




export const leadQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1).messages({
    "number.base": "Page must be a number",
    "number.min": "Page must be at least 1",
  }),
  limit: Joi.number().integer().min(1).default(10).messages({
    "number.base": "Limit must be a number",
    "number.min": "Limit must be at least 1",
  }),
  source: Joi.string()
    .valid("WEB", "PHONE", "EMAIL", "REFERRAL", "OTHER")
    .optional()
    .messages({
      "any.only": "Source must be one of WEB, PHONE, EMAIL, REFERRAL, OTHER",
    }),
  email: Joi.string().optional().messages({
    "string.base": "Email must be a string",
  }),
});