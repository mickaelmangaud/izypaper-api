import Ajv from 'ajv';
import AjvErros from 'ajv-errors';

export const ajv = new Ajv({ allErrors:true, jsonPointers:true });
AjvErros(ajv);

export { default as loginSchema } from './login.schema.json';
export { default as registerSchema } from './login.schema.json';