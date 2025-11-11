# Feature-Sliced Design Architecture

**Project Structure:** Feature-Sliced Design (FSD) v2
**Quick Reference:** [fsd-readme.md](fsd-readme.md)
**Official Docs:** https://feature-sliced.design

---

## Overview

This project follows Feature-Sliced Design (FSD) methodology for better code organization and maintainability. FSD organizes code into vertical layers from specific (top) to generic (bottom), ensuring clear separation of concerns and preventing architectural violations.

---

## Directory Structure

```
src/
├── app/                           # App layer - configuration and providers
│   ├── layout.tsx                # Root layout with providers
│   ├── page.tsx                  # Root page
│   ├── StoreProvider.tsx         # Redux store provider
│   └── globals.css               # Global styles
│
├── widgets/                       # Widgets layer - complete UI blocks
│   └── products/                 # Product catalog widgets
│       ├── ui/                   # Grid, Toolbar, Widget
│       │   ├── ProductsGrid/          # ✅ Stage 2A+2B
│       │   ├── ProductsToolbar/       # ✅ Stage 2A+2B (placeholder)
│       │   ├── ProductsWidget/        # ✅ Stage 2A+2B
│       │   └── index.ts
│       └── index.ts
│
├── features/                      # Features layer - business functionality
│   ├── toggle-favorite/          # Favorite products ✅ Scaffolded
│   │   ├── ui/                   # FavoriteButton.tsx      🚧 Stage 2C (Step 5)
│   │   ├── model/                # favoritesSlice.ts       🚧 Stage 2C (Step 5)
│   │   └── index.ts
│   ├── remove-product/           # Remove products ✅ Scaffolded
│   │   ├── ui/                   # RemoveButton.tsx        🚧 Stage 2C (Step 6)
│   │   ├── model/                # removedSlice.ts         🚧 Stage 2C (Step 6)
│   │   └── index.ts
│   ├── search/                   # Search with debounce ✅ Scaffolded
│   │   ├── ui/                   # SearchInput.tsx         🚧 Stage 2C (Step 2)
│   │   ├── model/                # useSearch.ts            🚧 Stage 2C (Step 2)
│   │   └── index.ts
│   ├── pagination/               # Client-side pagination ✅ Scaffolded
│   │   ├── ui/                   # Pagination.tsx          🚧 Stage 2C (Step 4)
│   │   ├── model/                # usePagination.ts        🚧 Stage 2C (Step 4)
│   │   └── index.ts
│   └── filters/                  # Product filters (category, price, rating)
│       ├── ui/                   # Filter components       🚧 Stage 2C (Step 3)
│       ├── model/                # useFilters.ts           🚧 Stage 2C (Step 3)
│       └── index.ts
│
├── entities/                      # Entities layer - business entities
│   └── product/                  # Product entity ✅ Complete (Stage 1)
│       ├── model/                # Domain models and mappers ✅
│       │   ├── types.ts         # Product, ProductDTO, ProductState
│       │   ├── mappers.ts       # mapProductDTO, mapProductsDTO
│       │   └── index.ts
│       ├── api/                  # RTK Query integration ✅
│       │   ├── productsApi.ts   # getProducts, getProductById
│       │   └── index.ts
│       ├── lib/                  # Product helpers (empty)
│       │   └── index.ts
│       ├── ui/                   # Display components ✅ Stage 2A+2B
│       │   ├── ProductCard/          # Product card for list view
│       │   ├── ProductCardSkeleton/  # Loading skeleton for card
│       │   ├── ProductDetailCard/    # Detailed product card
│       │   ├── ProductDetailCardSkeleton/ # Loading skeleton for detail
│       │   └── index.ts
│       └── index.ts              # Public API ✅
│
└── shared/                        # Shared layer - reusable infrastructure
    ├── api/                      # Base API configuration ✅
    │   ├── baseApi.ts           # RTK Query base (FakeStore API)
    │   └── index.ts
    ├── lib/                      # Utilities and helpers ✅
    │   ├── store.ts             # Redux store setup
    │   ├── hooks.ts             # Typed Redux hooks
    │   ├── forms/               # Form components & hooks
    │   │   ├── components/      # FormField, etc.
    │   │   ├── hooks.ts         # useFormSubmission
    │   │   └── index.ts
    │   ├── validations/         # Zod schemas
    │   │   ├── common.ts
    │   │   └── index.ts
    │   ├── persist/             # localStorage utilities ✅
    │   │   ├── ls.ts            # getFromLS, setToLS, removeFromLS
    │   │   └── index.ts
    │   ├── categories/          # Category utilities
    │   │   └── getDynamicCategories.ts  # 🚧 Stage 2C (Step 1)
    │   └── index.ts
    └── ui/                       # Basic UI atoms ✅ Stage 2A+2B
        ├── Skeleton/            # Generic loading skeleton
        ├── ErrorMessage/        # Error display with retry
        ├── EmptyState/          # Empty data state
        └── index.ts
```

---

## Layer Hierarchy

```
┌─────────────────────────────────────────────────┐
│  app/          Application, routing, providers  │ ← Highest (most specific)
├─────────────────────────────────────────────────┤
│  widgets/      Complete UI blocks              │
├─────────────────────────────────────────────────┤
│  features/     Business functionality          │
├─────────────────────────────────────────────────┤
│  entities/     Business entities, data         │
├─────────────────────────────────────────────────┤
│  shared/       Reusable infrastructure         │ ← Lowest (most generic)
└─────────────────────────────────────────────────┘
```

