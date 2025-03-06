import Joi from "joi";

export const subscriptionValidator = Joi.object({
  userId: Joi.number().integer().required(),
  plan: Joi.valid("monthly", "yearly").required(),
});