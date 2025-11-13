# Features Overview

Обзор всех фич (features) в приложении согласно Feature-Sliced Design.

## Реализованные Features

### favorites (Избранное)

**Расположение:** `src/features/favorites/`

**Описание:** Функциональность добавления/удаления продуктов в избранное с персистентностью в localStorage.

**Компоненты:**

- `FavoriteToggle` - Кнопка-переключатель для добавления/удаления из избранного (иконка сердца)

**State Management:**

- Redux slice `favoritesSlice` хранит массив ID избранных продуктов
- Персистентность через localStorage (ключ: `prod-showcase:favorites`)
- Селекторы: `makeSelectIsFavorite`, `selectFavoriteIds`

**Действия:**

- `toggleFavorite(productId)` - переключение статуса избранного
- `addFavorite(productId)` - добавление в избранное
- `removeFavorite(productId)` - удаление из избранного
- `resetFavorites()` - очистка всех избранных

---

### remove-product (Удаление продуктов)

**Расположение:** `src/features/remove-product/`

**Описание:** Soft-delete функциональность для скрытия продуктов с подтверждением через browser confirm.

**Компоненты:**

- `RemoveButton` - Кнопка удаления с иконкой корзины и подтверждением

**State Management:**

- Redux slice `removedSlice` хранит массив ID удаленных продуктов
- Персистентность через localStorage (ключ: `prod-showcase:removed`)
- Селекторы: `makeSelectIsRemoved`, `makeSelectVisibleProducts`

**Действия:**

- `toggleRemoved(productId)` - переключение статуса удаления
- `addRemoved(productId)` - пометить как удаленный
- `removeRemoved(productId)` - восстановить продукт
- `resetRemoved()` - очистка всех удаленных

**Интеграция:**

- Удаленные продукты фильтруются ПЕРВЫМИ в каскаде фильтров (`filterByRemoved`)
- RemoveButton размещен рядом с FavoriteToggle в обеих карточках продукта

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

1. `resetFavorites()` - очищает избранное из Redux + localStorage
2. `resetRemoved()` - очищает удаленные продукты из Redux + localStorage
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

### localStorage Persistence

Персистентность через SSR-safe утилиты из `shared/lib/persist`:

- `getFromLS(key)` - чтение с проверкой typeof window
- `setToLS(key, value)` - запись с автоматической сериализацией
- `removeFromLS(key)` - удаление

### Client Components

Все компоненты, использующие Redux hooks, помечены директивой `"use client"` для Next.js App Router.
