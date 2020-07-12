import Ajv from 'ajv';
import AjvErros from 'ajv-errors';

export const ajv = new Ajv({ allErrors:true, jsonPointers:true });
AjvErros(ajv);