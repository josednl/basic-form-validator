export const enMessages = {
    'required': 'This field is required',
    'email': 'Invalid email format',
    'minLength': 'Minimum length is {min} characters',
    'isNumber': 'This field must be a number',
    'min': 'Minimum value is {min}'
};
export const esMessages = {
    'required': 'Este campo es obligatorio',
    'email': 'Formato de correo electrónico inválido',
    'minLength': 'La longitud mínima es de {min} caracteres',
    'isNumber': 'Este campo debe ser un número',
    'min': 'El valor mínimo es {min}'
};
export const defaultMessages = enMessages;
export const translations = {
    en: enMessages,
    es: esMessages,
};
/**
 * Simple formatter to replace placeholders like {min} with actual values.
 */
export function formatMessage(message, params) {
    if (!params)
        return message;
    let formatted = message;
    for (const [key, value] of Object.entries(params)) {
        formatted = formatted.replace(new RegExp(`{${key}}`, 'g'), String(value));
    }
    return formatted;
}
