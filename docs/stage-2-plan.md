# Stage 2: UI & Features - Implementation Plan

**Status:** 🚧 **PLANNED**
**Previous:** [Stage 1 Report](stage-1-report.md) ✅
**Target Date:** TBD

---

## Overview

Stage 2 focuses on building the user interface and interactive features for the product showcase. This includes mock fallback implementation, UI components following FSD architecture, and core features (search, pagination, favorites, remove).

---

## 🎯 Goals

1. Implement mock fallback for API resilience
2. Create reusable Product UI components
3. Build interactive features (search, pagination, favorites)
4. Integrate ProductState persistence
5. Create main product showcase page

---

## 📋 Tasks

### Stage 2A+2B ✅ (Completed)

- [x] Shared UI components (Skeleton, ErrorMessage, EmptyState)
- [x] Product entity UI (ProductCard, ProductDetailCard + skeletons)
- [x] Products widget (ProductsGrid, ProductsToolbar, ProductsWidget)
- [x] Pages integration (/products, /products/[id])
- [x] Architecture standardization (named files, colocated tests)
- [x] FSD compliance verification

### Stage 2C (Steps 0–9)

#### Step 0: Docs Update

- [ ] Update all Stage 2C documentation with final roadmap
- [ ] Define constants (DEBOUNCE_MS, PAGE_SIZE)
- [ ] Clarify LocalStorage keys and reset behavior

#### Step 1: Dynamic Categories

- [ ] Create utility to extract unique categories from products
- [ ] `shared/lib/categories/getDynamicCategories.ts`
- [ ] Return Set → Array for use in filters
- [ ] Unit test for category extraction

#### Step 2: Search Feature

- [ ] `features/search/ui/SearchInput.tsx`
- [ ] `features/search/model/useSearch.ts` with debounce
- [ ] **DEBOUNCE_MS = 300ms**
- [ ] Filter by title/description (case-insensitive)
- [ ] Integration test

#### Step 3: Filters v1

- [ ] **Category filter:** Multi-select checkboxes (dynamic categories)
- [ ] **Price range:** Min–max sliders (dynamic from data)
- [ ] **Rating threshold:** Dropdown (≥ 5/4/3/2/1)
- [ ] `features/filters/ui/CategoryFilter.tsx`
- [ ] `features/filters/ui/PriceRangeFilter.tsx`
- [ ] `features/filters/ui/RatingFilter.tsx`
- [ ] `features/filters/model/useFilters.ts`
- [ ] Compose in ProductsToolbar
- [ ] Integration test

#### Step 4: Pagination

- [ ] `features/pagination/ui/Pagination.tsx`
- [ ] `features/pagination/model/usePagination.ts`
- [ ] **PAGE_SIZE = 10**
- [ ] Reset to page 1 on filter/search change
- [ ] Sync with search + filters
- [ ] Integration test

#### Step 5: Favorites (toggle-favorite)

- [ ] `features/toggle-favorite/ui/FavoriteButton.tsx`
- [ ] `features/toggle-favorite/model/favoritesSlice.ts`
- [ ] LocalStorage key: `favorites` (array of product IDs)
- [ ] Integrate FavoriteButton into ProductCard
- [ ] Toggle view: "All Products" / "Favorites Only"
- [ ] Integration test

#### Step 6: Remove + Reset Local Data

- [ ] `features/remove-product/ui/RemoveButton.tsx`
- [ ] `features/remove-product/model/removedSlice.ts`
- [ ] LocalStorage key: `removed`
- [ ] Filter removed products from display
- [ ] **Reset button:** Clear all LS (`favorites`, `removed`, `formDrafts`)
- [ ] Reset reinitializes store and refetches `/products`
- [ ] Integration test

#### Step 7: Create/Edit Forms (RHF + Zod)

- [ ] `app/products/create/page.tsx`
- [ ] `app/products/[id]/edit/page.tsx`
- [ ] `features/product-form/ui/ProductForm.tsx`
- [ ] Zod schema: title, price, description, category, image, rating
- [ ] React Hook Form integration
- [ ] Store locally (no server POST/PUT)
- [ ] Form validation tests

