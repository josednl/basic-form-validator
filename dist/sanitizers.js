export const trim = (value) => {
    return typeof value === 'string' ? value.trim() : value;
};
export const toLowerCase = (value) => {
    return typeof value === 'string' ? value.toLowerCase() : value;
};
export const toUpperCase = (value) => {
    return typeof value === 'string' ? value.toUpperCase() : value;
};
export const toNumber = (value) => {
    const parsed = parseFloat(value);
    return isNaN(parsed) ? value : parsed;
};
export const escape = (value) => {
    if (typeof value !== 'string')
        return value;
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        "/": '&#x2F;',
    };
    return value.replace(/[&<>"'/]/g, (m) => map[m]);
};
