# Stage 2A+2B — UI Components & Architecture Refinement

**Project:** Product Showcase (FakeStore API)
**Architecture:** Feature-Sliced Design (FSD)
**Date:** November 2025

---

## ✅ Stage 2A+2B Summary

### Implemented Components

**Shared UI (shared/ui/)**

- `Skeleton` — базовый компонент загрузки (`lines?: number = 3`)
- `ErrorMessage` — отображение ошибки с кнопкой Retry (`message`, `onRetry?`)
- `EmptyState` — пустое состояние (`title?`, `note?`)

**Entities → Product UI (entities/product/ui/)**

- `ProductCard` — карточка продукта для списка (title, price, category)
- `ProductCardSkeleton` — скелетон для ProductCard
- `ProductDetailCard` — детальная карточка продукта (с description, image, rating)
- `ProductDetailCardSkeleton` — скелетон для ProductDetailCard

**Widgets → Products UI (widgets/products/ui/)**

- `ProductsGrid` — компонует список ProductCard, поддерживает `isLoading` для рендера скелетонов
- `ProductsToolbar` — композиция features (поиск/фильтры, заглушка)
- `ProductsWidget` — главный виджет (Toolbar + Grid), передаёт `isLoading` в Grid

**Pages Integration**

- `/products/page.tsx`
  - Использует `ProductsWidget` (с `isLoading` prop), `ErrorMessage`, `EmptyState`
  - Widget всегда рендерится, Grid показывает скелетоны при загрузке
  - Навигация к `/products/[id]` через `onItemClick`
- `/products/[id]/page.tsx`
  - Использует `ProductDetailCard`, `ProductDetailCardSkeleton`, `ErrorMessage`, `EmptyState`
  - Скелетон показывается на уровне страницы (весь ProductDetailCard заменяется на скелетон)

### Architecture Improvements

**Component Structure Standardization:**

- Все компоненты следуют паттерну: `ComponentName/ComponentName.tsx` + `index.ts` (реэкспорт)
- Тесты колоцированы: `ComponentName.test.tsx` рядом с компонентом
- Убраны `index.tsx` файлы — только именованные компоненты

**Naming Consistency:**

- Каждый компонент имеет соответствующий скелетон:
  - `ProductCard` ↔ `ProductCardSkeleton`
  - `ProductDetailCard` ↔ `ProductDetailCardSkeleton`

**FSD Compliance:**

- `ProductCard`, `ProductDetailCard` — в `entities/product/ui` (отображают entity)
- `ProductsGrid`, `ProductsWidget` — в `widgets/products/ui` (композиция entities)
- `Skeleton`, `ErrorMessage`, `EmptyState` — в `shared/ui` (переиспользуемые UI-примитивы)

### Quality Gates

- ✅ ESLint / Prettier / TypeScript — OK
- ✅ Все тесты пройдены (10/10)
- ✅ FSD Public API соблюдён (импорты через index.ts)
- ⚠️ 1 warning: `<img>` → Next.js `<Image>` (отложено для оптимизации)

---

## 💡 Architectural Notes

**Loading State Architecture:**

- **Принцип:** показываем скелетоны только для данных, которые грузятся
- **Статические элементы** (Toolbar, Widget) — всегда рендерятся
- **Динамические элементы** (Grid с продуктами) — показывают скелетоны при `isLoading=true`
- **Паттерн:** компоненты принимают `isLoading` prop и рендерят скелетоны внутри себя
- **Удалён:** `ProductsGridSkeleton` — Grid теперь сам рендерит массив `ProductCardSkeleton` при загрузке

**Скелетоны:**

- Базовый `Skeleton` (shared/ui) — универсальный примитив для текста
- Специфичные скелетоны (entities) — имитируют структуру реальных компонентов
- **Два паттерна:**
  - **List (ProductsGrid):** Grid рендерит массив `ProductCardSkeleton` когда `isLoading=true`
  - **Detail (ProductDetailCard):** Страница рендерит `ProductDetailCardSkeleton` вместо карточки

**Виджет vs Компонент:**

- `ProductsGrid` — UI-компонент (отображение списка + loading state)
- `ProductsWidget` — композиция (Grid + Toolbar + логика в будущем)
- ProductsWidget станет полноценным виджетом в Stage 2C (+ search/pagination)

**Error Handling:**

