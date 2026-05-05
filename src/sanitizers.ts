import type { SanitizerRule } from './types.js';

export const trim: SanitizerRule = (value: any) => {
  return typeof value === 'string' ? value.trim() : value;
};

export const toLowerCase: SanitizerRule = (value: any) => {
  return typeof value === 'string' ? value.toLowerCase() : value;
};

export const toUpperCase: SanitizerRule = (value: any) => {
  return typeof value === 'string' ? value.toUpperCase() : value;
};

export const toNumber: SanitizerRule = (value: any) => {
  const parsed = parseFloat(value);
  return isNaN(parsed) ? value : parsed;
};

export const escape: SanitizerRule = (value: any) => {
  if (typeof value !== 'string') return value;
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    "/": '&#x2F;',
  };
  return value.replace(/[&<>"'/]/g, (m) => map[m]);
};
