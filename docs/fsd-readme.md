# Feature-Sliced Design (FSD) - Quick Reference

**Project Architecture:** Feature-Sliced Design v2
**Full Documentation:** [FSD-ARCHITECTURE.md](../FSD-ARCHITECTURE.md)

---

## Layer Hierarchy

FSD organizes code into **vertical layers** from specific (top) to generic (bottom):

```
┌─────────────────┐
│   app/          │  Application configuration, providers, routing
├─────────────────┤
│   widgets/      │  Complete UI blocks (composed from features + entities)
├─────────────────┤
│   features/     │  Business logic, user interactions
├─────────────────┤
│   entities/     │  Business entities, domain models
├─────────────────┤
│   shared/       │  Reusable infrastructure (no business logic)
└─────────────────┘
```

---

## Import Rules

### ✅ Allowed Imports

Higher layers can import from lower layers:

- `app/` → `widgets/`, `features/`, `entities/`, `shared/`
- `widgets/` → `features/`, `entities/`, `shared/`
- `features/` → `entities/`, `shared/`
- `entities/` → `shared/`
- `shared/` → nothing (fully isolated)

### ❌ Forbidden Imports

- **Upward imports:** Lower → Higher (e.g., `entities/` → `features/`)
- **Cross-layer:** Same level (e.g., `features/search` → `features/pagination`)
- **Shared violations:** `shared/` → any other layer

---

## Slice Structure

Each layer contains **slices** (feature/entity folders):

```
entities/product/
├── model/           # Business logic, types, state
│   ├── types.ts
│   ├── mappers.ts
│   └── index.ts
├── api/             # API integration
│   ├── productsApi.ts
│   └── index.ts
├── ui/              # UI components
│   ├── ProductCard.tsx
│   └── index.ts
├── lib/             # Helpers specific to this slice
│   └── index.ts
└── index.ts         # Public API (re-exports)
```

---

## Public API Pattern

**Every slice MUST export through `index.ts`:**

```typescript
// ❌ Bad: Direct import from internal segment
import { Product } from "@/entities/product/model/types"

// ✅ Good: Import from public API
import { Product } from "@/entities/product"
```

**Slice public API (`index.ts`):**

```typescript
// entities/product/index.ts
export * from "./model" // Types, state, logic
export * from "./api" // Hooks, endpoints
export * from "./ui" // Components
// export * from "./lib"   // Optional: slice-specific helpers
```

---

## Layer Purposes

### `app/` - Application Layer

**Purpose:** Entry point, global providers, routing

- Next.js App Router pages
- Redux StoreProvider
- Layout components
- Global error boundaries

**Example:**

```typescript
// app/layout.tsx
export default function RootLayout({ children }) {
  return (
    <StoreProvider>
      {children}
    </StoreProvider>
  )
}
```

---

### `widgets/` - Widgets Layer

**Purpose:** Complete, self-contained UI blocks

- Compose features + entities
- Page-level sections
- Complex UI compositions

**Example:**

```typescript
// widgets/products/ui/ProductsWidget.tsx
import { ProductCard } from "@/entities/product"
import { SearchInput } from "@/features/search"
import { Pagination } from "@/features/pagination"

export function ProductsWidget() {
  return (
    <>
      <SearchInput />
      <ProductCard />
      <Pagination />
    </>
  )
}
```

---

### `features/` - Features Layer

**Purpose:** User interactions, business features

- Search, filters, sorting
- Favorites, cart, auth
- Forms, modals

**Example:**

```typescript
// features/toggle-favorite/ui/FavoriteButton.tsx
import { Product } from "@/entities/product"
import { useToggleFavorite } from "../model/useFavorite"

export function FavoriteButton({ productId }: { productId: number }) {
  const { isFavorite, toggle } = useToggleFavorite(productId)
  return <button onClick={toggle}>{isFavorite ? "❤️" : "🤍"}</button>
}
```

---

### `entities/` - Entities Layer

**Purpose:** Business domain models, data structures

- Types and interfaces
- API integration (RTK Query)
- Mappers (DTO → Domain)
- Display-only UI components (no features)

**Example:**

```typescript
// entities/product/model/types.ts
export type Product = {
  id: number
  title: string
  price: number
  category: string
  rating: { rate: number; count: number }
}

// entities/product/api/productsApi.ts
export const { useGetProductsQuery } = productsApi
```

---

### `shared/` - Shared Layer

**Purpose:** Reusable infrastructure, NO business logic

- UI kit (Button, Input, Skeleton)
- Utils (formatters, validators)
- API configuration (baseApi)
- Hooks, stores, persistence

**Example:**

```typescript
// shared/ui/Button.tsx
export function Button({ children, ...props }) {
  return <button className="btn" {...props}>{children}</button>
}

// shared/lib/persist/ls.ts
export function getFromLS<T>(key: string): T | null { /*...*/ }
```

---

## Common Patterns

### Entity with API

```
entities/product/
├── model/types.ts      # Domain types
├── model/mappers.ts    # DTO → Domain
├── api/productsApi.ts  # RTK Query endpoints
└── index.ts            # Export all
```

### Feature with State

```
features/toggle-favorite/
├── ui/FavoriteButton.tsx      # UI component
├── model/favoritesSlice.ts    # Redux slice
├── model/useFavorite.ts       # Hook
└── index.ts                   # Export UI + hook
```

### Widget Composition

```
widgets/products/
└── ui/
    ├── ProductsGrid.tsx       # Composes entities/product/ui
    ├── ProductsToolbar.tsx    # Composes features/search
    └── ProductsSkeleton.tsx   # Composes shared/ui/Skeleton
```

---

## ESLint Rules

This project enforces FSD with ESLint:

```javascript
// eslint.config.mjs
"boundaries/element-types": [
  {
    type: "app",
    capture: ["layer"]
  },
  {
    type: "widgets",
    capture: ["layer", "slice"]
  },
  // ... more rules
]
```

**Violations will fail CI and pre-commit hooks!**

---

## Quick Checklist

Before creating a new module:

- [ ] Is it in the correct layer?
- [ ] Does it have a public API (`index.ts`)?
- [ ] Do imports follow the hierarchy rules?
- [ ] Is `shared/` isolated (no business logic)?
- [ ] Are slices independent (no cross-slice imports)?

---

## Examples from This Project

### ✅ Good Examples

```typescript
// widgets/products → entities/product + features/search
import { ProductCard } from "@/entities/product"
import { SearchInput } from "@/features/search"

// features/toggle-favorite → entities/product
import type { Product } from "@/entities/product"

// entities/product → shared/lib
import { getFromLS } from "@/shared/lib"
```

### ❌ Bad Examples

```typescript
// ❌ Upward import: entities → features
import { toggleFavorite } from "@/features/toggle-favorite"

// ❌ Cross-layer: features → features
import { usePagination } from "@/features/pagination"

// ❌ Direct segment import (bypass public API)
import { Product } from "@/entities/product/model/types"

// ❌ Shared with business logic
// shared/lib/productHelpers.ts - NO! Move to entities/product/lib
```

---

## Learn More

- **Full Architecture:** [FSD-ARCHITECTURE.md](../FSD-ARCHITECTURE.md)
- **Official Docs:** https://feature-sliced.design
- **Project Guide:** [CLAUDE.md](../CLAUDE.md)

---

**Remember:** FSD is about **isolation**, **reusability**, and **maintainability**. Follow the rules, and your codebase will thank you! 🎯
