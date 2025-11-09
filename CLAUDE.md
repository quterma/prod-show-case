# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 16 application using React 19, built with Feature-Sliced Design (FSD) architecture. The project uses TypeScript, Redux Toolkit with RTK Query for state management, React Hook Form with Zod for forms, and Tailwind CSS v4 for styling.

## Common Commands

### Development

```bash
pnpm dev              # Start development server at http://localhost:3000
pnpm build            # Build for production
pnpm start            # Start production server
```

### Code Quality

```bash
pnpm lint             # Run ESLint with auto-fix
pnpm lint:check       # Run ESLint without auto-fix (for CI)
pnpm format           # Format code with Prettier
pnpm format:check     # Check formatting without changing files
```

### Testing

```bash
# Unit/Component Tests (Vitest)
pnpm test             # Run tests in watch mode
pnpm test:run         # Run tests once (used in CI and pre-commit)
pnpm test:watch       # Run tests in watch mode (explicit)
pnpm test:ui          # Open Vitest UI
pnpm test:coverage    # Run tests with coverage report

# E2E Tests (Playwright)
pnpm test:e2e         # Run E2E tests headless
pnpm test:e2e:ui      # Run E2E tests with Playwright UI
pnpm test:e2e:headed  # Run E2E tests with browser visible
```

**Testing Configuration:**

- Unit tests use Vitest with happy-dom environment
- Test files: `src/**/*.{test,spec}.{ts,tsx}` or `tests/**/*.{test,spec}.{ts,tsx}`
- E2E tests are in `e2e/` directory
- Setup file at `tests/setup.ts` provides mocks for Next.js Router, Image, Link, and browser APIs
- Playwright config runs dev server automatically before E2E tests

### Run a Single Test File

```bash
# Unit tests
pnpm vitest src/path/to/file.test.ts
pnpm vitest tests/path/to/file.test.ts

# E2E tests
pnpm playwright test e2e/specific-test.spec.ts
```

## Architecture

This project follows **Feature-Sliced Design (FSD)** - code is organized by features/entities rather than technical layers. See [FSD-ARCHITECTURE.md](FSD-ARCHITECTURE.md) for full details.

### Layer Hierarchy (top to bottom)

```
app/       → Application configuration, providers, Next.js routes
widgets/   → Complete, self-contained UI blocks
features/  → Business functionality and user interactions
entities/  → Business entities and data models
shared/    → Reusable infrastructure (UI, utils, API config)
```

### Import Rules

- Higher layers can import from lower layers
- Lower layers CANNOT import from higher layers
- Layers at the same level CANNOT import from each other
- `shared/` layer cannot import from any other layer

**Example:**

- ✅ `widgets/products` → `features/product`, `entities/product`, `shared/ui`
- ✅ `features/product` → `entities/product`, `shared/api`
- ❌ `entities/product` → `features/product`
- ❌ `shared/ui` → `entities/product`

## Scope & Non-Goals (MVP)

**Что делаем (MVP):** витрина продуктов: список, деталь, избранное/удалённые, поиск (debounce ~300ms), фронт-пагинация, форма create/edit (локально), fallback на mocks при ошибке API.  
**Чего не делаем:** глобальный UI-кит, нерелевантные роуты/сущности, серверную пагинацию/сортировки, лишние либы. Всё “на вырост” — только в отдельной ветке с пометкой.

## FSD — Minimal Layout & Policies

src/
app/ # маршруты/провайдеры
entities/
product/
model/ types.ts, mappers.ts, index.ts
api/ productsApi.ts (baseApi.injectEndpoints), index.ts
lib/ helpers только про product
ui/ ProductCard.tsx (без логики избранного)
features/
toggle-favorite/
remove-product/
search/
pagination/
widgets/
products/
ui/ Grid, Toolbar(поиск/фильтры), Skeletons
shared/
api/ baseApi.ts (только базовая RTK Query конфигурация)
lib/ store.ts, hooks.ts, validations/, forms/
ui/ базовые атомы, только если реально переиспользуются

**RTK Query:** эндпоинты — только через `baseApi.injectEndpoints` в `entities/*/api`; `keepUnusedDataFor` — дефолт; ошибки/лоадинг → Skeleton + Retry.