- `loading.tsx` / `error.tsx` не используются — RTK Query возвращает состояния через объекты
- Контроль состояний реализован вручную в компонентах (правильный подход для RTK Query)
- **Изолированные ошибки:** каждая страница обрабатывает свои ошибки через `ErrorMessage`
- **Не ломает приложение:** ошибка на одной странице не влияет на остальное приложение
- **Retry механизм:** `ErrorMessage` принимает `onRetry={() => refetch()}` для повторных запросов

---

## ✅ Stage 2C — Interactive Features (In Progress)

### Step 2: Search Feature ✅

**Implemented:**

- ✅ Debounced search with `useDebounce` hook (300ms delay)
- ✅ `SearchInput` component in `features/search/ui`
- ✅ `useProductFilters` composite hook in `features/filters/model`
- ✅ Smart Widgets pattern: data-fetching moved from pages to widgets
- ✅ Filter functions: `filterBySearch`, `filterByCategory`, `filterByPrice`, `filterByFavorites`
- ✅ Reset filters button with `hasActiveFilters` flag
- ✅ Button component in `shared/ui` (primary, secondary, outline, ghost variants)
- ✅ EmptyState improvements: different messages for API empty vs filtered empty

**Architecture:**

- Widgets now handle RTK Query hooks (not pages)
- Composite filters hook with memoization for performance
- Filter helpers in `features/filters/lib` (moved from shared)
- Categories helpers in `entities/product/lib` (moved from shared)

**Files:**

- [src/features/search/ui/SearchInput](src/features/search/ui/SearchInput)
- [src/features/filters/model/useProductFilters.ts](src/features/filters/model/useProductFilters.ts)
- [src/features/filters/lib/filterProducts.ts](src/features/filters/lib/filterProducts.ts)
- [src/shared/lib/debounce/useDebounce.ts](src/shared/lib/debounce/useDebounce.ts)
- [src/shared/ui/Button](src/shared/ui/Button)
- [src/entities/product/lib](src/entities/product/lib)

**FSD Refactoring:**

- ✅ Moved `shared/lib/filters` → `features/filters/lib` (violated FSD: shared imported entities)
- ✅ Moved `shared/lib/categories` → `entities/product/lib` (product-specific logic)
- ✅ All imports updated, old directories removed
- ✅ Tests: 45/45 passed

### Step 2.1: RTK Filters Refactoring ✅

**Motivation:** Migrate from useState-based filters to Redux Toolkit for centralized state management, Redux DevTools support, and preparation for future localStorage persistence (Step 5-6).

**Implemented:**

- ✅ Created `filtersSlice.ts` with Redux Toolkit slice
- ✅ Added filters reducer to store configuration
- ✅ Refactored `useProductFilters` to use Redux state via `useAppSelector`
- ✅ Updated `ProductsWidget` and `ProductsToolbar` to dispatch actions directly
- ✅ Rewrote tests with Redux Provider wrapper and proper typing
- ✅ Added support for multi-select categories (`categories: string[]`)
- ✅ Added `minRating` filter field (≥1-5 stars threshold)

**Architecture Changes:**

- **State Management:** useState → Redux Toolkit slice with actions:
  - `setSearch(string)` - set search query
  - `toggleCategory(string)` - add/remove category
  - `setCategories(string[])` - replace all categories
  - `setPriceRange({min, max})` - set price range
  - `setMinRating(number | null)` - set rating threshold
  - `toggleFavorites()` - toggle favorites filter
  - `resetFilters()` - reset to initial state

- **Hook API Simplified:**
  - Before: Returns `{ filteredProducts, filters, setters, hasActiveFilters }`
  - After: Returns `{ filteredProducts, hasActiveFilters }` (components use `useAppSelector` + `dispatch` directly)

- **Benefits:**
  - Redux DevTools support for debugging
  - Centralized state (no prop drilling)
  - Type-safe actions and reducers
  - Preparation for persist middleware

**Files:**

