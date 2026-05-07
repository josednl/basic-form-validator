export const required = (value) => {
    if (value === undefined || value === null || value === '') {
        return { key: 'required' };
    }
    return null;
};
export const email = (value) => {
    if (!value)
        return null; // Let 'required' handle empty values
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (typeof value !== 'string' || !emailRegex.test(value)) {
        return { key: 'email' };
    }
    return null;
};
export const minLength = (min) => (value) => {
    if (!value)
        return null;
    if ((typeof value !== 'string' && !Array.isArray(value)) || value.length < min) {
        return { key: 'minLength', params: { min } };
    }
    return null;
};
export const isNumber = (value) => {
    if (value === undefined || value === null)
        return null;
    if (typeof value !== 'number' || isNaN(value)) {
        return { key: 'isNumber' };
    }
    return null;
};
export const min = (minValue) => (value) => {
    if (value === undefined || value === null)
        return null;
    if (typeof value !== 'number' || value < minValue) {
        return { key: 'min', params: { min: minValue } };
    }
    return null;
};
export const when = (condition, rules) => async (value, context) => {
    const shouldRun = await condition(context);
    if (!shouldRun)
        return null;
    for (const rule of rules) {
        const error = await rule(value, context);
        if (error)
            return error;
    }
    return null;
};
