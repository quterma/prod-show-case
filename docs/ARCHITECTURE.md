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

## Key Features

### Pagination

**Location:** `features/pagination`

- **Model:** `paginationSlice.ts` - Redux state (`currentPage`, `pageSize`)
- **Selector:** `selectors.ts` - `makeSelectPaginatedProducts()` (factory selector)
- **Hook:** `usePagination.ts` - auto-corrects `currentPage` when `totalPages` decreases
- **UI:** `Pagination.tsx` - prev/next buttons, page info

**Auto-correction logic:**

- When products are deleted/filtered → `totalPages` decreases
- Hook detects `currentPage > totalPages` → dispatches `setPage(totalPages)`
- Ensures consistent state without manual intervention

### Filters

**Location:** `features/filters`

- **Model:** `filtersSlice.ts` - Redux state (category, search, price, rating)
- **Lib:** `filterProducts.ts` - pure filter function
- **Hook:** `useFilteredProducts.ts` - applies filters to products array
- **UI:** CategoryFilter, QueryFilter, PriceFilter, RatingFilter, ResetFiltersButton

**Debounced search:** 300ms delay via `useDebounce` from `shared/lib/debounce`

### Favorites

**Location:** `features/favorites`

- **Model:** `favoritesSlice.ts` - Redux state (array of IDs), persisted
- **Hook:** `useFavoriteProducts.ts` - filters by favorites (if toggle enabled)
- **UI:** ToggleFavoriteButton, ShowOnlyFavoritesToggle

### Local Products

**Location:** `features/local-products`

- **Model:** `localProductsSlice.ts` - tracks created/deleted/patched products, persisted
- **Hook:** `useMergedProducts.ts` - merges API products with local changes
- **Lib:** `mergeLocalProducts.ts` - pure merge function

**ID System:**

- API products: positive integers (1, 2, 3...)
- Local products: negative integers (-1, -2, -3...)

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

**Stack:** React Hook Form + Zod + @hookform/resolvers

**Location:** `features/product-form`

- **Schema:** `schema.ts` - Zod validation (title, price, category, description)
- **Components:** FormField, FormError (from `shared/lib/forms`)
- **Widget:** `ProductFormDialogWidget` - modal with create/edit modes

**Validators:**

- `requiredString` - non-empty string
- `positiveNumber` - number > 0
- `price` - number with 2 decimal places

---

## Routing & Pages

**Next.js App Router:**

- `/` → redirect to `/products`
- `/products` → products list page
- `/products/[id]` → product detail page

**Pages are thin:** Only widget composition + navigation callbacks

---

## Testing

**Stack:** Vitest + happy-dom + @testing-library/react

**Coverage:**

- 161 tests (32 test files)
- Unit tests: entities, features, shared
- Component tests: UI components, widgets
- Integration tests: hooks, data pipeline

**Setup:** `tests/setup.ts` - mocks Next.js Router, Image, Link, browser APIs

**Run:**

```bash
pnpm test          # watch mode
pnpm test:run      # CI mode
pnpm test:coverage # with coverage
```

---

## Code Quality

**Pre-commit hooks:** Husky + lint-staged

1. Prettier - format
2. ESLint - lint + auto-fix
3. Vitest - run tests (if test files modified)

**Commands:**

```bash
pnpm lint          # ESLint with auto-fix
pnpm lint:check    # ESLint without auto-fix (CI)
pnpm format        # Prettier format
pnpm format:check  # Prettier check (CI)
```

---

## Current Status

**Completed:**

- ✅ Stage 1: Project setup, FSD structure, basic routing
- ✅ Stage 2A: RTK Query, API integration
- ✅ Stage 2B: Filters, search, pagination
- ✅ Stage 2C: Local products (create/edit/delete), favorites, persistence
- ✅ Stage 2D (partial): Pagination auto-correction, hydration fixes

**Remaining:** See [TODO.md](TODO.md)

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

## File Naming Conventions

- Components: PascalCase (`ProductCard.tsx`)
- Hooks: camelCase with `use` prefix (`useProductsView.ts`)
- Types: PascalCase (`Product.ts`)
- Utils: camelCase (`filterProducts.ts`)
- Constants: UPPER_SNAKE_CASE in code, kebab-case files (`api-config.ts`)

---

## Migration Notes

### ID System Migration (Completed)

- **Before:** Numeric IDs (1, 2, 3...)
- **After:** String IDs ("1", "2", "-1"...)
- **Reason:** Type consistency, negative IDs for local products
- **Impact:** All ID comparisons now use strings

### Pagination Refactoring (Completed)

- **Before:** Validation logic in `ProductsWidget` (useEffect)
- **After:** Validation logic in `usePagination` hook
- **Reason:** Encapsulation, reusability, FSD compliance
- **Impact:** Any widget using `usePagination` gets auto-correction for free

---

**Last updated:** 20.11.2025
