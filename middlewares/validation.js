const { Joi, celebrate } = require("celebrate");
const validator = require("validator");

// Custom URL validator for Joi
const validateURL = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.error("string.uri");
};

// 1. Clothing item body validation
const validateCardBody = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      "string.min": 'The minimum length of the "name" field is 2',
      "string.max": 'The maximum length of the "name" field is 30',
      "string.empty": 'The "name" field must be filled in',
    }),
    imageUrl: Joi.string().required().custom(validateURL).messages({
      "string.empty": 'The "imageUrl" field must be filled in',
      "string.uri": 'The "imageUrl" field must be a valid url',
    }),
    weather: Joi.string().required().valid("hot", "warm", "cold"),
  }),
});

// 2. User creation body validation
const validateUserBody = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    avatar: Joi.string().required().custom(validateURL).messages({
      "string.empty": 'The "avatar" field must be filled in',
      "string.uri": 'The "avatar" field must be a valid url',
    }),
    email: Joi.string().required().email().messages({
      "string.empty": 'The "email" field must be filled in',
      "string.email": 'The "email" field must be a valid email',
    }),
    password: Joi.string().required().messages({
      "string.empty": 'The "password" field must be filled in',
    }),
  }),
});

// 3. Login validation
const validateLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email().messages({
      "string.empty": 'The "email" field must be filled in',
      "string.email": 'The "email" field must be a valid email',
    }),
    password: Joi.string().required().messages({
      "string.empty": 'The "password" field must be filled in',
    }),
  }),
});

// 4. ID validation for params (userId, itemId, etc.)
const validateId = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().hex().length(24),
    itemId: Joi.string().hex().length(24),
  }),
});

// 5. Profile update validation
const validateProfileUpdate = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    avatar: Joi.string().custom(validateURL).messages({
      "string.uri": 'The "avatar" field must be a valid url',
    }),
  }),
});

module.exports = {
  validateCardBody,
  validateUserBody,
  validateLogin,
  validateId,
  validateProfileUpdate,
};
