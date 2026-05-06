import fs from 'node:fs';
import { Validator } from './validator.js';
import * as rules from './rules.js';
import * as sanitizers from './sanitizers.js';
import type { ValidatorConfig, FieldRules, FieldSanitizers } from './types.js';

export { Validator, rules, sanitizers };
export * from './types.js';

/**
 * CLI Entry Point
 */
async function runCLI() {
  const args = process.argv.slice(2);

  const help = args.includes('--help') || args.includes('-h');
  if (args.length === 0 || help) {
    console.log(`
Usage:
  form-validator <json-file> [options]
  form-validator '<json-string>' [options]

Options:
  -f, --format <format>  Output format: json (default), table
  -h, --help             Show this help message

Example:
  form-validator data.json --format table
  form-validator '{"name": "John"}' -f json
    `);
    process.exit(0);
  }

  // Basic argument parsing
  let format = 'json';
  const formatIndex = args.findIndex(arg => arg === '--format' || arg === '-f');
  if (formatIndex !== -1 && args[formatIndex + 1]) {
    format = args[formatIndex + 1];
    // Remove format flags from args to isolate the input data
    args.splice(formatIndex, 2);
  }

  let inputData: any;
  const firstArg = args[0];

  if (!firstArg) {
    console.error('Error: Missing input JSON file or string.');
    process.exit(1);
  }

  try {
    if (fs.existsSync(firstArg)) {
      const fileContent = fs.readFileSync(firstArg, 'utf-8');
      inputData = JSON.parse(fileContent);
    } else {
      inputData = JSON.parse(firstArg);
    }
  } catch (error) {
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

  // Resolve strings to actual functions
  const resolvedRules: FieldRules = {};
  for (const field in rawConfig.rules) {
    resolvedRules[field] = (rawConfig.rules[field] as any[]).map(r => {
      if (typeof r === 'string') {
        const ruleFn = (rules as any)[r];
        if (!ruleFn) throw new Error(`Rule not found: ${r}`);
        return ruleFn;
      }
      return r;
    });
  }

  const resolvedSanitizers: FieldSanitizers = {};
  if (rawConfig.sanitizers) {
    for (const field in rawConfig.sanitizers) {
      resolvedSanitizers[field] = (rawConfig.sanitizers[field] as any[]).map(s => {
        if (typeof s === 'string') {
          const sanitizerFn = (sanitizers as any)[s];
          if (!sanitizerFn) throw new Error(`Sanitizer not found: ${s}`);
          return sanitizerFn;
        }
        return s;
      });
    }
  }

  const config: ValidatorConfig = {
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
      } else {
        console.error('\x1b[31m✘ Validation failed:\x1b[0m\n');
        const tableData = Object.entries(result.errors).flatMap(([field, errors]) => 
          errors.map(error => ({ Field: field, Error: error }))
        );
        console.table(tableData);
      }
    } else {
      // Default: JSON
      if (result.isValid) {
        console.log(JSON.stringify({ status: 'success', data: result.data }, null, 2));
      } else {
        console.error(JSON.stringify({ status: 'error', errors: result.errors }, null, 2));
      }
    }
    
    process.exit(result.isValid ? 0 : 1);
  } catch (err: any) {
    console.error(`Runtime Error: ${err.message}`);
    process.exit(1);
  }
}

// Check if run directly (CLI) or imported (Module)
if (import.meta.url.startsWith('file:')) {
  const modulePath = process.argv[1];
  // Simple check to see if we are running this file directly
  if (modulePath && (modulePath.endsWith('index.ts') || modulePath.endsWith('index.js'))) {
     runCLI().catch(err => {
       console.error(err);
       process.exit(1);
     });
  }
}
