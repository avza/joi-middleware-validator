const BaseError = require('./base-error');

class BadRequestException extends BaseError {
  constructor(errors = [], request = {}, description = 'bad request') {
    super('BAD REQUEST', 400, description);

    this.errors = errors;
    this.request = request;
  }
}

module.exports = BadRequestException;