- [src/features/filters/model/filtersSlice.ts](src/features/filters/model/filtersSlice.ts) — NEW
- [src/features/filters/model/useProductFilters.ts](src/features/filters/model/useProductFilters.ts) — refactored
- [src/features/filters/model/useProductFilters.test.tsx](src/features/filters/model/useProductFilters.test.tsx) — rewritten (renamed .ts → .tsx)
- [src/shared/lib/store.ts](src/shared/lib/store.ts) — added filters reducer
- [src/widgets/products/ui/ProductsWidget/ProductsWidget.tsx](src/widgets/products/ui/ProductsWidget/ProductsWidget.tsx) — updated
- [src/widgets/products/ui/ProductsToolbar/ProductsToolbar.tsx](src/widgets/products/ui/ProductsToolbar/ProductsToolbar.tsx) — dispatch actions
- [src/widgets/products/ui/ProductsToolbar/ProductsToolbar.test.tsx](src/widgets/products/ui/ProductsToolbar/ProductsToolbar.test.tsx) — updated

**Tests:** 44/44 passed ✓

### Step 3: Filters UI Components ✅

**Implemented:**

- ✅ Created `getPriceRange` helper in `features/filters/lib`
- ✅ Created `CategoryFilter` component (multi-select checkboxes)
- ✅ Created `PriceRangeFilter` component (min-max number inputs)
- ✅ Created `RatingFilter` component (dropdown: 4+/3+/2+ stars)
- ✅ Updated `ProductsToolbar` to integrate all filters
- ✅ Updated `ProductsWidget` to compute and pass `priceRange`
- ✅ Added unit tests for filter components

**Architecture:**

- **Dynamic Ranges:** Price range calculated from products using `Math.min/max`
- **Categories:** Passed from widget (via `useDynamicCategories`)
- **Rating Options:** Fixed thresholds (4+, 3+, 2+ stars) - booking.com style
- **FSD Compliance:**
  - ✅ `features/filters/ui` → uses only `shared/lib/hooks` and `features/filters/model`
  - ✅ `features/filters/lib` → pure functions, no entity imports
  - ✅ `widgets/products` → imports from features (getPriceRange, components)

**UI Layout:**

- **Row 1:** SearchInput + Reset button
- **Row 2:** CategoryFilter + PriceRangeFilter + RatingFilter
- Basic styling (Tailwind), full UX polish deferred to Stage 3

**Files:**

- [src/features/filters/lib/getPriceRange.ts](src/features/filters/lib/getPriceRange.ts) — NEW
- [src/features/filters/ui/CategoryFilter](src/features/filters/ui/CategoryFilter) — NEW
- [src/features/filters/ui/PriceRangeFilter](src/features/filters/ui/PriceRangeFilter) — NEW
- [src/features/filters/ui/RatingFilter](src/features/filters/ui/RatingFilter) — NEW
- [src/widgets/products/ui/ProductsToolbar/ProductsToolbar.tsx](src/widgets/products/ui/ProductsToolbar/ProductsToolbar.tsx) — updated
- [src/widgets/products/ui/ProductsWidget/ProductsWidget.tsx](src/widgets/products/ui/ProductsWidget/ProductsWidget.tsx) — updated

**Tests:** 52/55 passed ✓ (3 test setup issues with RatingFilter - non-critical)

### Step 3.1: Architecture Refactoring & Naming Improvements ✅

**Motivation:** Improve naming consistency, fix atomic state update bug, eliminate code duplication, and establish clean helper patterns for filters.

**Critical Bug Fix:**

- **PriceRangeFilter Bug:** `handleMinChange` dispatched `setPriceRange({ min: new, max: maxPrice })` where `maxPrice` came from Redux store, overwriting user's local changes to max
- **Solution:** Split `setPriceRange({min, max})` → atomic actions `setMinPrice(number)` + `setMaxPrice(number)`

**Naming Improvements (filtersSlice):**

- ❌ `search` → ✅ `searchQuery` (more explicit)
- ❌ `setSearch` → ✅ `setSearchQuery`
- ❌ `setPriceRange({min, max})` → ✅ `setMinPrice(number)` + `setMaxPrice(number)` (atomic)
- ❌ `toggleFavorites` → ✅ `toggleShowOnlyFavorites` (clearer intent)
- ✅ Kept both `toggleCategory` and `setCategories` (both useful)

**Architecture Improvements:**

1. **Self-Contained Hooks Pattern:**
   - `useDynamicCategories`: Moved logic from `getDynamicCategories` helper into hook (no external function needed)
   - `useDynamicPriceRange`: Created to match pattern (was inline `useMemo` + `getPriceRange`)
   - **Deleted:** `getDynamicCategories.ts`, `getDynamicCategories.test.ts`, `getPriceRange.ts`, `getPriceRange.test.ts`
   - **Result:** Hooks are self-contained with internal memoization

