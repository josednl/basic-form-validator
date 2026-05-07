/**
 * Gets a value from a nested object using dot notation.
 */
export declare function getDeepValue(obj: any, path: string): any;
/**
 * Sets a value in a nested object using dot notation.
 * Mutates the object.
 */
export declare function setDeepValue(obj: any, path: string, value: any): void;
/**
 * Expands paths with wildcards (e.g., 'items.*.id') into concrete paths based on data.
 */
export declare function expandPaths(data: any, pattern: string): string[];