---

## Import Rules

### ✅ Allowed

- **app/** → widgets/, features/, entities/, shared/
- **widgets/** → features/, entities/, shared/
- **features/** → entities/, shared/
- **entities/** → shared/
- **shared/** → _nothing_ (fully isolated)

### ❌ Forbidden

- **Upward imports:** shared/ → entities/ (or any higher layer)
- **Cross-layer imports:** features/search → features/pagination
- **Bypassing public API:** Direct imports from internal segments

---

## Slice Structure (Public API Pattern)

Every slice exports through `index.ts` (Public API):

```
entities/product/
├── model/              # Business logic
│   ├── types.ts
│   ├── mappers.ts
│   └── index.ts
├── api/                # API integration
│   ├── productsApi.ts
│   └── index.ts
├── ui/                 # UI components
│   ├── ProductCard.tsx
│   └── index.ts
├── lib/                # Helpers (optional)
│   └── index.ts
└── index.ts           # Public API - re-exports everything
```

**Usage:**

```typescript
// ❌ Bad: Direct import bypasses public API
import { Product } from "@/entities/product/model/types"

// ✅ Good: Import from public API
import { Product } from "@/entities/product"
```

---

## Stage Progress

### Stage 0: Setup ✅

- Next.js 16 + React 19
- TypeScript strict mode
- Redux Toolkit + RTK Query
- Testing (Vitest + Playwright)
- FSD scaffolding

### Stage 1: Foundation ✅

- **entities/product** - Complete
  - Types, mappers, RTK Query endpoints
  - Hooks: useGetProductsQuery, useGetProductByIdQuery
- **shared/lib/persist** - Complete
  - getFromLS, setToLS, removeFromLS
- **shared/api/baseApi** - Configured
  - Base URL: https://fakestoreapi.com
- **Smoke tests** - ~~Created~~ Removed at Stage 2A start
  - `/test-api`, `/test-persist` (legacy routes removed)

### Stage 2A+2B: UI Components & Architecture ✅ Complete

- **shared/ui** - Skeleton, ErrorMessage, EmptyState
- **entities/product/ui** - ProductCard, ProductDetailCard + skeletons
- **widgets/products** - ProductsGrid, ProductsToolbar, ProductsWidget
- **Pages integration** - /products, /products/[id]
- **Architecture** - Named files, colocated tests, FSD compliance

### Stage 2C: Interactive Features 🚧 In Progress

**Roadmap (Steps 0–9):** 0. Docs update (constants, architecture)

1. Dynamic categories (derive from API data)
2. Search (debounce 300ms)
3. Filters v1 (category, price, rating)
4. Pagination (PAGE_SIZE=10, synced with filters)
5. Favorites (Redux + localStorage + toggle view)
6. Remove + Reset local data (soft-delete + LS clear)
7. Create/Edit Forms (RHF + Zod)
8. not-found.tsx + ID validation
9. ErrorBoundary + guards + tests

### Stage 3: Polish & Production Prep 🔮 Future

- UX refinement (optimistic UI, animations, responsive)
- Fallback strategy (network → cache → mocks)
- E2E tests (Playwright)
- Performance optimization (code splitting, next/image)

---

## ESLint Enforcement

FSD rules are enforced via ESLint boundaries plugin:

```javascript
// eslint.config.mjs
{
  "boundaries/element-types": [
    { type: "app", capture: ["layer"] },
    { type: "widgets", capture: ["layer", "slice"] },
    { type: "features", capture: ["layer", "slice"] },
    { type: "entities", capture: ["layer", "slice"] },
    { type: "shared", capture: ["layer", "segment"] }
  ]
}
```

**Violations fail CI and pre-commit hooks!**

---

## Key Principles

### 1. Isolation

Each slice is independent and exports through public API.

### 2. Hierarchy

Higher layers can use lower layers, never the reverse.

### 3. Encapsulation

Internal implementation details stay within the slice.

### 4. Reusability

Shared layer contains no business logic, only infrastructure.

---

## Development Workflow

1. **Start with shared/** - Build reusable utilities and UI atoms
2. **Define entities/** - Create business domain models
3. **Implement features/** - Add user interactions and business logic
4. **Compose widgets/** - Combine features into complete UI blocks
5. **Use in app/** - Compose widgets on pages

---

## Current Status

**✅ Completed:**

- FSD structure established
- Layer rules enforced via ESLint
- Product entity fully implemented
- Persistence utilities ready
- Base API configured

**🚧 In Progress:**

- Stage 2 planning (UI & Features)

**📚 Documentation:**

- [fsd-readme.md](fsd-readme.md) - Quick reference
- [stage-1-report.md](stage-1-report.md) - Stage 1 completion
- [stage-2-plan.md](stage-2-plan.md) - Next phase roadmap
- [master-log.md](master-log.md) - Overall progress

---

## Learn More

- **Official FSD Docs:** https://feature-sliced.design
- **Project Guide:** [CLAUDE.md](../CLAUDE.md)
- **Quick Reference:** [fsd-readme.md](fsd-readme.md)

---

**Architecture Status:** ✅ Production-ready, strictly enforced!
