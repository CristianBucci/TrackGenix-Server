import Joi from 'joi';

const validateCreate = (req, res, next) => {
  const timesheetValidation = Joi.object({
    description: Joi.string().required(),
    date: Joi.date().max('now').required(),
    hours: Joi.number().integer().min(0).max(12)
      .required(),
    task: Joi.string().alphanum().length(24).required(),
    employee: Joi.string().alphanum().length(24).required(),
    project: Joi.string().alphanum().length(24).required(),
  });

  const validation = timesheetValidation.validate(req.body, { abortEarly: false });

  if (validation.error) {
    return res.status(400).json({
      message: `There was an error: ${validation.error.message}`,
      error: true,
    });
  }
  return next();
};

const validateUpdate = (req, res, next) => {
  const timesheetValidation = Joi.object({
    description: Joi.string().optional(),
    date: Joi.date().max('now').optional(),
    hours: Joi.number().integer().min(0).max(12)
      .optional(),
    task: Joi.string().alphanum().length(24).optional(),
    employee: Joi.string().alphanum().length(24).optional(),
    project: Joi.string().alphanum().length(24).optional(),
  });

  const validation = timesheetValidation.validate(req.body, { abortEarly: false });

  if (validation.error) {
    return res.status(400).json({
      message: `There was an error: ${validation.error.message}`,
      error: true,
    });
  }
  return next();
};

export default {
  validateCreate,
  validateUpdate,
};
