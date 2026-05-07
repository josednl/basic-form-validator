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

### Module (Node & Browser)

The library is now environment-agnostic and can be used in both Node.js and browser environments.

```typescript
import { Validator, s } from 'basic-form-validator';

// Schema-based validation
const userSchema = s.object({
  name: s.string().required(),
  age: s.number().min(18)
});

const validator = userSchema.build();
const result = await validator.validate({ name: 'John', age: 20 });
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
