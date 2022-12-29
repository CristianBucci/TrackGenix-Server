import Joi from 'joi';

const updateTaskValidation = (req, res, next) => {
  const taskValidation = Joi.object({
    description: Joi.string().valid('BE', 'FE').required(),
  });

  const validation = taskValidation.validate(req.body, { abortEarly: false });

  if (validation.error) {
    return res.status(400).json({
      message: `There was an error: ${validation.error.message}`,
      error: true,
    });
  }
  return next();
};

export default {
  updateTaskValidation,
};