#### Step 8: not-found.tsx + ID Validation

- [ ] `app/not-found.tsx` (global 404)
- [ ] `app/products/[id]/not-found.tsx` (product-specific)
- [ ] Validate product ID format
- [ ] Handle non-existent product IDs
- [ ] Graceful error handling

#### Step 9: Global ErrorBoundary + Guards + Tests

- [ ] Global ErrorBoundary in `app/layout.tsx`
- [ ] Page-level guards for edge cases
- [ ] Smoke tests for all features
- [ ] Integration tests (search + filters + pagination flow)
- [ ] E2E test (full user flow)

---

## 📐 Architecture

### FSD Layer Structure

```
src/
├── shared/
│   └── ui/
│       ├── Skeleton.tsx       ✅ Already exists
│       ├── Button.tsx         🚧 If needed
│       └── Input.tsx          🚧 If needed
│
├── entities/
│   └── product/
│       └── ui/
│           └── ProductCard.tsx  🚧 To implement
│
├── features/
│   ├── search/
│   │   ├── ui/
│   │   │   └── SearchInput.tsx
│   │   └── model/
│   │       └── useSearch.ts
│   ├── pagination/
│   │   ├── ui/
│   │   │   └── Pagination.tsx
│   │   └── model/
│   │       └── usePagination.ts
│   ├── toggle-favorite/
│   │   ├── ui/
│   │   │   └── FavoriteButton.tsx
│   │   └── model/
│   │       └── favoritesSlice.ts
│   └── remove-product/
│       ├── ui/
│       │   └── RemoveButton.tsx
│       └── model/
│           └── deletedSlice.ts
│
└── widgets/
    └── products/
        └── ui/
            ├── ProductsGrid.tsx
            ├── ProductsToolbar.tsx
            └── ProductsSkeleton.tsx
```

---

## ⚙️ Technical Requirements

### Constants

```typescript
// Search debounce delay
export const DEBOUNCE_MS = 300

// Pagination page size
export const PAGE_SIZE = 10

// LocalStorage keys
export const LS_KEYS = {
  FAVORITES: "favorites", // number[]
  REMOVED: "removed", // number[]
  FORM_DRAFTS: "formDrafts", // optional
} as const
```

### Dynamic Categories

```typescript
// Extract unique categories from products
export function getDynamicCategories(products: Product[]): string[] {
  const categorySet = new Set(products.map((p) => p.category))
  return Array.from(categorySet).sort()
}
```

### Search with Debounce

```typescript
// DEBOUNCE_MS = 300
const debouncedSearch = useDebouncedValue(searchQuery, DEBOUNCE_MS)
const filtered = products.filter(
  (p) =>
    p.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
    p.description.toLowerCase().includes(debouncedSearch.toLowerCase())
)
```

### Filters v1

```typescript
// Category: multi-select
const selectedCategories: string[] = ["electronics", "jewelery"]
const categoryFiltered = products.filter((p) =>
  selectedCategories.includes(p.category)
)

// Price range: dynamic min/max from data
const prices = products.map((p) => p.price)
const minPrice = Math.min(...prices)
const maxPrice = Math.max(...prices)
const priceFiltered = products.filter(
  (p) => p.price >= selectedMin && p.price <= selectedMax
)

// Rating threshold: ≥ N
const ratingFiltered = products.filter((p) => p.rating.rate >= minRating)
```

### Client-side Pagination

```typescript
// PAGE_SIZE = 10
const currentPage = 1
const paginatedProducts = products.slice(
  (currentPage - 1) * PAGE_SIZE,
  currentPage * PAGE_SIZE
)

// Reset to page 1 on filter/search change
useEffect(() => {
  setCurrentPage(1)
}, [searchQuery, selectedCategories, priceRange, minRating])
```

### Persistence Integration

