# Architecture Overview

**Project:** Product Showcase
**Stack:** Next.js 16, React 19, TypeScript, Redux Toolkit, Tailwind CSS v4
**Pattern:** Feature-Sliced Design (FSD)

---

## FSD Layer Structure

```
src/
├── app/           # Next.js routes, providers, global configs
├── widgets/       # Complete UI blocks (smart, data-fetching)
├── features/      # Business logic (user interactions)
├── entities/      # Business models and data
└── shared/        # Reusable infrastructure (no domain knowledge)
```

### Import Rules

- **Allowed:** Top → Bottom (app → widgets → features → entities → shared)
- **Forbidden:** Bottom → Top, Same-level cross-imports
- **shared/** cannot import from any other layer

---

## State Management

### Redux Toolkit + RTK Query

**Store:** `src/shared/lib/store/store.ts`

**Slices:**

- `pagination` - current page, page size
- `filters` - category, search, price, rating
- `favorites` - favorite product IDs (persisted)
- `localProducts` - created/deleted/patched products (persisted)

**API:**

- Base API: `src/shared/api/baseApi.ts`
- Endpoints injected via `baseApi.injectEndpoints()` in `entities/*/api`

**Persistence:** `localStorage` via custom middleware

- Keys: `favorites`, `deleted`, `createdLocal`, `patchedLocal`
- Utilities: `src/shared/lib/persist/`

---

## Data Flow Pipeline

### Products List (`/products`)

```
API (fakestoreapi.com)
  ↓
useMergedProducts → merge with localProducts (patches, deletions, creations)
  ↓
useFavoriteProducts → filter by favorites (if enabled)
  ↓
useFilteredProducts → apply category/search/price/rating filters
  ↓
usePagination → paginate results (front-end, 10 per page)
  ↓
ProductsWidget → render grid + toolbar
```

**Widget:** `widgets/products/ui/ProductsWidget/ProductsWidget.tsx`
**Hook:** `widgets/products/hooks/useProductsView.ts` (aggregates entire pipeline)

### Product Detail (`/products/[id]`)

```
API + localProducts
  ↓
useProductView → fetch product, apply local patches, check deleted
  ↓
ProductDetailWidget → render detail card + actions
```

**Widget:** `widgets/product-detail/ui/ProductDetailWidget/ProductDetailWidget.tsx`
**Hook:** `widgets/product-detail/hooks/useProductView.ts`

---

## API Integration

**Base URL:** `https://fakestoreapi.com`

**Endpoints:**

- `GET /products` - all products
- `GET /products/:id` - single product

**Product Shape:**

```typescript
{
  id: string        // "1", "2", "-1" (negative for local)
  title: string
  price: number
  description: string
  category: "men's clothing" | "women's clothing" | "jewelery" | "electronics"
  image: string     // URL
  rating: { rate: number, count: number }
}
```

**Note:** Original API uses numeric IDs; we migrated to string-based IDs for consistency with local products (negative IDs).

---

## Key Features

### Pagination

**Location:** `features/pagination`

- Front-end pagination (10 items per page)
- Auto-corrects `currentPage` when `totalPages` decreases (via `usePagination` hook)
- Resets to page 1 when filters change (listener middleware)

**Components:** `Pagination` (prev/next buttons, page info)

### Filters

**Location:** `features/filters`

- Search by title/description (debounced 300ms)
- Multi-select categories
- Price range (min/max)
- Rating threshold
- Show only favorites toggle

**Filter cascade order:**

1. Removed products (hidden)
2. Search query
3. Categories
4. Rating
5. Favorites
6. Price range

**Components:** `QueryFilter`, `CategoryFilter`, `PriceFilter`, `RatingFilter`, `ShowOnlyFavoritesToggle`, `ResetFiltersButton`

### Favorites

**Location:** `features/favorites`

- Add/remove products to favorites
- Persisted in localStorage
- Filter view to show only favorites
- Auto-cleanup when product deleted

**Components:** `FavoriteToggle`, `ShowOnlyFavoritesToggle`

### Local Products

**Location:** `features/local-products`

- Create new products (stored locally with negative IDs)
- Edit API products (patches stored locally)
- Soft delete (API products hidden, local products removed)
- Persisted in localStorage

**ID System:**

- API products: positive strings ("1", "2", "3")
- Local products: negative strings ("-1", "-2", "-3")

---

## Widgets (Smart Components)

### ProductsWidget

**Responsibilities:**

- Fetch products via RTK Query (`useGetProductsQuery`)
- Apply data pipeline (`useProductsView`)
- Handle loading/error/empty states
- Render toolbar (filters, search, create button) + grid + pagination

**No prop drilling:** All data fetched inside widget, not passed from page

### ProductDetailWidget

**Responsibilities:**

- Fetch single product by ID
- Apply local patches, check deleted status
- Handle loading/error/empty/not-found states
- Render detail card + favorite/edit/delete actions

---

## Forms

**Stack:** React Hook Form + Zod

**Location:** `features/product-form`

- Modal dialog with create/edit modes
- Validation: title (required), price (positive number), category (enum), description (optional)
- Reusable form components from `shared/lib/forms`

---

## Routing & Pages

**Next.js App Router:**

- `/` → redirect to `/products`
- `/products` → products list page
- `/products/[id]` → product detail page

**Pages are thin:** Only widget composition + navigation callbacks

---

## Testing

**Stack:** Vitest + happy-dom + @testing-library/react + Playwright (E2E)

**Coverage:** 161+ tests across entities, features, widgets, and shared utils

**Commands:**

```bash
pnpm test              # unit/component tests (watch)
pnpm test:run          # unit/component tests (CI)
pnpm test:e2e          # E2E tests (Playwright)
pnpm test:coverage     # coverage report
```

---

## Code Quality

**Pre-commit hooks:** Husky runs Prettier, ESLint, and Vitest on staged files

**Commands:**

```bash
pnpm lint              # ESLint with auto-fix
pnpm format            # Prettier format
pnpm lint:check        # CI check (no auto-fix)
pnpm format:check      # CI check (no format)
```

---

## Project Status

**Completed (MVP):**

- ✅ Products list & detail pages
- ✅ Filters, search, pagination
- ✅ Favorites & local products (create/edit/delete)
- ✅ localStorage persistence
- ✅ Error boundaries & 404 handling
- ✅ Comprehensive test coverage

**Remaining:** See [TODO.md](TODO.md) for UI polish, E2E tests, and deployment tasks

---

## Key Decisions

### Why FSD?

- **Scalability:** Easy to add new features without touching existing code
- **Separation of concerns:** Business logic separated from UI
- **Predictable structure:** Clear import rules prevent spaghetti code

### Why RTK Query?

- **Caching:** Automatic request deduplication
- **Loading states:** Built-in `isLoading`, `error` states
- **Type safety:** Full TypeScript support

### Why Front-end Pagination?

- **Simplicity:** FakeStoreAPI doesn't support server pagination
- **Performance:** Dataset is small (~20 products), acceptable for front-end
- **Future:** Can be replaced with server pagination when needed

### Why localStorage?

- **Simplicity:** No backend required for MVP
- **Persistence:** Survives page reloads
- **Limitations:** Not synced across tabs, max 5-10MB storage

---

## Naming Conventions

- Components: `PascalCase.tsx`
- Hooks: `useCamelCase.ts`
- Types: `PascalCase.ts`
- Utils: `camelCase.ts`

---

**Last updated:** 2025-11-20
