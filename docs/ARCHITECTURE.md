# Architecture Overview

**Stack:** Next.js 16, React 19, TypeScript, Redux Toolkit + RTK Query, Tailwind CSS v4
**Pattern:** Feature-Sliced Design (FSD)

---

## FSD Layer Structure

```
src/
├── app/           # Next.js routes, providers, global config
├── widgets/       # Smart UI blocks with data fetching
├── features/      # Business logic & user interactions
├── entities/      # Business models & data
└── shared/        # Reusable infrastructure (UI, utils, API config)
```

**Import Rules:** Top → Bottom only (`app` → `widgets` → `features` → `entities` → `shared`)

---

## State Management

### Redux Toolkit + RTK Query

**Slices:**

- `pagination` - current page, items per page (10)
- `filters` - category, search, price, rating
- `favorites` - favorite IDs (persisted to localStorage)
- `localProducts` - created/deleted/patched products (persisted to localStorage)

**API:** Base API at `src/shared/api/baseApi.ts`, endpoints injected via `baseApi.injectEndpoints()`

**Persistence:** Custom middleware stores `favorites` + `localProducts` to localStorage (SSR-safe)

---

## Data Flow Pipeline

### Products List (`/products`)

```
API → useMergedProducts → useFavoriteProducts → useFilteredProducts → usePagination → ProductsWidget
```

1. Fetch from API (fakestoreapi.com)
2. Merge with local patches/creations/deletions
3. Filter by favorites (if enabled)
4. Apply category/search/price/rating filters
5. Paginate (10 items/page)
6. Render grid + toolbar

**Aggregation Hook:** `widgets/products/hooks/useProductsView.ts`

### Product Detail (`/products/[id]`)

```
API + localProducts → useProductView → ProductDetailWidget
```

1. Fetch product by ID
2. Apply local patches, check if deleted
3. Render detail card + actions

---

## Key Features

### 1. Filters

- Search (debounced 300ms) - title/description
- Multi-select categories
- Price range slider (min/max)
- Rating threshold (1-5 stars)
- Show only favorites toggle

**Filter Cascade:** Removed → Search → Categories → Rating → Favorites → Price

### 2. Pagination

- Front-end pagination (10 items/page)
- Auto-corrects page when total pages decrease
- Resets to page 1 when filters change

### 3. Favorites

- Add/remove products
- Persisted to localStorage
- Filter to show only favorites
- Auto-cleanup when product deleted

### 4. Local Products (CRUD)

- **Create:** New products with negative IDs (`-1`, `-2`)
- **Update:** Patches stored in `patchedLocal`
- **Delete:** Soft delete (API products hidden, local hard-deleted)
- **ID System:** API = positive strings (`"1"`, `"2"`), local = negative (`"-1"`, `"-2"`)

**Form:** React Hook Form + Zod validation in modal dialog

---

## Widgets (Smart Components)

**Pattern:** Widgets own their data fetching, pages are thin routing layers.

### ProductsWidget

- Fetch products via RTK Query
- Apply full data pipeline
- Handle loading/error/empty states
- Render toolbar + grid + pagination

### ProductDetailWidget

- Fetch product by ID
- Apply local patches
- Handle loading/error/not-found states
- Render detail card + actions

---

## API Integration

**Base URL:** `https://fakestoreapi.com`

**Endpoints:**

- `GET /products` - all products
- `GET /products/:id` - single product

**Product Type:**

```typescript
{
  id: string        // "1", "2", "-1" (negative for local)
  title: string
  price: number
  description: string
  category: string  // "men's clothing" | "women's clothing" | "jewelery" | "electronics"
  image: string
  rating: { rate: number, count: number }
}
```

---

## Forms & Validation

**Stack:** React Hook Form + Zod + @hookform/resolvers

**Validation:**

- `title` - required, min 3 chars
- `price` - positive number
- `category` - enum (4 categories)
- `description` - optional
- `image` - valid URL
- `rating.rate` - 0-5
- `rating.count` - non-negative integer

---

## Routing (Next.js App Router)

- `/` → redirect to `/products`
- `/products` → products list
- `/products/[id]` → product detail

**Pattern:** Pages only compose widgets + handle navigation, no data fetching.

---

## Testing

**Stack:** Vitest + happy-dom + @testing-library/react + Playwright (E2E)

**Coverage:** 174 tests across entities, features, widgets, shared utils

**Commands:**

```bash
pnpm test              # watch mode
pnpm test:run          # CI mode (pre-commit)
pnpm test:e2e          # E2E (Playwright)
pnpm test:coverage     # coverage report
```

**Setup:** `tests/setup.ts` mocks Next.js Router, Image, Link, browser APIs.

---

## Code Quality

**Pre-commit Hooks:** Husky runs Prettier + ESLint + Vitest on staged files

**Path Aliases:** `@/*` → `src/*`

**TypeScript:** Strict mode, target ES2017, automatic JSX

---

## Key Architectural Decisions

### Why FSD?

- Scalability: Add features without modifying existing code
- Separation of concerns: Business logic isolated from UI
- Predictable structure: Clear import rules prevent coupling

### Why Smart Widgets?

- Data colocation: Widgets own data fetching
- Thin pages: Routes stay simple
- SSR flexibility: Dynamic imports for localStorage-dependent widgets
- Testability: Widgets testable with MSW without routing

### Why RTK Query?

- Caching: Automatic request deduplication
- Loading states: Built-in `isLoading`, `isFetching`, `error`
- Type safety: Full TypeScript inference

### Why Front-end Pagination?

- API limitation: FakeStoreAPI doesn't support server pagination
- Small dataset: ~20 products, acceptable client-side
- Future-proof: Easy to swap with server pagination

### Why localStorage (not Redux Persist)?

- Simplicity: Direct control over persistence
- Custom middleware: Selective persistence (`favorites`, `localProducts`)
- SSR safety: Manual `createPreloadedState()` prevents hydration bugs

---

## Current Status

**Implemented:**

- ✅ Products list & detail pages
- ✅ Search (debounced), filters (category, price, rating), pagination
- ✅ Favorites with persistence
- ✅ Local products (create/edit/delete)
- ✅ Dark/light theme toggle
- ✅ Toast notifications
- ✅ Error boundaries, 404 page, empty states
- ✅ 174 unit/component tests
- ✅ Deployed to Vercel

**Next Steps:** See [TODO.md](TODO.md) for portfolio improvements.

---

**Last Updated:** 2025-11-30
