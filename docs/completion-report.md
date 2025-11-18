# Отчёт о проделанной работе (Stage 1-2C)

**Проект:** Product Showcase (FakeStore API)
**Дата:** Ноябрь 2025
**Архитектура:** Feature-Sliced Design (FSD)
**Стек:** Next.js 16, React 19, Redux Toolkit, TypeScript

---

## Stage 0: Инициализация проекта ✅

- Next.js 16 + React 19
- TypeScript strict mode
- Redux Toolkit + RTK Query
- Тестирование: Vitest + Playwright
- Pre-commit hooks: Husky + lint-staged
- FSD структура каталогов
- Tailwind CSS v4

---

## Stage 1: Foundation & Entity Layer ✅

### Entities

**product (entities/product/)**

- Типы Product, Rating (model/types.ts)
- Маппер fromProductDto (model/mappers.ts)
- RTK Query API: getProducts, getProductById (api/productsApi.ts)
- Хуки: useDynamicCategories, useDynamicPriceRange (lib/)

### Shared Infrastructure

**API (shared/api/)**

- Base API конфигурация с RTK Query
- Tag types: Product, Category, User

**Storage (shared/lib/persist/)**

- getFromLS, setToLS, removeFromLS
- safeLoadFromStorage с валидацией
- persistRegistry - реестр персистируемых слайсов
- persistMiddleware - автоматическое сохранение с debounce 300ms
- createPreloadedState - гидрация при старте
- flushPersist - сохранение при beforeunload

**Store (shared/lib/store/)**

- Настройка Redux store
- Типизированные хуки: useAppDispatch, useAppSelector, useAppStore
- Listener middleware для side effects
- Cleanup middleware для автоудаления из избранного

---

## Stage 2A+2B: UI Components & Pages ✅

### Shared UI (shared/ui/)

- Skeleton - базовый компонент загрузки
- ErrorMessage - отображение ошибок с Retry
- EmptyState - пустые состояния
- Button - универсальная кнопка (4 варианта)
- Modal - модальное окно
- ResetLocalDataButton - кнопка сброса локальных данных

### Entity UI (entities/product/ui/)

- ProductCard - карточка для списка
- ProductCardSkeleton
- ProductDetailCard - детальная карточка
- ProductDetailCardSkeleton

### Widgets

**products (widgets/products/)**

- ProductsWidget - smart widget с data-fetching
- ProductsGrid - отображение списка карточек
- ProductsGridSkeleton
- ProductsToolbar - композиция фильтров
- Хуки: useProductsView (агрегатор всей логики)

**product-detail (widgets/product-detail/)**

- ProductDetailWidget - smart widget для детали
- Хуки: useProductView (агрегатор для одного продукта)

**product-form-dialog (widgets/product-form-dialog/)**

- ProductFormDialogWidget - диалог создания/редактирования

### App Routes (app/)

- / - главная страница
- /products - список продуктов
- /products/[id] - детальная страница
- StoreProvider - провайдер Redux
- layout.tsx - корневой layout

---

## Stage 2C: Interactive Features ✅

### favorites (features/favorites/)

**UI:**

- FavoriteToggle - кнопка избранного (иконка сердца)
- ShowOnlyFavoritesToggle - переключатель отображения

**State:**

- favoritesSlice: { favoriteIds: number[] }
- Actions: toggleFavorite, addFavorite, removeFavorite, resetFavorites
- Selectors: makeSelectIsFavorite, selectFavoriteIds
- Persist: localStorage (app:favorites:v1)
- Auto-cleanup при удалении продукта

### local-products (features/local-products/)

**State:**

- localProductsSlice: { localProductsById, removedApiIds, nextLocalId }
- Actions: upsertLocalProduct, removeProduct, resetLocalProducts
- Selectors: makeSelectLocalProduct, selectRemovedIds
- Persist: localStorage (app:localProducts:v1)
- Хуки: useMergedProducts, useMergedProduct

**UI:**

- RemoveButton - кнопка удаления (soft-delete)

**Lib:**

- mergeLocalProducts - применение локальных изменений к API данным

### filters (features/filters/)

**UI:**

- QueryFilter - поиск с debounce 300ms
- CategoryFilter - мультивыбор категорий
- PriceRangeFilter - фильтр по цене
- RatingFilter - фильтр по рейтингу (4+, 3+, 2+)
- ResetFiltersButton - сброс фильтров

**State:**

- filtersSlice: searchQuery, categories, minPrice, maxPrice, minRating, showOnlyFavorites
- Actions: setSearchQuery, toggleCategory, setMinPrice, setMaxPrice, setMinRating, toggleShowOnlyFavorites, resetFilters
- Selectors: simple selectors + selectHasActiveFilters + makeSelectFilteredProducts

**Lib:**

- filterBySearch, filterByCategories, filterByPrice, filterByRating, filterByFavorites, filterByRemoved

**Hooks:**

- useFilteredProducts - применение всех фильтров

### pagination (features/pagination/)

**UI:**

- Pagination - UI компонент (Prev | Page X of Y | Next)

**State:**

- paginationSlice: currentPage, pageSize, maxPage
- Actions: setPage, setMaxPage, setPageSize, resetPage
- Selectors: makeSelectTotalPages, makeSelectPaginatedProducts, makeSelectPaginationMeta
- Auto-reset: listener middleware сбрасывает на страницу 1 при изменении фильтров

### product-form (features/product-form/)

**UI:**

- ProductForm - форма create/edit с React Hook Form + Zod
- Field components: TitleField, DescriptionField, PriceField, CategoryField, ImageField, RatingField, CountField

**Model:**

- UpsertLocalProductPayload - тип для создания/редактирования

---

## Архитектурные достижения

### FSD Compliance

- Строгое соблюдение иерархии слоёв
- Public API через index.ts
- Именные экспорты
- Нет cross-layer импортов

### Smart Widgets Pattern

- Виджеты вызывают RTK Query hooks
- Страницы только композиция виджетов
- Нет prop drilling

### Selector-Based Architecture

- Все фильтры/пагинация через селекторы
- Мемоизация с Reselect
- Factory selectors для параметризованных данных

### Centralized Persistence

- Единый persist middleware
- Registry pattern
- SSR-безопасность
- Debounce сохранений (300ms)

### State Management

- Redux Toolkit для всего state
- RTK Query для API
- Listener middleware для side effects
- Typed hooks

### Testing

- Компонентные тесты (Vitest + React Testing Library)
- Unit тесты для утилит/селекторов
- Colocated tests

---

## Метрики

**Структура:**

- 3 entities (product)
- 5 features (favorites, local-products, filters, pagination, product-form)
- 3 widgets (products, product-detail, product-form-dialog)
- 3 app routes (/, /products, /products/[id])
- 10+ shared UI компонентов

**Тесты:**

- 116+ тестов passing
- Покрытие: компоненты, хуки, селекторы, утилиты

**Качество:**

- ESLint + Prettier
- TypeScript strict mode
- Pre-commit hooks
- FSD boundaries validation

---

## Ключевые паттерны

1. **View Hooks Aggregator** - useProductsView/useProductView объединяют логику
2. **Factory Selectors** - makeSelect\* для параметризованных селекторов
3. **Listener Middleware** - централизованные side effects
4. **Persist Registry** - декларативная регистрация персистируемых слайсов
5. **Self-Contained Components** - компоненты подключаются к Redux напрямую
6. **Atomic Actions** - setMinPrice/setMaxPrice вместо setPriceRange
7. **Filter Cascade** - последовательное применение фильтров
8. **Soft Delete** - removedApiIds вместо физического удаления
9. **Local Overrides** - localProductsById для патчей API данных