**API Configuration:**

- Base API URL: `https://fakestoreapi.com` (configured in [src/shared/api/baseApi.ts](src/shared/api/baseApi.ts))
- Fallback to mocks: Activate `mocks/products.json` fallback starting from Stage 2 (UI & Features)

**Persist:** только `favorites`, `deleted`, `createdLocal` → `localStorage` (через утилиты в `shared/lib/persist`), без redux-persist в MVP.  
**Пагинация/Поиск:** фронт-пагинация (slice массива), поиск с debounce на клиенте.  
**Тест-DoD:** на сущность — 1–2 unit (мэпперы), 1 компонентный (ProductCard); на фичу — 1 интеграционный (toggle-favorite / search); 1 E2E для списка (скелетоны→данные→фильтр/поиск/пагинация).

## Language & Conventions

- **Общение с ассистентом:** отвечай по-русски; в коде/коммитах — английский.
- Имена файлов/типов/символов — английский; текст UI и документация — как удобно.

## State Management

**Stack:** Redux Toolkit + RTK Query

**Key Files:**

- Store setup: [src/shared/lib/store.ts](src/shared/lib/store.ts)
- Base API: [src/shared/api/baseApi.ts](src/shared/api/baseApi.ts)
- Typed hooks: [src/shared/lib/hooks.ts](src/shared/lib/hooks.ts)

**Usage:**

- Use typed hooks: `useAppDispatch()`, `useAppSelector()`, `useAppStore()`
- RTK Query base API configured with tag types: `["Product", "Category", "User"]`
- Feature-specific APIs should inject endpoints into the base API
- Store provider is at [src/app/StoreProvider.tsx](src/app/StoreProvider.tsx)

## Forms

**Stack:** React Hook Form + Zod + @hookform/resolvers

**Key Files:**

- Validation schemas: [src/shared/lib/validations/common.ts](src/shared/lib/validations/common.ts)
- Form components: [src/shared/lib/forms/components/](src/shared/lib/forms/components/)
- Form hooks: [src/shared/lib/forms/hooks.ts](src/shared/lib/forms/hooks.ts)

**Usage:**

- Use pre-built Zod validators: `requiredString`, `email`, `positiveNumber`, `price`, `futureDate`
- Use `useFormSubmission()` hook for handling form state and errors
- Use `<FormField>` and `<FormError>` components for consistent UI
- Integrate with RTK Query mutations for API calls

## Path Aliases

TypeScript configured with `@/*` alias pointing to `src/*`:

```typescript
import { Button } from "@/shared/ui/Button"
import { useAppSelector } from "@/shared/lib/hooks"
```

## Pre-commit Hooks

Husky is configured to run on every commit:

1. **lint-staged**: Runs Prettier and ESLint on staged files
2. **Conditional tests**: Runs `pnpm test:run` only if:
   - Test files or source files are modified, AND
   - Test files exist in the project

If pre-commit fails, fix the issues before committing.

## Important Conventions

1. **Follow FSD layer rules strictly** - imports must respect the hierarchy
2. **Use typed Redux hooks** - never use raw `useDispatch` or `useSelector`
3. **Co-locate tests** - place test files next to the code they test
4. **Use path aliases** - always use `@/` imports, not relative paths like `../../../`
5. **Validate with Zod** - all form inputs should use Zod schemas
6. **Client vs Server Components** - mark client components with `"use client"` directive
7. **RTK Query for API calls** - don't use fetch/axios directly; inject endpoints into base API

## Next.js App Router

This project uses Next.js 16 **App Router** (not Pages Router):

- Routes defined in [src/app/](src/app/) directory
- Server Components by default
- Client Components need `"use client"` directive
- Root layout at [src/app/layout.tsx](src/app/layout.tsx)
- Use route groups like `(app)` for organization without affecting URLs

## Styling

- **Tailwind CSS v4** with PostCSS
- Global styles in [src/app/globals.css](src/app/globals.css)
- Prefer Tailwind utility classes over custom CSS

## TypeScript

- Strict mode enabled
- Target: ES2017
- Use path aliases (`@/*`)
- JSX mode: `react-jsx` (automatic - no need to import React)