```typescript
// On favorites toggle
dispatch(toggleFavorite(productId))
// Middleware syncs to localStorage via setToLS(LS_KEYS.FAVORITES, ids)

// On app init
const savedFavorites = getFromLS<number[]>(LS_KEYS.FAVORITES) ?? []
dispatch(hydrateFavorites(savedFavorites))

// Reset local data
export function resetLocalData() {
  removeFromLS(LS_KEYS.FAVORITES)
  removeFromLS(LS_KEYS.REMOVED)
  removeFromLS(LS_KEYS.FORM_DRAFTS)
  // Reinitialize store
  dispatch(resetFavorites())
  dispatch(resetRemoved())
  // Refetch products
  dispatch(productsApi.util.invalidateTags(["Product"]))
}
```

### Mock Fallback (Stage 3)

```typescript
// Deferred to Stage 3 - not in Stage 2C scope
transformErrorResponse: (error) => {
  if (error.status === "FETCH_ERROR") {
    return getMockProducts()
  }
  throw error
}
```

---

## 🧪 Testing DoD

### Stage 2A+2B ✅

- [x] Shared UI: Skeleton, ErrorMessage, EmptyState (smoke tests)
- [x] Product UI: ProductCard, ProductDetailCard + skeletons (smoke tests)
- [x] Widgets: ProductsGrid, ProductsToolbar, ProductsWidget (smoke tests)
- [x] Quality gates: 10/10 tests passing

### Stage 2C

- [ ] **Dynamic Categories:** Unit test for `getDynamicCategories`
- [ ] **Search:** Integration test (debounce + filter)
- [ ] **Filters:** Integration test (category + price + rating)
- [ ] **Pagination:** Integration test (page navigation + reset)
- [ ] **Favorites:** Integration test (toggle + persist + view toggle)
- [ ] **Remove + Reset:** Integration test (soft-delete + LS reset)
- [ ] **Forms:** Validation tests (Zod schemas)
- [ ] **not-found:** Render tests (404 handling)
- [ ] **ErrorBoundary:** Error handling tests
- [ ] **E2E:** Full flow (load → search → filter → paginate → favorite → remove)

---

## 📊 Success Criteria

### Stage 2A+2B ✅

- [x] All products display in grid
- [x] ProductCard + ProductDetailCard working
- [x] Loading states (skeletons) working
- [x] Error handling isolated (doesn't crash app)
- [x] All tests passing (10/10)
- [x] FSD rules followed
- [x] Code quality (lint + format) passing

### Stage 2C

- [ ] **Dynamic categories** extracted from API data
- [ ] **Search** filters products with 300ms debounce
- [ ] **Filters** (category + price + rating) working and synced
- [ ] **Pagination** works client-side (PAGE_SIZE = 10)
- [ ] Pagination resets to page 1 on filter/search change
- [ ] **Favorites** persist across page reloads
- [ ] Favorites toggle view ("All" / "Favorites Only") working
- [ ] **Remove** marks products as deleted (hidden from list)
- [ ] **Reset local data** clears LS and refetches
- [ ] **Create/Edit forms** validate with Zod and store locally
- [ ] **404 handling** (not-found.tsx) for invalid IDs
- [ ] **ErrorBoundary** prevents whole app crashes
- [ ] All tests passing (smoke + integration + E2E)
- [ ] FSD rules followed
- [ ] Code quality (lint + format) passing

---

## 🔗 Dependencies

### From Stage 1

- ✅ Product entity types and mappers
- ✅ RTK Query endpoints (getProducts, getProductById)
- ✅ Persist utilities (getFromLS, setToLS, removeFromLS)
- ✅ Base API configuration

### External

- Redux Toolkit (state management)
- Tailwind CSS (styling)
- Zod + React Hook Form (forms, if needed for create/edit)

---

## 🚀 Next Steps After Stage 2C

**Stage 3: Polish & Production Prep**

- UX refinement (optimistic UI, animations, responsive design)
- Fallback strategy (network → cache → mocks)
- E2E tests with Playwright
- Performance optimization (code splitting, next/image, bundle analysis)
- SEO and accessibility improvements

---

## 📝 Notes

- Keep components minimal and focused
- Follow FSD public API rules strictly
- Test each feature independently before integration
- Document any deviations from plan
- **Legacy smoke routes removed:** `/test-api` and `/test-persist` from Stage 1 were removed at Stage 2A start to reduce navigation noise. Automated tests will provide validation going forward.

---

**Status:** Ready to begin Stage 2 implementation!
