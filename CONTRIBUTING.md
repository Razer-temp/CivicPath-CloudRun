# Contributing to CivicPath

Thank you for your interest in contributing to CivicPath! This document provides guidelines for contributing to the project.

## 🏗️ Development Setup

```bash
# Clone the repository
git clone https://github.com/Razer-temp/CivicPath-CloudRun.git
cd CivicPath-CloudRun

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
# Fill in your API keys in .env

# Start development server
npm run dev
```

## 📋 Code Quality Standards

### TypeScript
- **Strict mode** is enforced (`strict: true` in `tsconfig.json`)
- Zero `any` types — use proper interfaces and generics
- All exported functions must have JSDoc documentation

### Formatting
- Prettier is configured (`.prettierrc`)
- EditorConfig is provided (`.editorconfig`)
- 2-space indentation, single quotes, semicolons

### Linting
- ESLint with security rules (`no-eval`, `no-implied-eval`)
- Run `npm run lint:eslint` before committing

### Logging
- Use `logger` from `src/utils/logger.ts` instead of raw `console.*`
- `logger.warn()` and `logger.error()` for production-visible messages
- `logger.info()` and `logger.debug()` for dev-only messages

## 🧪 Testing

```bash
npm test              # Run unit tests
npm run test:coverage # Run with coverage
npm run test:e2e      # Run Playwright E2E tests
npm run validate      # Full validation (typecheck + tests)
```

- All services must have corresponding `.test.ts` files
- New components should include accessibility tests
- Minimum coverage thresholds are enforced

## 🔒 Security Guidelines

- **Never** hardcode API keys — use environment variables
- All user input must be validated via `src/utils/validation.ts`
- AI outputs must be sanitized with DOMPurify before rendering
- Follow the threat model documented in `firebase/firestore.rules`

## 📁 Project Structure

```
src/
├── components/     # Reusable UI components
├── hooks/          # Custom React hooks
├── lib/            # Context providers (Auth, Language)
├── pages/          # Route-level page components
├── services/       # API and data services
├── utils/          # Shared utilities (logger, validation, constants)
└── types.ts        # TypeScript type definitions
```

## 🚀 Pull Request Process

1. Create a feature branch from `main`
2. Run `npm run validate` to ensure all checks pass
3. Write/update tests for changed functionality
4. Update documentation if adding new features
5. Submit PR with a clear description of changes
