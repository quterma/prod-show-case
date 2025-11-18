# Текущая архитектура приложения

**Дата:** Ноябрь 2025
**Методология:** Feature-Sliced Design (FSD) v2
**Статус:** Stage 2C Complete

---

## Обзор

Приложение построено по методологии Feature-Sliced Design с вертикальным разделением на слои и горизонтальным разделением на слайсы (фичи/сущности).

### Иерархия слоёв (сверху вниз)

```
app/       → Routing, providers, глобальная конфигурация
widgets/   → Самодостаточные UI-блоки, композиция features + entities
features/  → Бизнес-логика, user interactions
entities/  → Бизнес-сущности, domain models
shared/    → Переиспользуемая инфраструктура
```

### Правила импортов

- Верхние слои могут импортировать из нижних
- Нижние слои НЕ МОГУТ импортировать из верхних
- Слои одного уровня НЕ МОГУТ импортировать друг из друга
- shared/ полностью изолирован, не импортирует ничего

---

## Слои и их ответственности

### app/ - Application Layer

**Назначение:** точка входа, роутинг, глобальные провайдеры

**Структура:**

- layout.tsx - корневой layout с StoreProvider
- page.tsx - главная страница (/)
- products/page.tsx - список продуктов
- products/[id]/page.tsx - детальная страница
- StoreProvider.tsx - Redux provider компонент

**Ответственности:**

- Next.js App Router маршруты
- Redux store initialization
- Композиция виджетов
- Обработка навигации

**Паттерн:** страницы содержат только композицию виджетов и коллбэки навигации, не работают напрямую с данными

---

### widgets/ - Widgets Layer

**Назначение:** полноценные UI-блоки, композиция features и entities

#### products (widgets/products/)

**Структура:**

- ui/ProductsWidget - главный виджет списка
- ui/ProductsGrid - грид карточек
- ui/ProductsGridSkeleton - skeleton состояние
- ui/ProductsToolbar - панель фильтров
- hooks/useProductsView - агрегатор всей логики списка

**Ответственности:**

- Data-fetching (RTK Query)
- Композиция всех фильтров
- Обработка loading/error/empty states
- Вызов view-хуков агрегаторов

**Поток данных (useProductsView):**

1. API данные (useGetProductsQuery)
2. Применение локальных изменений (useMergedProducts)
3. Фильтрация (useFilteredProducts)
4. Пагинация (usePagination)

#### product-detail (widgets/product-detail/)

**Структура:**

- ui/ProductDetailWidget - виджет детальной страницы
- hooks/useProductView - агрегатор логики для одного продукта

**Ответственности:**

- Получение одного продукта (API/cache/local)
- Применение локальных патчей
- Обработка removed состояния
- Обработка loading/error/notFound

**Логика useProductView:**

1. Проверка локальных продуктов
2. Проверка удалённых
3. Получение из API/кеша
4. Применение локального патча

#### product-form-dialog (widgets/product-form-dialog/)

**Структура:**

- ui/ProductFormDialogWidget - модальная форма create/edit

**Ответственности:**

- Управление открытием/закрытием диалога
- Композиция ProductForm
- Передача контекста (create/edit)

---

### features/ - Features Layer

**Назначение:** бизнес-фичи, пользовательские взаимодействия

#### favorites

**Функциональность:** добавление в избранное, отображение только избранного

**Структура:**

- model/favoritesSlice - Redux slice
- model/selectors - мемоизированные селекторы
- ui/FavoriteToggle - кнопка переключения
- ui/ShowOnlyFavoritesToggle - фильтр "только избранное"

**State:** `{ favoriteIds: number[] }`

**Persist:** localStorage (app:favorites:v1)

**Особенности:**

- Автоудаление из избранного при удалении продукта
- Factory selector makeSelectIsFavorite

#### local-products

**Функциональность:** создание локальных продуктов, изменение API-продуктов, soft-delete

**Структура:**