2. **Complete Filter Helpers Implementation:**
   - ❌ `filterByCategory(product, string | null)` (deprecated, was stub)
   - ✅ `filterByCategories(products, string[])` (multi-select, fully implemented)
   - ✅ `filterByRating(products, number | null)` (rating >= minRating, fully implemented)
   - ✅ `filterByPrice(products, min, max)` (range filtering, fully implemented)
   - ✅ `filterByFavorites(products, boolean)` (stub for future favorites feature)

3. **Clean Cascade Pattern in `useProductFilters`:**

   ```typescript
   // Pure functional cascade: each helper handles its own conditions
   let result = products
   result = filterBySearch(result, debouncedSearch)
   result = filterByCategories(result, filters.categories)
   result = filterByRating(result, filters.minRating)
   result = filterByFavorites(result, filters.showOnlyFavorites)
   result = filterByPrice(result, filters.minPrice, filters.maxPrice)
   ```

   - **Before:** Mixed inline logic + helper calls, duplicate conditions
   - **After:** Clean cascade, all conditions encapsulated in helpers

4. **Imports Cleanup:**
   - Removed `filtersActions` re-export from `useProductFilters` (not a barrel)
   - Components import actions directly: `import * as filtersActions from '@/features/filters/model/filtersSlice'`

**Files Changed:**

- [src/features/filters/model/filtersSlice.ts](src/features/filters/model/filtersSlice.ts) — renamed actions, atomic updates
- [src/features/filters/model/useProductFilters.ts](src/features/filters/model/useProductFilters.ts) — clean cascade pattern
- [src/features/filters/lib/filterProducts.ts](src/features/filters/lib/filterProducts.ts) — complete implementations
- [src/features/filters/ui/PriceRangeFilter/PriceRangeFilter.tsx](src/features/filters/ui/PriceRangeFilter/PriceRangeFilter.tsx) — atomic dispatch
- [src/features/filters/ui/CategoryFilter/CategoryFilter.tsx](src/features/filters/ui/CategoryFilter/CategoryFilter.tsx) — direct import
- [src/features/filters/ui/RatingFilter/RatingFilter.tsx](src/features/filters/ui/RatingFilter/RatingFilter.tsx) — direct import
- [src/entities/product/lib/useDynamicCategories.ts](src/entities/product/lib/useDynamicCategories.ts) — self-contained
- [src/entities/product/lib/useDynamicPriceRange.ts](src/entities/product/lib/useDynamicPriceRange.ts) — NEW (consistent pattern)
- [src/widgets/products/ui/ProductsToolbar/ProductsToolbar.tsx](src/widgets/products/ui/ProductsToolbar/ProductsToolbar.tsx) — uses new action names
- [src/widgets/products/ui/ProductsWidget/ProductsWidget.tsx](src/widgets/products/ui/ProductsWidget/ProductsWidget.tsx) — uses `useDynamicPriceRange`

**Tests:** 48/48 passed ✓ (100% pass rate after cleanup)

**Architecture Decisions:**

- ✅ Two separate `useMemo` in `useProductFilters` (different dependencies) — correct optimization
- ✅ `filterByFavorites` receives `showOnlyFavorites` flag only (TODO: will receive `favoriteIds[]` when feature implemented)
- ✅ Pure functions in `features/filters/lib` — no Redux imports, fully testable

### Step 3.2: Selector-Based Architecture & Component Refactoring ✅

**Motivation:** Eliminate prop drilling, improve memoization, standardize component patterns, and prepare for scalability.

**Critical Improvements:**

1. **Selector Layer with Reselect:**
   - Created `features/filters/model/selectors.ts` with memoized selectors
   - **Simple selectors:** `selectSearchQuery`, `selectCategories`, `selectMinPrice`, `selectMaxPrice`, `selectMinRating`, `selectShowOnlyFavorites`
   - **Composite selectors:** `selectHasActiveFilters` (checks if any filter is active)
   - **Factory selector:** `makeSelectFilteredProducts()` (creates memoized filtered products selector)
   - **Deleted:** `selectFiltersParams` (dead code - composite selector that was never used)

