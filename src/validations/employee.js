import Joi from 'joi';

const validateCreation = (req, res, next) => {
  const employeeJoiSchema = Joi.object({
    name: Joi.string()
      .required()
      .pattern(/^([A-Za-z]+ )+[A-Za-z]+$|^[A-Za-z]+$/u)
      .min(3)
      .messages({
        'string.pattern.base':
          "For property 'name' : '{name}' all characters must be letters.",
      }),
    lastName: Joi.string()
      .required()
      .pattern(/^([A-Za-z]+ )+[A-Za-z]+$|^[A-Za-z]+$/u)
      .min(3)
      .messages({
        'string.pattern.base':
          "For property 'lastName' : '{lastName}' all characters must be letters.",
      }),
    phone: Joi.string()
      .required()
      .pattern(/^[0-9]+$/)
      .min(9)
      .messages({
        'string.pattern.base':
          "For property 'phone' : '{phone}' all characters must be digits.",
      }),
    email: Joi.string()
      .required()
      .email(),
    password: Joi.string()
      .required()
      .pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/),
  });

  const validation = employeeJoiSchema.validate(req.body, { abortEarly: false });

  if (validation.error) {
    return res.status(400).json({
      message: `There was an error: ${validation.error.message}`,
      error: true,
    });
  }
  return next();
};

const validateUpdate = (req, res, next) => {
  const employeeJoiSchema = Joi.object({
    name: Joi.string()
      .required()
      .pattern(/^([A-Za-z]+ )+[A-Za-z]+$|^[A-Za-z]+$/u)
      .min(3)
      .messages({
        'string.pattern.base':
          "For property 'name' : '{name}' all characters must be letters.",
      }),
    lastName: Joi.string()
      .required()
      .pattern(/^([A-Za-z]+ )+[A-Za-z]+$|^[A-Za-z]+$/u)
      .min(3)
      .messages({
        'string.pattern.base':
          "For property 'lastName' : '{lastName}' all characters must be letters.",
      }),
    phone: Joi.string()
      .required()
      .pattern(/^[0-9]+$/)
      .min(9)
      .messages({
        'string.pattern.base':
          "For property 'phone' : '{phone}' all characters must be digits.",
      }),
    email: Joi.string()
      .required()
      .email(),
    password: Joi.string()
      .pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/),
  });

  const validation = employeeJoiSchema.validate(req.body, { abortEarly: false });

  if (validation.error) {
    return res.status(400).json({
      message: `There was an error: ${validation.error.message}`,
      error: true,
    });
  }
  return next();
};

export { validateCreation, validateUpdate };
