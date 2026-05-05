import fs from 'node:fs';
import { Validator } from './validator.js';
import * as rules from './rules.js';
import type { ValidatorConfig } from './types.js';

export { Validator, rules };
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

  // Example configuration - In a real scenario, this might come from a config file
  // For this MVP, we'll look for a 'config' key in the input or use a default
  const data = inputData.data || inputData;
  const config: ValidatorConfig = inputData.config || {
    rules: {
      email: [rules.required, rules.email],
      age: [rules.isNumber]
    }
  };

  const validator = new Validator(config);
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
