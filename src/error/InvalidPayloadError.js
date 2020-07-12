import BaseError from './baseError';
import { BAD_REQUEST } from 'http-status-codes';

export default class InvalidPayloadError extends BaseError {
  static CODE = {
    BAD_ARGUMENT: 'BadArgument',
    MISSING_PARAMETER: 'MISSING_PARAMETER',
  }

  constructor(message, detailedMessages = [], code = InvalidPayloadError.CODE.BAD_ARGUMENT) {
    super(message, code, BAD_REQUEST);
    this.detailedMessages = detailedMessages;
  }
}