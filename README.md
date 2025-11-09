# Product Showcase

A modern product showcase application built with Next.js 16, React 19, and Feature-Sliced Design (FSD) architecture.

## 🚀 Project Overview

This application demonstrates a production-ready approach to building scalable frontend applications using:

- **Next.js 16** with App Router
- **React 19** with modern features
- **Feature-Sliced Design (FSD)** for maintainable architecture
- **Redux Toolkit + RTK Query** for state management and API integration
- **TypeScript** in strict mode
- **Tailwind CSS v4** for styling
- **Vitest + Playwright** for comprehensive testing

## 📚 Documentation

- **[Master Progress Log](docs/master-log.md)** - Overall project progress and stage completion
- **[Stage 1 Report](docs/stage-1-report.md)** - Foundation & Entity Layer completion
- **[Stage 2 Plan](docs/stage-2-plan.md)** - UI & Features roadmap
- **[FSD Architecture](docs/fsd-architecture.md)** - Detailed architecture documentation
- **[FSD Quick Reference](docs/fsd-readme.md)** - Layer rules and patterns
- **[API Contracts](docs/api-contracts.md)** - FakeStore API specification
- **[CLAUDE.md](CLAUDE.md)** - Development guidelines for Claude Code

## 🏗️ Project Status

**Current Stage:** Stage 1 Complete ✅
**Version:** v0.2.0

### Completed (Stage 1)

- ✅ FakeStore API integration
- ✅ Product entity with types, mappers, RTK Query endpoints
- ✅ Type-safe localStorage persistence utilities
- ✅ Smoke tests for API and persistence
- ✅ FSD architecture setup with strict layer rules

### Planned (Stage 2)

- Mock fallback implementation
- Product UI components (Card, Grid, Toolbar)
- Features: search, pagination, favorites, remove
- Redux state integration with persistence
- Main product showcase page

## 🛠️ Quick Start

### Prerequisites

- Node.js 18+
- pnpm (recommended package manager)

### Installation

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Testing

```bash
# Run unit tests (Vitest)
pnpm test

# Run E2E tests (Playwright)
pnpm test:e2e

# Run tests with UI
pnpm test:ui
pnpm test:e2e:ui
```

### Code Quality

```bash
# Lint and auto-fix
pnpm lint

# Format code
pnpm format

# Type check
pnpm type-check
```

## 🏛️ Architecture

This project follows **Feature-Sliced Design (FSD)** principles:

```
src/
├── app/        # Application layer (routes, providers)
├── widgets/    # Complete UI blocks
├── features/   # User interactions and business features
├── entities/   # Business domain models
└── shared/     # Reusable infrastructure (UI, utils, API)
```

### Key Principles

- **Layered imports:** Higher layers can import from lower layers only
- **Public API pattern:** All slices export through `index.ts`
- **Isolation:** `shared/` layer cannot import from other layers
- **Single responsibility:** Each slice has a clear purpose

See [docs/fsd-architecture.md](docs/fsd-architecture.md) for detailed guidelines.

## 🔧 Tech Stack

### Core

- **Framework:** Next.js 16 (App Router)
- **UI Library:** React 19
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS v4

### State Management

- **Store:** Redux Toolkit
- **API Client:** RTK Query
- **Persistence:** Custom localStorage utilities

### Forms & Validation

- **Forms:** React Hook Form
- **Validation:** Zod

### Testing

- **Unit/Component:** Vitest + happy-dom
- **E2E:** Playwright
- **Coverage:** Vitest coverage tools

### Code Quality

- **Linter:** ESLint
- **Formatter:** Prettier
- **Pre-commit:** Husky + lint-staged
- **Type Checking:** TypeScript compiler

## 📦 Key Features

### Stage 1 (Current)

- FakeStore API integration with typed endpoints
- Product entity with DTO mapping
- Type-safe localStorage utilities with SSR safety
- Comprehensive documentation

### Stage 2 (Planned)

- Product catalog with grid layout
- Search with debounce (300ms)
- Client-side pagination
- Favorites and remove functionality
- Mock fallback for API errors

## 📝 Development Guidelines

1. **Follow FSD layer rules** - Respect the import hierarchy
2. **Use path aliases** - Import via `@/` prefix, not relative paths
3. **Type everything** - Leverage TypeScript strict mode
4. **Test your code** - Write unit and integration tests
5. **Commit conventions** - Use conventional commit messages
6. **Pre-commit hooks** - Let Husky handle linting and formatting

See [CLAUDE.md](CLAUDE.md) for detailed development instructions.

## 🔗 External Resources

- [FakeStore API](https://fakestoreapi.com) - Data source
- [Feature-Sliced Design](https://feature-sliced.design) - Architecture methodology
- [Next.js Documentation](https://nextjs.org/docs)
- [Redux Toolkit](https://redux-toolkit.js.org/)

## 📄 License

This is a test assignment project.

---

**Last Updated:** November 9, 2025
**Stage:** 1 Complete (Foundation & Entity Layer)
