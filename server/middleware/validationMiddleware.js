import Joi from 'joi';

// 1. User Registration Validation
export const validateRegistration = (req, res, next) => {
  const schema = Joi.object({
    firstName: Joi.string().min(2).max(30).required(),
    lastName: Joi.string().min(2).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid('consumer', 'manufacturer', 'regulator').default('consumer'),
    // Allow optional organization details only if they are provided
    organizationDetails: Joi.object({
      orgName: Joi.string().optional().allow(''),
      orgAddress: Joi.string().optional().allow(''),
      orgLicense: Joi.string().optional().allow('')
    }).optional()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    res.status(400);
    // Send a clean error message to the frontend
    throw new Error(error.details[0].message.replace(/"/g, ''));
  }
  next();
};

// 2. Product Batch Creation Validation
export const validateProductBatch = (req, res, next) => {
  const schema = Joi.object({
    batchNumber: Joi.string().required().trim(),
    productName: Joi.string().required().trim(),
    // Expiry must be in the future
    expiryDate: Joi.date().greater('now').required().messages({
      'date.greater': 'Expiry date must be in the future'
    }),
    manufacturingDate: Joi.date().required(),
    // Allow metadata map
    productAttributes: Joi.object().pattern(Joi.string(), Joi.string()).optional(),
    // Allow quantity for the limit calculation we added in Phase 1
    quantity: Joi.number().integer().min(1).optional()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    res.status(400);
    throw new Error(error.details[0].message.replace(/"/g, ''));
  }
  next();
};