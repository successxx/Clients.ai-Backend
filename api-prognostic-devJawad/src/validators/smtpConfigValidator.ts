import Joi from "joi";

export const smtpConfigSchema = Joi.object({
  smtpHost: Joi.string().required(),
  smtpPort: Joi.number().integer().required(),
  smtpUser: Joi.string().email().required(),
  smtpPassword: Joi.string().required(),
  useSSL: Joi.boolean().required(),
});

export const smtpEmailSchema = Joi.object({
  smtpEmail: Joi.string().required(),
});