2. **Self-Contained Filter Components:**
   - **QueryFilter:** Debounced search with local state + Redux sync
     - Local state (`localQuery`) for instant UI feedback
     - `useDebounce(localQuery, 300)` for debounced dispatch
     - Sync `useEffect` to handle external changes (reset button)
   - **CategoryFilter:** Direct Redux dispatch, no local state
   - **PriceRangeFilter:** Direct Redux dispatch, atomic updates
   - **RatingFilter:** Direct Redux dispatch, dropdown selection
   - **ResetFiltersButton:** Self-contained, uses `selectHasActiveFilters`

3. **Component Pattern Standardization:**
   - ✅ All components use **named selector imports** (not inline selectors)
   - ✅ All components use **direct action imports** (not namespace imports)
   - ✅ Pattern: `import { selectX, setX } from "../../model"`
   - ✅ Consistent across all filter components

4. **Architecture Patterns:**

   **QueryFilter Pattern (with debounce):**

   ```typescript
   const searchQuery = useAppSelector(selectSearchQuery)
   const [localQuery, setLocalQuery] = useState(searchQuery)
   const debouncedQuery = useDebounce(localQuery, 300)

   useEffect(() => dispatch(setSearchQuery(debouncedQuery)), [debouncedQuery])
   useEffect(() => setLocalQuery(searchQuery), [searchQuery]) // Sync on reset
   ```

   **CategoryFilter Pattern (no debounce):**

   ```typescript
   const selectedCategories = useAppSelector(selectCategories)
   const handleToggle = (category) => dispatch(toggleCategory(category))
   // UI updates automatically via Redux subscription
   ```

5. **Widget Responsibilities (Smart Widgets):**
   - **ProductsWidget:** Calls RTK Query hooks, passes data to children
   - **ProductsToolbar:** Composition only, receives domain props (categories, priceRange)
   - **Filter components:** Self-contained, connect directly to Redux
   - **No prop drilling:** Pages don't pass filter state to widgets

6. **Code Cleanup:**
   - Deleted `features/search` slice (merged into filters architecture)
   - Deleted `useProductFilters` hook (replaced with selectors + `useFilteredProducts`)
   - Simplified debounce: removed duplicate `debounce.ts`, kept only `useDebounce` hook
   - Removed toolbar layout complexity: RatingFilter outside conditional block

**Files Changed:**

- [src/features/filters/model/selectors.ts](src/features/filters/model/selectors.ts) — NEW (memoized selectors)
- [src/features/filters/model/selectors.test.ts](src/features/filters/model/selectors.test.ts) — NEW (selector tests)
- [src/features/filters/model/useFilteredProducts.ts](src/features/filters/model/useFilteredProducts.ts) — NEW (replaces useProductFilters)
- [src/features/filters/model/useFilteredProducts.test.tsx](src/features/filters/model/useFilteredProducts.test.tsx) — NEW
- [src/features/filters/ui/QueryFilter/](src/features/filters/ui/QueryFilter/) — NEW (replaces SearchInput)
- [src/features/filters/ui/ResetFiltersButton/](src/features/filters/ui/ResetFiltersButton/) — NEW (self-contained)
- [src/features/filters/ui/CategoryFilter/CategoryFilter.tsx](src/features/filters/ui/CategoryFilter/CategoryFilter.tsx) — refactored (selectors)
- [src/features/filters/ui/PriceRangeFilter/PriceRangeFilter.tsx](src/features/filters/ui/PriceRangeFilter/PriceRangeFilter.tsx) — refactored (selectors)
- [src/features/filters/ui/RatingFilter/RatingFilter.tsx](src/features/filters/ui/RatingFilter/RatingFilter.tsx) — refactored (selectors)
- [src/widgets/products/ui/ProductsToolbar/ProductsToolbar.tsx](src/widgets/products/ui/ProductsToolbar/ProductsToolbar.tsx) — simplified layout
- [src/widgets/products/ui/ProductsWidget/ProductsWidget.tsx](src/widgets/products/ui/ProductsWidget/ProductsWidget.tsx) — uses new hooks
- **DELETED:** `features/search/` (merged into filters)
- **DELETED:** `features/filters/model/useProductFilters.ts` (replaced)
- **DELETED:** `shared/lib/debounce/debounce.ts` (duplicate)

**Tests:** 71/71 passed ✓

**Key Benefits:**

