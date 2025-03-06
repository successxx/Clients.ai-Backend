const Joi = require("joi");

export const userQueryValidator = Joi.object({
  page: Joi.number().optional().allow(null),
  pageSize: Joi.number().optional().allow(null),
  lastName: Joi.string().allow(null).empty(""),
  email: Joi.string().allow(null).empty(""),
}).unknown();

export const userParamValidator = Joi.object({
  id: Joi.number().required(),
}).unknown();

export const userPayloadValidator = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string()
    .min(8)
    .regex(/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[#?!@$%^&*-]).{8,}$/)
    .required()
    .messages({
      "string.min": "Password should have a minimum length of 8 characters",
      "string.pattern.base":
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
    }),
  confirmPassword: Joi.string().required().valid(Joi.ref("password")).messages({
    "any.only": "Passwords do not match",
  }),
  phoneNumber: Joi.string()
    .required()
    .pattern(/^[0-9]+$/)
    .messages({
      "string.pattern.base": "Phone number must be a number",
    }),
}).unknown();

export const userLoginPayloadValidator = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
}).unknown();

export const userProfileImagePayloadValidator = Joi.object({
  id: Joi.number().required(),
  profileImage: Joi.any().required(),
}).unknown();

export const otpPayloadValidator = Joi.object({
  id: Joi.number().required(),
  otp: Joi.string()
    .pattern(/^[0-9]{6}$/)
    .required()
    .messages({
      "string.pattern.base": "Invalid OTP. Please enter a 6-digit number.",
    }),
}).unknown();

export const refreshTokenSchema = Joi.object({
  refreshToken: Joi.string().required(),
}).unknown();