- model/localProductsSlice - Redux slice
- model/selectors - селекторы
- ui/RemoveButton - кнопка удаления
- lib/mergeLocalProducts - утилита слияния
- hooks/useMergedProducts - хук для списка
- hooks/useMergedProduct - хук для одного

**State:**

```typescript
{
  localProductsById: Record<number, LocalProductEntry>
  removedApiIds: number[]
  nextLocalId: number  // -1, -2, -3...
}
```

**Persist:** localStorage (app:localProducts:v1)

**Особенности:**

- Локальные ID: отрицательные (-1, -2...)
- Soft-delete для API-продуктов (добавление в removedApiIds)
- Hard-delete для локальных продуктов (удаление из localProductsById)
- Патчи API-продуктов (partial updates)

#### filters

**Функциональность:** поиск, фильтрация по категориям/цене/рейтингу/избранному

**Структура:**

- model/filtersSlice - Redux slice
- model/selectors - мемоизированные селекторы
- hooks/useFilteredProducts - хук применения фильтров
- lib/filterProducts - чистые функции фильтрации
- ui/QueryFilter - поиск с debounce
- ui/CategoryFilter - мультивыбор категорий
- ui/PriceRangeFilter - диапазон цен
- ui/RatingFilter - минимальный рейтинг
- ui/ResetFiltersButton - сброс всех фильтров

**State:**

```typescript
{
  searchQuery: string
  categories: string[]
  minPrice: number | null
  maxPrice: number | null
  minRating: number | null
  showOnlyFavorites: boolean
}
```

**Каскад фильтров (порядок применения):**

1. filterByRemoved - удалённые продукты
2. filterBySearch - поиск по тексту
3. filterByCategories - категории
4. filterByRating - рейтинг
5. filterByFavorites - только избранное
6. filterByPrice - диапазон цен

**Особенности:**

- Debounce 300ms в QueryFilter
- Атомарные actions (setMinPrice/setMaxPrice отдельно)
- Self-contained компоненты (подключаются к Redux напрямую)

#### pagination

**Функциональность:** фронтенд-пагинация с автосбросом

**Структура:**

- model/paginationSlice - Redux slice
- model/selectors - factory selectors
- ui/Pagination - UI компонент

**State:**

```typescript
{
  currentPage: number
  pageSize: number // константа 10
  maxPage: number | null
}
```

**Особенности:**

- PAGE_SIZE = 10
- Listener middleware автоматически сбрасывает на страницу 1 при изменении фильтров
- Factory selectors для работы с данными из props

#### product-form

**Функциональность:** форма создания/редактирования продукта

**Структура:**

- ui/ProductForm - главная форма
- ui/fields/\* - переиспользуемые поля
- model/types - UpsertLocalProductPayload

**Технологии:**

- React Hook Form
- Zod validation
- Композиция field компонентов

---

### entities/ - Entities Layer

**Назначение:** бизнес-сущности, domain models

#### product

**Структура:**

- model/types - Product, Rating, ProductDto
- model/mappers - fromProductDto
- api/productsApi - RTK Query endpoints
- lib/useDynamicCategories - извлечение категорий из данных
- lib/useDynamicPriceRange - извлечение диапазона цен
- ui/ProductCard - карточка для списка
- ui/ProductCardSkeleton
- ui/ProductDetailCard - детальная карточка
- ui/ProductDetailCardSkeleton

**API Endpoints:**

- getProducts - список всех продуктов
- getProductById - один продукт по ID

**Особенности:**

- Маппинг DTO → Domain в mappers
- UI компоненты только отображают данные, без логики features
- Хуки для динамических данных (категории, цены)

---

### shared/ - Shared Layer

**Назначение:** переиспользуемая инфраструктура без бизнес-логики

#### shared/api/

**Структура:**

- baseApi.ts - RTK Query базовая конфигурация

**Конфигурация:**

- Base URL: https://fakestoreapi.com
- Tag types: Product, Category, User
- Все entity APIs инжектятся через injectEndpoints

#### shared/lib/persist/

