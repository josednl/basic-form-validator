export declare const enMessages: Record<string, string>;
export declare const esMessages: Record<string, string>;
export declare const defaultMessages: Record<string, string>;
export declare const translations: Record<string, Record<string, string>>;
/**
 * Simple formatter to replace placeholders like {min} with actual values.
 */
export declare function formatMessage(message: string, params?: Record<string, any>): string;
