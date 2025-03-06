import Joi from "joi";

export const webhookValidator = Joi.object({
  id: Joi.string().required(),
  object: Joi.string().valid("event").required(),
  api_version: Joi.string().required(),
  created: Joi.number().integer().required(),
  data: Joi.object({
    object: Joi.object({
      id: Joi.string().required(),
      amount_paid: Joi.number().required(),
      created: Joi.number().integer().required(),
      metadata: Joi.object({
        userId: Joi.string().required(),
      }).required(),
    }).required(),
  }).required(),
  type: Joi.string().valid("invoice.payment_succeeded").required(),
});