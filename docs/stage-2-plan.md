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

### 1. Mock Fallback System

- [ ] Create `mocks/products.json` with sample data
- [ ] Implement API error handler with mock fallback
- [ ] Add fallback indicator UI
- [ ] Test API failure scenarios

### 2. Shared UI Components (`shared/ui`)

- [ ] Skeleton component for loading states
- [ ] Button component (if needed)
- [ ] Input component for search
- [ ] Other reusable atoms

### 3. Product Entity UI (`entities/product/ui`)

- [ ] ProductCard component (display-only, no favorites logic)
  - Product image
  - Title, price, category
  - Rating display
  - Link to details (future)
- [ ] Unit test for ProductCard

### 4. Features Layer

#### 4.1. Search Feature (`features/search`)

- [ ] Search input with debounce (~300ms)
- [ ] Search logic (filter by title/description)
- [ ] Integration test

#### 4.2. Pagination Feature (`features/pagination`)

- [ ] Client-side pagination component
- [ ] Page size selector
- [ ] Page navigation
- [ ] Integration test

#### 4.3. Toggle Favorite Feature (`features/toggle-favorite`)

- [ ] Favorite button component
- [ ] Redux slice for favorites state
- [ ] localStorage persistence integration
- [ ] Integration test

#### 4.4. Remove Product Feature (`features/remove-product`)

- [ ] Remove button component
- [ ] Redux slice for deleted state
- [ ] localStorage persistence integration
- [ ] Integration test

### 5. Products Widget (`widgets/products`)

- [ ] ProductsGrid - grid layout with ProductCards
- [ ] ProductsToolbar - search + filters
- [ ] ProductsSkeleton - loading state
- [ ] Compose features + entity UI

### 6. Main Product Page

- [ ] Create `/products` route (or update `/`)
- [ ] Integrate ProductsWidget
- [ ] Handle loading/error states
- [ ] E2E test (skeleton → data → search → pagination)

### 7. ProductState Integration

- [ ] Create Redux slice for product state
- [ ] Middleware for localStorage sync
- [ ] Hydrate state on app init
- [ ] Unit tests for state logic

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

### Mock Fallback

```typescript
// When API fails, return data from mocks/products.json
transformErrorResponse: (error) => {
  if (error.status === "FETCH_ERROR") {
    return getMockProducts()
  }
  throw error
}
```

### Search with Debounce

```typescript
const debouncedSearch = useDebouncedValue(searchQuery, 300)
const filtered = products.filter(
  (p) =>
    p.title.includes(debouncedSearch) || p.description.includes(debouncedSearch)
)
```

### Client-side Pagination

```typescript
const pageSize = 10
const currentPage = 1
const paginatedProducts = products.slice(
  (currentPage - 1) * pageSize,
  currentPage * pageSize
)
```

### Persistence Integration

```typescript
// On favorites toggle
dispatch(toggleFavorite(productId))
// Middleware syncs to localStorage via setToLS()

// On app init
const savedFavorites = getFromLS<number[]>("favorites")
dispatch(hydrateFavorites(savedFavorites))
```

---

## 🧪 Testing DoD

- [ ] ProductCard: 1 component test
- [ ] Mappers: 1-2 unit tests (from Stage 1)
- [ ] Search: 1 integration test
- [ ] Pagination: 1 integration test
- [ ] Toggle Favorite: 1 integration test
- [ ] E2E: Full flow (load → skeleton → data → search → paginate)

---

## 📊 Success Criteria

- [ ] All products display in grid
- [ ] Search filters products with 300ms debounce
- [ ] Pagination works client-side
- [ ] Favorites persist across page reloads
- [ ] Remove marks products as deleted (hidden from list)
- [ ] Mock fallback activates on API errors
- [ ] All tests passing
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

## 🚀 Next Steps After Stage 2

**Stage 3: Forms & Advanced Features (Future)**

- Product create/edit forms
- Form validation with Zod
- Optimistic updates
- Advanced filtering
- Server-side features (if API supports)

---

## 📝 Notes

- Keep components minimal and focused
- Follow FSD public API rules strictly
- Test each feature independently before integration
- Document any deviations from plan
- **Legacy smoke routes removed:** `/test-api` and `/test-persist` from Stage 1 were removed at Stage 2A start to reduce navigation noise. Automated tests will provide validation going forward.

---

**Status:** Ready to begin Stage 2 implementation!