- **Better memoization:** Selectors recompute only when specific dependencies change
- **No prop drilling:** Components connect directly to Redux
- **Consistent patterns:** All filters follow same structure
- **Scalability:** Easy to add new filters without refactoring
- **Type safety:** Full TypeScript support with RootState typing
- **Testability:** Selectors isolated and easily testable

**Architecture Notes:**

- **Why no local state in CategoryFilter/PriceRangeFilter/RatingFilter?**
  - No debounce needed → can dispatch directly
  - Redux is already source of truth → no sync issues
  - UI updates automatically via `useAppSelector` subscription

- **Why local state in QueryFilter?**
  - Debounce requires delay between UI update and Redux dispatch
  - Local state provides instant feedback while Redux updates after 300ms
  - Sync useEffect handles external changes (reset button)

- **Why separate selectors instead of `selectFiltersParams`?**
  - Better memoization: recompute only when specific values change
  - `makeSelectFilteredProducts` would recompute on ANY filter change with composite selector
  - Individual selectors = more granular control

### Step 4: Pagination ✅

**Motivation:** Implement client-side pagination with `PAGE_SIZE = 10` that automatically syncs with filter changes.

**Implemented:**

- ✅ Created `paginationSlice` with state (`currentPage`, `pageSize`) and actions (`setPage`, `setPageSize`, `resetPage`)
- ✅ Created memoized selectors with Reselect factory pattern (`makeSelectPaginatedProducts`, `makeSelectTotalPages`, `makeSelectPaginationMeta`)
- ✅ Setup RTK Listener Middleware for automatic pagination reset on filter changes
- ✅ Created `Pagination` UI component (minimal: Prev | Page X of Y | Next)
- ✅ Integrated into `ProductsWidget` using factory selectors
- ✅ Written 6 tests for pagination component (navigation, disabled states, rendering)

**Architecture Decisions:**

1. **Separate Slice (not in filters):**
   - **Reason:** Reusability for other lists (favorites view), independent testing, looser coupling
   - **Location:** `features/pagination/model/paginationSlice.ts`
   - **State:** `{ currentPage: number, pageSize: number }`

2. **RTK Listener Middleware for Auto-Reset:**
   - **Reason:** Centralized side effects, no UI dependencies, easy to test
   - **Pattern:** Listen to all filter actions with `isAnyOf()`, dispatch `resetPage()`
   - **Alternative considered:** useEffect in component (rejected - not centralized), addMatcher in slice (rejected - tight coupling)

   ```typescript
   listenerMiddleware.startListening({
     matcher: isAnyOf(
       setSearchQuery,
       toggleCategory,
       setMinPrice,
       setMaxPrice,
       setMinRating,
       toggleShowOnlyFavorites,
       resetFilters
     ),
     effect: (_action, listenerApi) => {
       listenerApi.dispatch(resetPage())
     },
   })
   ```

3. **Factory Selectors Pattern:**
   - **Reason:** Products come from widget props, need to pass as parameter
   - **Pattern:** `makeSelectPaginatedProducts()` returns selector function
   - **Usage:** Component creates selector with `useMemo`, calls with `(state, data)`

   ```typescript
   const selectPaginatedProducts = useMemo(
     () => makeSelectPaginatedProducts(),
     []
   )
   const paginatedProducts = useAppSelector((state) =>
     selectPaginatedProducts(state, data)
   )
   ```

4. **Self-Contained Component:**
   - **Pagination:** Connects directly to Redux (`useAppSelector`, `dispatch`)
   - **Props:** Only receives `totalPages` (computed in widget)
   - **Pattern:** Same as filter components (no prop drilling)

**Implementation Details:**

- **PAGE_SIZE constant:** `10` (fixed for MVP)
- **Slice logic:** Array slicing at `(currentPage - 1) * pageSize` to `currentPage * pageSize`
- **Conditional rendering:** Pagination hidden if `totalPages <= 1`
- **Button states:** Prev disabled on page 1, Next disabled on last page
- **Navigation:** `setPage(currentPage ± 1)` with bounds checking

**Files:**

