import fs from 'node:fs';
import { Validator } from './validator.js';
import * as rules from './rules.js';
import * as sanitizers from './sanitizers.js';
import { translations } from './messages.js';
/**
 * CLI Entry Point
 */
export async function runCLI() {
    const args = process.argv.slice(2);
    const help = args.includes('--help') || args.includes('-h');
    if (args.length === 0 || help) {
        console.log(`
Usage:
  form-validator <json-file> [options]
  form-validator '<json-string>' [options]

Options:
  -f, --format <format>  Output format: json (default), table
  -l, --lang <lang>      Language for error messages: en (default), es
  -h, --help             Show this help message

Example:
  form-validator data.json --format table --lang es
  form-validator '{"name": "John"}' -f json -l en
    `);
        process.exit(0);
    }
    // Basic argument parsing
    let format = 'json';
    const formatIndex = args.findIndex(arg => arg === '--format' || arg === '-f');
    if (formatIndex !== -1 && args[formatIndex + 1]) {
        format = args[formatIndex + 1];
        args.splice(formatIndex, 2);
    }
    let lang = 'en';
    const langIndex = args.findIndex(arg => arg === '--lang' || arg === '-l');
    if (langIndex !== -1 && args[langIndex + 1]) {
        lang = args[langIndex + 1];
        args.splice(langIndex, 2);
    }
    let inputData;
    const firstArg = args[0];
    if (!firstArg) {
        console.error('Error: Missing input JSON file or string.');
        process.exit(1);
    }
    try {
        if (fs.existsSync(firstArg)) {
            const fileContent = fs.readFileSync(firstArg, 'utf-8');
            inputData = JSON.parse(fileContent);
        }
        else {
            inputData = JSON.parse(firstArg);
        }
    }
    catch (error) {
        console.error('Error: Invalid JSON input or file not found.');
        process.exit(1);
    }
    const data = inputData.data || inputData;
    const rawConfig = inputData.config || {
        rules: {
            email: ['required', 'email'],
            age: ['isNumber']
        }
    };
    // Load language messages if specified and not already in config
    if (!rawConfig.messages && translations[lang]) {
        rawConfig.messages = translations[lang];
    }
    // Resolve strings to actual functions
    const resolvedRules = {};
    for (const field in rawConfig.rules) {
        resolvedRules[field] = rawConfig.rules[field].map(r => {
            if (typeof r === 'string') {
                const [name, ...args] = r.split(':');
                const ruleFn = rules[name];
                if (!ruleFn)
                    throw new Error(`Rule not found: ${name}`);
                // If it's a factory (has args), call it; otherwise use as is
                return args.length > 0 ? ruleFn(...args.map(a => isNaN(Number(a)) ? a : Number(a))) : ruleFn;
            }
            return r;
        });
    }
    const resolvedSanitizers = {};
    if (rawConfig.sanitizers) {
        for (const field in rawConfig.sanitizers) {
            resolvedSanitizers[field] = rawConfig.sanitizers[field].map(s => {
                if (typeof s === 'string') {
                    const sanitizerFn = sanitizers[s];
                    if (!sanitizerFn)
                        throw new Error(`Sanitizer not found: ${s}`);
                    return sanitizerFn;
                }
                return s;
            });
        }
    }
    const config = {
        ...rawConfig,
        rules: resolvedRules,
        sanitizers: resolvedSanitizers
    };
    const validator = new Validator(config);
    try {
        const result = await validator.validate(data);
        if (format === 'table') {
            if (result.isValid) {
                console.log('\x1b[32m✔ Validation successful!\x1b[0m');
                console.log('\nSanitized data:');
                console.table(result.data);
            }
            else {
                console.error('\x1b[31m✘ Validation failed:\x1b[0m\n');
                const tableData = Object.entries(result.errors).flatMap(([field, errors]) => errors.map(error => ({ Field: field, Error: error })));
                console.table(tableData);
            }
        }
        else {
            // Default: JSON
            if (result.isValid) {
                console.log(JSON.stringify({ status: 'success', data: result.data }, null, 2));
            }
            else {
                console.error(JSON.stringify({ status: 'error', errors: result.errors }, null, 2));
            }
        }
        process.exit(result.isValid ? 0 : 1);
    }
    catch (err) {
        console.error(`Runtime Error: ${err.message}`);
        process.exit(1);
    }
}
