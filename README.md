# Basic Form Validator

A modular, functional, and type-safe form validation library and CLI tool.

## Features

- **Modular**: Individual validation rules can be used independently.
- **Functional**: Rules are pure functions.
- **CLI Support**: Validate and sanitize data directly from the terminal.
- **Async Support**: Validate against external services or databases.
- **Nested & Array Support**: Support for dot-notation (e.g., `user.profile.name`) and wildcards for arrays.
- **Sanitization**: Transform and clean data before validation.
- **Conditional Rules**: Rules that run based on other field values.
- **TypeScript**: Built with modern TypeScript and ESM support.

## Installation

```bash
npm install
npm run build
```

## Usage

### CLI

You can validate JSON files or raw JSON strings.

```bash
# Using raw JSON string
npm run dev -- '{\"email\": \"user@example.com\", \"age\": 30}'

# Using a file
echo '{"email": "invalid"}' > example.json
npm run dev -- example.json
```

### Module

```typescript
import { Validator, rules, sanitizers } from './dist/index.js';

const validator = new Validator({
  rules: {
    'user.email': [rules.required, rules.email],
    'user.age': [rules.isNumber]
  },
  sanitizers: {
    'user.email': [sanitizers.trim, sanitizers.toLowerCase],
    'user.age': [sanitizers.toNumber]
  }
});

const result = await validator.validate({ 
  user: {
    email: '  JOHN@Example.com  ',
    age: '25'
  }
});

console.log(result.isValid); // true
console.log(result.data.user.email); // 'john@example.com'
console.log(result.data.user.age);   // 25
```

## Development

- `npm run dev`: Run the CLI in development mode using `tsx`.
- `npm run test`: Run tests with `vitest`.
- `npm run precommit`: Run type checks and tests.
