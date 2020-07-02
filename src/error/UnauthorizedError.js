import BaseError from './baseError';
import { UNAUTHORIZED } from 'http-status-codes';

export default class UnauthorizedError extends BaseError {
  constructor(message, code = 'Unauthorized', detailedMessages = []) {
    super(message, code, UNAUTHORIZED);
    this.detailedMessages = detailedMessages;
  }
}