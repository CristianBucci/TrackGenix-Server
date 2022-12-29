import Joi from 'joi';

const validateCreation = (req, res, next) => {
  const superAdminValidation = Joi.object({
    name: Joi.string().min(3).pattern(/^([A-Za-z]+ )+[A-Za-z]+$|^[A-Za-z]+$/u).required(),
    lastName: Joi.string().min(3).pattern(/^([A-Za-z]+ )+[A-Za-z]+$|^[A-Za-z]+$/u).required(),
    email: Joi.string().email().required(),
    password: Joi.string().pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/).required(),
  });

  const validation = superAdminValidation.validate(req.body, { abortEarly: false });

  if (validation.error) {
    return res.status(400).json({
      message: `There was an error: ${validation.error.message}`,
      error: true,
    });
  }
  return next();
};

const validateUpdate = (req, res, next) => {
  const superAdminValidation = Joi.object({
    name: Joi.string().min(3).pattern(/^([A-Za-z]+ )+[A-Za-z]+$|^[A-Za-z]+$/u).required(),
    lastName: Joi.string().min(3).pattern(/^([A-Za-z]+ )+[A-Za-z]+$|^[A-Za-z]+$/u).required(),
    email: Joi.string().email().required(),
    password: Joi.string().pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/).required(),
  });

  const validation = superAdminValidation.validate(req.body, { abortEarly: false });

  if (validation.error) {
    return res.status(400).json({
      message: `There was an error: ${validation.error.message}`,
      error: true,
    });
  }
  return next();
};

export { validateCreation, validateUpdate };
