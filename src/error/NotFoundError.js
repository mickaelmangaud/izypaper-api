import BaseError from './baseError';
import { NOT_FOUND } from 'http-status-codes';

export default class NotFoundError extends BaseError {
  constructor(message, code = 'NotFound') {
    super(message, code, NOT_FOUND);
  }
}