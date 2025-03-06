import Joi from 'joi';

export const updateProfileValidator = Joi.object({
  id: Joi.number().required(),
  name: Joi.string().min(1).max(100).optional(),
  email: Joi.string().email().optional(),
  password: Joi.string().min(6).optional(),
  confirmPassword: Joi.string().valid(Joi.ref('password')).optional(),
  phoneNumber: Joi.string().min(10).max(15).optional(),
  profileImage: Joi.string().uri().optional(),
});

export const updateUserProfileValidator = Joi.object({
  id: Joi.number().required(),
  name: Joi.string().min(1).max(100).optional(),
  phoneNumber: Joi.string().min(10).max(15).optional(),
  profileImage: Joi.any().optional(),
});