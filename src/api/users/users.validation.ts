import * as Joi from 'joi';

export const createUserSchema = Joi.object({
  first_name: Joi.string().required(),
  middle_name: Joi.string(),
  last_name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  role_id: Joi.number(),
});
