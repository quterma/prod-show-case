# Features Overview

Обзор всех фич (features) в приложении согласно Feature-Sliced Design.

## Реализованные Features

### favorites (Избранное)

**Расположение:** `src/features/favorites/`

**Описание:** Функциональность добавления/удаления продуктов в избранное с персистентностью в localStorage.

**Компоненты:**

- `FavoriteToggle` - Кнопка-переключатель для добавления/удаления из избранного (иконка сердца)

**State Management:**

- Redux slice `favoritesSlice` хранит `{ favoriteIds: number[] }`
- Автоматическая персистентность через persist middleware (ключ: `app:favorites:v1`)
- При удалении продукта автоматически удаляется из избранного (через `extraReducers`)
- Селекторы: `makeSelectIsFavorite`, `selectFavoriteIds`

**Действия:**

- `toggleFavorite(productId)` - переключение статуса избранного
- `addFavorite(productId)` - добавление в избранное
- `removeFavorite(productId)` - удаление из избранного
- `resetFavorites()` - очистка всех избранных

---

### local-products (Локальные продукты и удаление)

**Расположение:** `src/features/local-products/`

**Описание:** Унифицированное управление локально созданными продуктами, изменениями API-продуктов и soft-delete функциональностью.

**Компоненты:**

- Feature не имеет собственных UI компонентов (используется другими features)

**State Management:**

- Redux slice `localProductsSlice` с полной структурой:
  ```ts
  {
    localProductsById: Record<number, LocalProductEntry>  // Локальные продукты и overrides
    removedApiIds: number[]                                // ID удаленных API-продуктов
    nextLocalId: number                                    // Счетчик для новых ID (начиная с -1)
  }
  ```
- Автоматическая персистентность через persist middleware (ключ: `app:localProducts:v1`)
- Гидрация при старте приложения восстанавливает все локальные изменения

**Действия:**

- `upsertLocalProduct({ id?, data, source })` - создание/обновление локального продукта
- `removeProduct(productId)` - мягкое удаление (toggle для API-продуктов, жесткое для локальных)
- `resetLocalProducts()` - полная очистка локальных данных

**Интеграция:**

- Удаленные продукты фильтруются ПЕРВЫМИ в каскаде фильтров (`filterByRemoved`)
- При удалении продукта автоматически удаляется из избранного (через inter-slice communication)

---

### filters (Фильтрация)

**Расположение:** `src/features/filters/`

**Описание:** Комплексная система фильтрации продуктов по различным параметрам.

**Компоненты:**

- `QueryFilter` - Поиск по названию/описанию с debounce
- `CategoryFilter` - Мультивыбор категорий
- `PriceRangeFilter` - Фильтр по диапазону цен
- `RatingFilter` - Фильтр по минимальному рейтингу
- `ShowOnlyFavoritesToggle` - Показывать только избранное
- `ResetFiltersButton` - Сброс всех фильтров

**State Management:**

- Redux slice `filtersSlice` с полями:
  - `searchQuery: string`
  - `categories: string[]`
  - `minPrice: number | null`
  - `maxPrice: number | null`
  - `minRating: number | null`
  - `showOnlyFavorites: boolean`

**Фильтрация:**
Каскад фильтров применяется в следующем порядке (приоритет сверху вниз):

1. `filterByRemoved` - ПЕРВЫЙ, скрывает удаленные продукты
2. `filterBySearch` - поиск по названию/описанию
3. `filterByCategories` - фильтр по категориям
4. `filterByRating` - фильтр по рейтингу
5. `filterByFavorites` - показывать только избранное
6. `filterByPrice` - фильтр по диапазону цен

**Хуки:**

- `useFilteredProducts(products)` - возвращает отфильтрованный список

---

### pagination (Пагинация)

**Расположение:** `src/features/pagination/`

**Описание:** Фронтенд-пагинация с автоматическим сбросом при изменении фильтров.

**Компоненты:**

