import { defaultMessages } from './messages.js';

export const esMessages: Record<string, string> = {
  'required': 'Este campo es obligatorio',
  'email': 'Formato de correo electrónico inválido',
  'minLength': 'La longitud mínima es de {min} caracteres',
  'isNumber': 'El valor debe ser un número',
};

export const translations: Record<string, Record<string, string>> = {
  en: defaultMessages,
  es: esMessages,
};