**Структура:**

- ls.ts - getFromLS, setToLS
- safeLoadFromStorage.ts - загрузка с валидацией
- persistRegistry.ts - реестр персистируемых слайсов
- persistMiddleware.ts - автосохранение
- createPreloadedState.ts - гидрация при старте

**Принципы:**

- Централизованная система персистентности
- Debounce сохранений (300ms)
- SSR-безопасность
- Валидация при загрузке
- Автоочистка при beforeunload

**Персистируемые слайсы:**

- favorites → app:favorites:v1
- localProducts → app:localProducts:v1

**НЕ персистируются:**

- filters (UI state)
- pagination (UI state)

#### shared/lib/store/

**Структура:**

- store.ts - конфигурация Redux store
- hooks.ts - типизированные хуки
- cleanupFavoriteMiddleware.ts - автоудаление из избранного
- resetLocalDataThunk.ts - полный сброс локальных данных

**Middleware:**

- RTK Query middleware
- Listener middleware (side effects)
- Persist middleware (autosave)
- Cleanup middleware (inter-slice communication)

#### shared/lib/debounce/

**Структура:**

- useDebounce.ts - хук debounce

**Использование:** QueryFilter для поиска (300ms)

#### shared/ui/

**Компоненты:**

- Skeleton - базовый skeleton
- ErrorMessage - отображение ошибок с Retry
- EmptyState - пустые состояния
- Button - универсальная кнопка (primary, secondary, outline, ghost)
- Modal - модальное окно
- ResetLocalDataButton - сброс локальных данных

**Принцип:** только UI-примитивы, без бизнес-логики

---

## Ключевые архитектурные паттерны

### Smart Widgets Pattern

**Суть:** виджеты вызывают RTK Query hooks и управляют данными, страницы только композиция

**Преимущества:**

- Нет prop drilling
- Переиспользуемость виджетов
- Изоляция логики

**Пример:**

```typescript
// widgets/products/ui/ProductsWidget.tsx
const { data: apiProducts, isLoading, error } = useGetProductsQuery()
const products = useMergedProducts(apiProducts)
const filtered = useFilteredProducts(products)
const { paginatedProducts } = usePagination(filtered)
```

### View Hooks Aggregator

**Суть:** один хук объединяет всю логику обработки данных

**useProductsView - для списка:**

1. API данные
2. Локальные изменения
3. Фильтрация
4. Пагинация

**useProductView - для одного продукта:**

1. Проверка локальных
2. Проверка удалённых
3. API/кеш
4. Применение патча

**Преимущества:**

- Виджеты не знают про детали
- Тестируемость этапов
- Единая точка истины
- Расширяемость

### Factory Selectors Pattern

**Суть:** селекторы создаются через фабрики для параметризованных данных

**Примеры:**

- makeSelectIsFavorite(productId)
- makeSelectFilteredProducts()
- makeSelectPaginatedProducts()

**Причина:** данные приходят из props/параметров, а не из state

### Centralized Persistence

**Компоненты:**

- persistRegistry - декларативная регистрация
- persistMiddleware - автоматическое сохранение
- createPreloadedState - гидрация при старте

**Преимущества:**

- Единая конфигурация
- SSR-безопасность
- Debounce сохранений
- Валидация при загрузке

### Self-Contained Components

**Суть:** компоненты подключаются к Redux напрямую, без props

**Пример:**

```typescript
// CategoryFilter.tsx
const categories = useAppSelector(selectCategories)
const dispatch = useAppDispatch()
const handleToggle = (cat) => dispatch(toggleCategory(cat))
```

**Преимущества:**

- Нет prop drilling
- Легко добавлять новые компоненты
- Redux DevTools из коробки

### Listener Middleware for Side Effects

**Примеры:**

- Автосброс пагинации при изменении фильтров
- Можно добавить: логирование, аналитику, синхронизацию

**Преимущества:**

- Централизованные side effects
- Нет UI зависимостей
- Тестируемость

---

