export default class BaseError extends Error {
  constructor(message, code, status) {
    super();
    this.message = message;
    this.code = code;
    this.status = status;

    Error.captureStackTrace(this, this.constructor);
  }
}
