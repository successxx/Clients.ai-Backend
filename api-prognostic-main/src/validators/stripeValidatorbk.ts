const Joi = require("joi");

export const createPaymentValidator = Joi.object({
  amount: Joi.number().min(1).required(),
  currency: Joi.string().valid("usd", "eur").required(),
});

export const createSubscriptionValidator = Joi.object({
  userId: Joi.number().required(),
  plan: Joi.string().valid("monthly", "yearly").required(),
});
