import Joi from 'joi';

export const changePasswordValidator = Joi.object({
 email: Joi.string().email().required(),
  oldPassword: Joi.string().required(),
  newPassword: Joi.string().required()
});
