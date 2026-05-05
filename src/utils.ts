/**
 * Gets a value from a nested object using dot notation.
 */
export function getDeepValue(obj: any, path: string): any {
  return path.split('.').reduce((acc, part) => {
    if (acc && typeof acc === 'object') {
      return acc[part];
    }
    return undefined;
  }, obj);
}

/**
 * Sets a value in a nested object using dot notation.
 * Mutates the object.
 */
export function setDeepValue(obj: any, path: string, value: any): void {
  const parts = path.split('.');
  const lastPart = parts.pop()!;
  
  const target = parts.reduce((acc, part) => {
    if (!acc[part] || typeof acc[part] !== 'object') {
      acc[part] = {};
    }
    return acc[part];
  }, obj);
  
  target[lastPart] = value;
}

/**
 * Expands paths with wildcards (e.g., 'items.*.id') into concrete paths based on data.
 */
export function expandPaths(data: any, pattern: string): string[] {
  if (!pattern.includes('*')) return [pattern];

  const parts = pattern.split('.');
  let paths = [''];

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    const newPaths: string[] = [];

    for (const base of paths) {
      const currentPath = base ? `${base}.${part}` : part;
      
      if (part === '*') {
        const parentPath = base;
        const parentValue = parentPath ? getDeepValue(data, parentPath) : data;
        
        if (Array.isArray(parentValue)) {
          parentValue.forEach((_, index) => {
            newPaths.push(base ? `${base}.${index}` : `${index}`);
          });
        }
      } else {
        newPaths.push(currentPath);
      }
    }
    paths = newPaths;
  }

  return paths;
}
