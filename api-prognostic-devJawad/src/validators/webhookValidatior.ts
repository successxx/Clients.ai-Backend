import Joi from "joi";

export const customerSubscriptionWebhookValidator = Joi.object({
  id: Joi.string().required(),
  object: Joi.string().valid("event").required(),
  api_version: Joi.string().required(),
  created: Joi.number().integer().required(),
  data: Joi.object({
    object: Joi.object({
      id: Joi.string().required(),
      amount_paid: Joi.number().optional(),
      created: Joi.number().integer().required(),
      metadata: Joi.object({
        userId: Joi.string().required(),
      }).required(),
    }).required(),
  }).required(),
  type: Joi.string()
    .valid("customer.subscription.created", "customer.subscription.updated")
    .required(),
});

export const invoicePaymentSucceededWebhookValidator = Joi.object({
  id: Joi.string().required(),
  object: Joi.string().valid("event").required(),
  api_version: Joi.string().required(),
  created: Joi.number().integer().required(),
  data: Joi.object({
    object: Joi.object({
      id: Joi.string().required(),
      amount_paid: Joi.number().optional(),
      created: Joi.number().integer().required(),
      subscription_details: Joi.object({
        metadata: Joi.object({
          userId: Joi.string().required(),
        }).required(),
      }).required(),
    }).required(),
  }).required(),
  type: Joi.string().valid("invoice.payment_succeeded").required(),
});
