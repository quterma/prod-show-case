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
