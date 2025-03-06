import Joi from "joi";

export const offerSchema = Joi.object({
  id: Joi.number().integer().optional().messages({
    "number.base": "id must be a number",
  }),
  offerName: Joi.string().required().messages({
    "string.empty": "Offer name is required",
    "any.required": "Offer name is mandatory",
  }),

  price: Joi.string().optional().allow(null, "").messages({
    "string.base": "Price must be a string",
  }),

  offerDescription: Joi.string().required().messages({
    "string.empty": "Offer description is required",
    "any.required": "Offer description is mandatory",
  }),

  primaryBenefits: Joi.string().required().messages({
    "string.empty": "Primary benefits are required",
    "any.required": "Primary benefits are mandatory",
  }),

  targetActionURL: Joi.string().uri().required().messages({
    "string.empty": "Target action URL is required",
    "string.uri": "Target action URL must be a valid URL",
    "any.required": "Target action URL is mandatory",
  }),

  userId: Joi.number().integer().required().messages({
    "number.base": "User ID must be a number",
    "any.required": "User ID is mandatory",
  }),
});

export const getOffersQueryValidator = Joi.object({
  page: Joi.number().integer().positive().default(1).messages({
    "number.base": "Page must be a number",
    "number.integer": "Page must be an integer",
    "number.positive": "Page must be a positive number",
  }),

  pageSize: Joi.number().integer().positive().default(10).messages({
    "number.base": "Page size must be a number",
    "number.integer": "Page size must be an integer",
    "number.positive": "Page size must be a positive number",
  }),

  search: Joi.string().optional().allow("").messages({
    "string.base": "Search must be a string",
  }),
});

export const getOfferDetailsQueryValidator = Joi.object({
  id: Joi.number().integer().positive().messages({
    "number.base": "Page must be a number",
    "number.integer": "Page must be an integer",
    "number.positive": "Page must be a positive number",
  }),
});
