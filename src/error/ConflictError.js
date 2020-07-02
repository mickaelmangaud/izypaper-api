import BaseError from './baseError';
import { CONFLICT } from 'http-status-codes';

export default class ConflictError extends BaseError {
  constructor(message, code = 'UserAlreadyExists') {
    super(message, code, CONFLICT);    
  }

}