const Joi = require('joi');
const BadRequestException = require('./exceptions/bad-request');

const locations = ['body', 'query', 'params', 'headers'];

function validator(rules) {
  return (req, res, next) => {
    if (!rules) {
      return next();
    }

    const data = {};
    setValue(req, data, rules);

    const options = {
      abortEarly: false,
      allowUnknown: true,
      stripUnknown: true,
    };

    const schema = Joi.object(rules);

    const { error, value } = schema.validate(data, options);

    if (error) {
      const validation = error.details.reduce(
        (obj, err) =>
          Object.assign(obj, {
            [err.context.key]: err.context.label,
          }),
        {}
      );

      return next(new BadRequestException(validation, req.body));
    } else {
      setValue(value, req, rules);
      return next();
    }
  };
}

function setValue(data, dest, rules) {
  locations
    .filter((key) => rules[key])
    .forEach((key) => (dest[key] = data[key]));
}

module.exports = validator;
