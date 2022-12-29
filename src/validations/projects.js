import Joi from 'joi';

const createValidation = (req, res, next) => {
  const employeeValidation = Joi.object({
    employeeId: Joi.string().required(),
    role: Joi.string().valid('DEV', 'PM', 'QA', 'TL').required(),
    rate: Joi.number().required(),
  });

  const projectsValidation = Joi.object({
    name: Joi.string().pattern(/^([A-Za-z]+ )+[A-Za-z]+$|^[A-Za-z]+$/u).required(),
    description: Joi.string().required(),
    startDate: Joi.date().required(),
    endDate: Joi.date().greater('now').required(),
    clientName: Joi.string().pattern(/^([A-Za-z]+ )+[A-Za-z]+$|^[A-Za-z]+$/u).required(),
    employees: Joi.array().items(employeeValidation),
  });

  const validation = projectsValidation.validate(req.body, { abortEarly: false });

  if (validation.error) {
    return res.status(400).json({
      message: `There was an error: ${validation.error.message}`,
      error: true,
    });
  }
  return next();
};
export default createValidation;
