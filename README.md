# Basic Form Validator

A modular, functional, and type-safe form validation library and CLI tool.

## Features

- **Modular**: Individual validation rules can be used independently.
- **Functional**: Rules are pure functions.
- **CLI Support**: Validate and sanitize data directly from the terminal with table and JSON output.
- **Internationalization (i18n)**: Support for multiple languages (English and Spanish included).
- **Type Inference**: Automatically derive TypeScript interfaces from your validation schemas.
- **Async Support**: Validate against external services or databases.
- **Nested & Array Support**: Support for dot-notation (e.g., `user.profile.name`) and wildcards for arrays.
- **Sanitization**: Transform and clean data before validation.
- **Conditional Rules**: Rules that run based on other field values.

## Installation

```bash
npm install
npm run build
```

## Usage

### CLI

You can validate JSON files or raw JSON strings.

```bash
# Basic usage (JSON output)
npm run dev -- '{\"email\":\"user@example.com\",\"age\":30}'

# With table format and Spanish language
npm run dev -- showcase.json --format table --lang es

# Available options:
# -f, --format <format>  Output format: json (default), table
# -l, --lang <lang>      Language: en (default), es
# -h, --help             Show help
```

### Module

#### Type Inference & Validation

```typescript
import { Validator, rules, sanitizers } from './dist/index.js';

interface User {
  email: string;
  age: number;
}

const validator = new Validator<User>({
  rules: {
    'email': [rules.required, rules.email],
    'age': [rules.isNumber]
  },
  sanitizers: {
    'email': [sanitizers.trim, sanitizers.toLowerCase]
  }
});

const result = await validator.validate({ 
  email: '  JOHN@Example.com  ',
  age: 25
});

if (result.isValid) {
  console.log(result.data.email); // 'john@example.com' (typed as string)
}
```

#### Internationalization (i18n)

```typescript
import { Validator, rules } from './dist/index.js';
import { esMessages } from './dist/messages.js';

const validator = new Validator({
  rules: { age: [rules.isNumber] },
  messages: esMessages // Use Spanish translations
});
```

### Express Middleware

Easily integrate the validator into your Express routes.

```typescript
import express from 'express';
import { expressMiddleware, rules, sanitizers } from 'basic-form-validator';

const app = express();
app.use(express.json());

const registrationRules = {
  rules: {
    email: [rules.required, rules.email],
    password: [rules.required, rules.minLength(8)]
  },
  sanitizers: {
    email: [sanitizers.trim, sanitizers.toLowerCase]
  }
};

app.post('/register', expressMiddleware(registrationRules), (req, res) => {
  // req.body is already validated and sanitized here!
  res.send('User registered successfully');
});

// Advanced: Custom source and error handling
app.get('/search', expressMiddleware({
  rules: { q: [rules.required] }
}, {
  source: 'query',
  onError: (errors, req, res) => {
    res.status(422).json({ msg: 'Check your search query', details: errors });
  }
}), (req, res) => {
  res.send(`Searching for: ${req.query.q}`);
});
```

## Development

- `npm run dev`: Run the CLI in development mode using `tsx`.
- `npm run test`: Run tests with `vitest`.
- `npm run precommit`: Run type checks and tests.
