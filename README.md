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

- **[CLAUDE.md](CLAUDE.md)** - Development guidelines for Claude Code
- **[Architecture](docs/ARCHITECTURE.md)** - FSD architecture overview
- **[TODO](docs/TODO.md)** - Portfolio improvements roadmap

## 🏗️ Project Status

**Current Stage:** Stage 2C Complete ✅ → Stage 2D Next
**Version:** v0.9.0

### Completed (Stage 1-2C)

**Foundation:**

- ✅ Next.js 16 + React 19 + TypeScript strict
- ✅ FSD архитектура с валидацией границ
- ✅ Redux Toolkit + RTK Query
- ✅ Централизованная persistence система

**Entities:**

- ✅ Product entity (types, mappers, API, UI)
- ✅ Dynamic categories/price range hooks

**Features:**

- ✅ Favorites (localStorage persist, auto-cleanup)
- ✅ Local Products (create, edit, soft-delete)
- ✅ Filters (search, category, price, rating)
- ✅ Pagination (auto-reset на изменение фильтров)
- ✅ Product Form (React Hook Form + Zod)

**UI:**

- ✅ Smart Widgets (data-fetching в виджетах)
- ✅ Product Cards & Detail views
- ✅ Skeletons, Error, Empty states
- ✅ Modal dialogs

**Tests:**

- ✅ 116+ тестов (unit, component, integration)

### Next (Stage 2D)

- ⏳ not-found.tsx для /products/[id]
- ⏳ Global ErrorBoundary в app/layout.tsx
- ⏳ Валидация ID продуктов

### Planned (Stage 3-4)

См. [docs/TODO.md](docs/TODO.md)

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

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for detailed guidelines.

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

### Product Management

- Просмотр каталога продуктов (FakeStore API)
- Создание/редактирование локальных продуктов
- Soft-delete (API-продукты) и hard-delete (локальные)
- Детальная страница продукта

### Filtering & Search

- Поиск по названию/описанию (debounce 300ms)
- Фильтры: категории, цена, рейтинг
- "Показывать только избранное"
- Сброс всех фильтров

### Favorites & Persistence

- Добавление в избранное с localStorage
- Автоудаление из избранного при удалении продукта
- Persist для избранного и локальных продуктов
- SSR-безопасная гидрация

### Pagination

- Фронтенд-пагинация (10 продуктов на страницу)
- Автосброс на страницу 1 при изменении фильтров

### Developer Experience

- Smart Widgets паттерн (data-fetching изолирован)
- View Hooks Aggregators (useProductsView, useProductView)
- Factory Selectors для мемоизации
- Централизованная persistence система

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

**Last Updated:** Ноябрь 18, 2025
**Stage:** 2C Complete (Interactive Features)
