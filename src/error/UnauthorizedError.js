import BaseError from './baseError';
import { UNAUTHORIZED } from 'http-status-codes';

export default class UnauthorizedError extends BaseError {
  constructor(message, detailedMessages= [], code = UNAUTHORIZED) {
    super(message, code, UNAUTHORIZED);
    this.detailedMessages = detailedMessages;
  }
}