- `Pagination` - UI компонент с кнопками навигации

**State Management:**

- Redux slice `paginationSlice`:
  - `currentPage: number` - текущая страница (начиная с 1)
  - `pageSize: number` - размер страницы (константа `PAGE_SIZE = 10`)
  - `maxPage: number | null` - максимальная страница

**Действия:**

- `setPage(page)` - установка страницы с валидацией границ
- `setMaxPage(maxPage)` - установка максимальной страницы
- `setPageSize(size)` - изменение размера страницы (сбрасывает на 1)
- `resetPage()` - сброс на страницу 1

**Автоматизация:**

- Listener middleware автоматически сбрасывает пагинацию на страницу 1 при изменении любого фильтра
- Отслеживаемые действия: `setSearchQuery`, `toggleCategory`, `setMinPrice`, `setMaxPrice`, `setMinRating`, `toggleShowOnlyFavorites`, `resetFilters`

**Селекторы:**

- `makeSelectTotalPages(filteredProducts)` - рассчитывает количество страниц
- `makeSelectPaginatedProducts(filteredProducts)` - возвращает продукты текущей страницы
- `makeSelectPaginationMeta(filteredProducts)` - метаданные пагинации

---

### reset-local-data (Сброс локальных данных)

**Расположение:** `src/features/reset-local-data/`

**Описание:** Полный сброс локального состояния приложения - очистка избранного, удаленных продуктов, активных фильтров и кеша.

**Компоненты:**

- `ResetLocalDataButton` - Кнопка "Reset local data"

**Действия:**
Thunk `resetLocalData()` последовательно:

1. `resetFavorites()` - очищает избранное из Redux (persist middleware автоматически обновит localStorage)
2. `resetLocalProducts()` - очищает локальные продукты из Redux (persist middleware автоматически обновит localStorage)
3. `resetFilters()` - сбрасывает все активные фильтры к начальным значениям
4. Инвалидирует RTK Query кеш для продуктов (триггерит refetch)

**UX обоснование:**
Сброс фильтров вместе с локальными данными обеспечивает "чистый лист" - после очистки избранного/удаленных логично видеть полный список продуктов без активных фильтров (например, "показывать только избранное" становится бессмысленным после очистки избранного)

---

## Архитектурные паттерны

### Export Pattern

Все публичные API (`index.ts`) используют именные экспорты для:

- Явной документации API
- Лучшего tree-shaking
- Предотвращения случайных утечек внутренних модулей

### Memoized Selectors

Все селекторы используют фабрики (`makeSelect*`) для создания мемоизированных экземпляров через `createSelector`.

### State Persistence System

**Централизованная архитектура** через `shared/lib/persist`:

**Компоненты системы:**

- `persistRegistry` - реестр всех персистируемых слайсов
- `persistMiddleware` - автоматическое сохранение изменений с debounce (300ms)
- `createPreloadedState()` - автоматическая гидрация при создании store
- `flushPersist()` - принудительное сохранение при beforeunload

**Персистируемые слайсы:**

- `favorites` → `app:favorites:v1` - избранные продукты
- `localProducts` → `app:localProducts:v1` - локальные продукты, изменения, удаления

**НЕ персистируются:**

- `filters` - UI state, должен сбрасываться при новом визите
- `pagination` - UI state, всегда начинается с первой страницы

**SSR-безопасность:**

- Все операции проверяют `typeof window !== "undefined"`
- `createPreloadedState()` вызывается внутри `makeStore()` для каждого запроса
- На сервере возвращаются fallback значения (пустые массивы/объекты)

**Утилиты:**

- `getFromLS(key)` - чтение с JSON.parse
- `setToLS(key, value)` - запись с JSON.stringify + size warning
- `safeLoadFromStorage(key, fallback)` - загрузка с валидацией типов

### Client Components

Все компоненты, использующие Redux hooks, помечены директивой `"use client"` для Next.js App Router.
