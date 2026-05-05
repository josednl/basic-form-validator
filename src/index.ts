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

  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    console.log(`
Usage:
  form-validator <json-file>
  form-validator '<json-string>'

Example:
  form-validator data.json
  form-validator '{"name": "John"}'
    `);
    process.exit(0);
  }

  let inputData: any;
  const firstArg = args[0];

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

    if (result.isValid) {
      console.log('Validation successful!');
      console.log('Sanitized data:', JSON.stringify(result.data, null, 2));
      process.exit(0);
    } else {
      console.error('Validation failed:');
      console.error(JSON.stringify(result.errors, null, 2));
      process.exit(1);
    }
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
