import * as Joi from 'joi';

export const createRoleSchema = Joi.object({
  name: Joi.string().required(),
});
