# Basic Form Validator

A modular, functional, and type-safe form validation library and CLI tool.

## Features

- **Modular**: Individual validation rules can be used independently.
- **Functional**: Rules are pure functions.
- **CLI Support**: Validate data directly from the terminal.
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
npm run dev -- '{"email": "user@example.com", "age": 30}'

# Using a file
echo '{"email": "invalid"}' > data.json
npm run dev -- data.json
```

### Module

```typescript
import { Validator, rules } from './dist/index.js';

const validator = new Validator({
  rules: {
    email: [rules.required, rules.email]
  }
});

const result = validator.validate({ email: 'test@example.com' });
console.log(result.isValid); // true
```

## Development

- `npm run dev`: Run the CLI in development mode using `tsx`.
- `npm run test`: Run tests with `vitest`.
- `npm run precommit`: Run type checks and tests.
