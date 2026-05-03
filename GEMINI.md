# Project Context: Basic Form Validator

This document serves as the foundational mandate for Gemini CLI when working on this project.

## Technical Stack

- **Runtime**: Node.js (ESM)
- **Language**: TypeScript
- **Runner**: tsx (preferred over ts-node)
- **Testing**: Vitest
- **CLI Exportable**: The project should be usable both as a CLI tool and as an importable module.
- **Git**: Conventional Commits

## Architecture

- **Modular & Functional**: Structure the code around reusable validation functions and a central Validator class.
- **Validation**: Manual validation rules for form fields (no external libraries).
- **CLI Entry Point**: src/index.ts should accept a JSON file or JSON string representing the form data and return validation results.
- **Service Injection**: Validator can accept optional configuration (e.g., custom rules per field).

## Coding Standards

- **Imports**: Always include the .js extension in local imports (ESM requirement).
- **Types**: Use import type for type-only imports to satisfy verbatimModuleSyntax.
- **Naming**: Use PascalCase for classes, camelCase for methods and variables.  
- **Language**: Source code and documentation in English. CLI messages in English. Comments in English.

## Key Workflows

- **PowerShell Commands**: Do not use `&&` as it is not supported in all PowerShell versions. To simulate `&&`, use the pattern `command1; if ($?) { command2 }`.
- **Pre-commit**: Always run npm run precommit before any commit. This ensures:
    1. No TypeScript errors (tsc --noEmit).  
    2. All tests pass (vitest --run).  
- **Documentation**: Always update GEMINI.md and README.md after significant changes or when new patterns are established.

## Skills & Principles

- **Node.js Best Practices**: Follow modular architecture and async patterns where appropriate.
- **Form Validation Methodology**: Implement clear, maintainable rules per field with informative error messages.
- **Advanced Types**: Leverage TypeScript for robust data structures and type-safe validation functions.

## Roadmap

- [x] **Basic Field Validation**: Implement string, number, email, and required checks.
- [x] **Custom Rules**: Allow users to define additional rules for fields.
- [x] **CLI Input Options**: Support file input, JSON string input, and optional configuration flags.
- [x] **Testing**: Write Vitest tests covering all validation functions and edge cases.
- [x] **Exportable Module**: Ensure the Validator can be imported and used programmatically in other projects.
- [ ] **Advanced Validation**: Implement async validations, conditional rules, nested objects/arrays support, and data transformation/sanitization.
- [ ] **UX & DX**: Add i18n for error messages, type inference from schemas, and CLI output formatters (JSON, Table).
- [ ] **Ecosystem & Integrations**: Create Express/Fastify middleware, ensure frontend compatibility, and build a schema generator.
- [ ] **Quality & Performance**: Implement benchmarks for performance testing and configure code coverage reporting.

## Evolution Notes

- [2026-05-02]: Initial Implementation
-> Reason: Completed the core validation engine and CLI interface as per the original design.
-> Implication: The project is now functional and ready for extension with more rules or complex validation logic.

- [2026-05-03]: Roadmap Expansion
-> Reason: Defined next steps to transform the project into a robust validation library.
-> Implication: Future work will focus on advanced validation logic, DX improvements, and ecosystem integrations.
