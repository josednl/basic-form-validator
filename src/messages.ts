export const defaultMessages: Record<string, string> = {
  'required': 'This field is required',
  'email': 'Invalid email format',
  'minLength': 'Minimum length is {min} characters',
  'isNumber': 'Value must be a number',
};

/**
 * Simple formatter to replace placeholders like {min} with actual values.
 */
export function formatMessage(message: string, params?: Record<string, any>): string {
  if (!params) return message;
  let formatted = message;
  for (const [key, value] of Object.entries(params)) {
    formatted = formatted.replace(new RegExp(`{${key}}`, 'g'), String(value));
  }
  return formatted;
}