## Data Flow

### Создание продукта

1. ProductFormDialogWidget (create mode)
2. ProductForm submit
3. dispatch(upsertLocalProduct({ data, source: 'local' }))
4. localProductsSlice генерит ID (-1, -2...)
5. persistMiddleware → localStorage
6. useProductsView автоматически подхватывает через useMergedProducts

### Редактирование продукта

1. ProductDetailWidget → useProductView(id)
2. ProductFormDialogWidget (edit mode) с prefill
3. ProductForm submit
4. dispatch(upsertLocalProduct({ id, data, source: 'edited' }))
5. localProductsSlice патчит localProductsById[id]
6. persistMiddleware → localStorage
7. useProductView автоматически применяет патч

### Удаление продукта

**API-продукт:**

1. RemoveButton click
2. dispatch(removeProduct(id))
3. localProductsSlice добавляет в removedApiIds
4. cleanupMiddleware → removeFavorite(id)
5. persistMiddleware → localStorage
6. useProductsView фильтрует через filterByRemoved

**Локальный продукт:**

1. RemoveButton click
2. dispatch(removeProduct(id))
3. localProductsSlice удаляет из localProductsById
4. persistMiddleware → localStorage
5. useProductsView перестаёт видеть продукт

### Фильтрация

1. QueryFilter onChange → dispatch(setSearchQuery)
2. CategoryFilter toggle → dispatch(toggleCategory)
3. PriceRangeFilter change → dispatch(setMinPrice/setMaxPrice)
4. Listener middleware → dispatch(resetPage)
5. useFilteredProducts читает селекторы и применяет каскад
6. usePagination читает новые данные и пагинирует

---

## Технические детали

### Константы

```typescript
DEBOUNCE_MS = 300 // поиск, persist
PAGE_SIZE = 10 // пагинация
```

### localStorage Keys

```typescript
"app:favorites:v1" // favoriteIds: number[]
"app:localProducts:v1" // весь localProductsSlice state
```

### RTK Query Cache

- getProducts - кешируется глобально
- getProductById - кешируется по ID
- Автоматическая нормализация и deduplication

### TypeScript

- Strict mode
- Typed Redux hooks
- Zod для runtime validation
- Маппинг DTO → Domain

---

## Тестирование

### Unit Tests

- Утилиты (filterProducts, mergeLocalProducts)
- Селекторы (filters, pagination)
- Хуки (useDynamicCategories, useDynamicPriceRange)

### Component Tests

- UI компоненты (Vitest + RTL)
- Изоляция через mocks
- Colocated tests

### Integration Tests

- Фичи с Redux Provider
- Хуки с полным store

### E2E (будущее)

- Playwright
- Основные user flows

---

## Расширяемость

### Добавление новой фичи

1. Создать features/feature-name/
2. Слайс в model/ (опционально)
3. UI в ui/
4. Публичный API в index.ts
5. Интеграция в виджет

### Добавление нового фильтра

1. Добавить поле в filtersSlice
2. Добавить action
3. Создать функцию filter в lib/filterProducts.ts
4. Добавить в каскад useFilteredProducts
5. Создать UI компонент
6. Добавить в ProductsToolbar

### Добавление новой сущности

1. Создать entities/entity-name/
2. Типы в model/
3. API в api/ (injectEndpoints)
4. UI компоненты в ui/
5. Публичный API в index.ts

---

## Границы и ограничения

### Что НЕ делаем (MVP scope)

- Серверную пагинацию/сортировки
- Глобальный UI-кит (только по необходимости)
- Оптимистичные мутации к API
- Сложные анимации
- Мультиязычность
- Роли/авторизация

### FSD Violations Prevention

- ESLint boundaries plugin
- Pre-commit hooks
- CI проверки
- Code review checklist

---

**Документ актуален на:** Ноябрь 2025 (Stage 2C)
**Следующие этапы:** Stage 2D (not-found, ErrorBoundary), Stage 3 (Polish), Stage 4 (Production)