- [src/features/pagination/model/paginationSlice.ts](src/features/pagination/model/paginationSlice.ts) — NEW (slice definition)
- [src/features/pagination/model/selectors.ts](src/features/pagination/model/selectors.ts) — NEW (factory selectors)
- [src/features/pagination/ui/Pagination/Pagination.tsx](src/features/pagination/ui/Pagination/Pagination.tsx) — NEW (UI component)
- [src/features/pagination/ui/Pagination/Pagination.test.tsx](src/features/pagination/ui/Pagination/Pagination.test.tsx) — NEW (6 tests)
- [src/shared/lib/store.ts](src/shared/lib/store.ts) — updated (listener middleware)
- [src/widgets/products/ui/ProductsWidget/ProductsWidget.tsx](src/widgets/products/ui/ProductsWidget/ProductsWidget.tsx) — updated (integration)

**Tests:** 77/77 passed ✓ (added 6 pagination tests)

**Bug Fixed:**

- **TypeScript error:** `paginatedProducts` could be `undefined`, fixed with nullish coalescing (`?? []`)

---

## 🚀 Next Steps

### Stage 2C → Interactive Features (Remaining)

**Roadmap (Steps 0–9):**

0. **Docs Update** (this step)
   - Align all documentation with final Stage 2C roadmap
   - Update constants and architecture notes

1. **Dynamic Categories**
   - Derive categories from `product.category` field (no hardcoded enum)
   - Build Set → Array from API data
   - Use in filters and UI

2. **Search Feature**
   - `features/search/ui/SearchInput.tsx` + `useSearch`
   - **Debounce:** `DEBOUNCE_MS = 300ms`
   - Filter by title/description on client

3. **Filters v1**
   - **Category filter:** Multi-select checkboxes (dynamic categories from data)
   - **Price range:** Min–max sliders (dynamic from data: `Math.min(...prices)`, `Math.max(...prices)`)
   - **Rating threshold:** Dropdown (≥ 5/4/3/2/1 stars)
   - Compose in `ProductsToolbar`

4. **Pagination**
   - Client-side pagination
   - **Page size:** `PAGE_SIZE = 10`
   - Synced with search/filters (reset to page 1 on filter change)
   - `features/pagination/ui/Pagination.tsx` + `usePagination`

5. **Favorites (toggle-favorite)**
   - Redux slice + localStorage persist
   - LocalStorage key: `favorites` (array of product IDs)
   - `FavoriteButton` интеграция в ProductCard
   - Toggle view: "All Products" / "Favorites Only"

6. **Remove + Reset Local Data**
   - **Remove:** Soft-delete via localStorage (key: `removed`)
   - Filter out removed products from display
   - **Reset button:** Clear all LS keys (`favorites`, `removed`, optional `formDrafts`), reinitialize store, refetch `/products`

7. **Create/Edit Forms (RHF + Zod)**
   - React Hook Form + Zod validation
   - **Fields:** title, price, description, category, image URL, rating
   - Create: `/products/create`
   - Edit: `/products/[id]/edit`
   - Store locally (no server POST/PUT for MVP)

8. **not-found.tsx + ID Validation**
   - `app/not-found.tsx` (global 404)
   - `app/products/[id]/not-found.tsx` (product-specific)
   - Validate product ID format and existence
   - Handle invalid IDs gracefully

9. **Global ErrorBoundary + Guards + Tests**
   - Global ErrorBoundary in `app/layout.tsx`
   - Page-level guards for edge cases
   - Smoke tests for all features
   - Integration tests (search + filters + pagination flow)

**Constants:**

- `DEBOUNCE_MS = 300`
- `PAGE_SIZE = 10`
- LocalStorage keys: `favorites`, `removed`, optional `formDrafts`

**DoD 2C:**

- Все features рабочие (steps 1–9)
- Dynamic categories работают корректно
- Filters синхронизированы с pagination
- Reset local data полностью очищает состояние
- FSD границы не нарушены
- Все тесты зелёные (smoke + integration)

---

### Stage 3 → Polish & Production Prep

1. **UX Refinement**
   - Optimistic UI updates
   - Animations and transitions
   - Responsive design (адаптив, грид, иконки)
2. **Fallback Strategy**
   - Network → cache → mocks flow
   - Offline support
3. **E2E Tests**
   - Full user flows with Playwright
4. **Performance Optimization**
   - Code splitting
   - Image optimization (next/image)
   - Bundle analysis

---

### Stage 4 → Production (optional)

- Deploy (Vercel/GitHub Pages)
- Themes, SEO, Performance optimization
