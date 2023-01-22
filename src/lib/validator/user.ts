import Joi from 'joi';

export const editUserValidator = Joi.object({
  firstName: Joi.string().min(2).max(25).trim().label('firstName'),
  lastName: Joi.string().min(2).max(25).trim().label('lastName'),
  DOB: Joi.string().isoDate().label('DOB'),
  phone: Joi.string().min(4).max(55).trim().pattern(/[0-9]/).label('phone'),
});
