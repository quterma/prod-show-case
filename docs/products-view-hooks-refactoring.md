# Products View Hooks Refactoring

## Цель

Рефакторинг data-fetching и view-логики для виджетов продуктов. Разделение на логические этапы обработки данных с помощью композиции хуков и утилит.

## Архитектура

### Основные принципы

1. **Виджеты не знают про детали** - они вызывают один агрегирующий хук и рендерят результат
2. **Хуки по этапам** - каждый этап обработки данных = отдельный хук/утилита
3. **Композиция** - агрегатор (`useProductsView`, `useProductView`) последовательно вызывает хуки этапов
4. **Единая ответственность** - форма/удаление/создание просто пишут в Redux, view-хуки сами учитывают изменения

---

## 1. Список продуктов: `useProductsView()`

### Этапы обработки

#### Этап 1: Получение данных из API

```typescript
const { data: apiProducts = [], isLoading, error } = useGetProductsQuery()
```

**Вход:** нет
**Выход:** `apiProducts`, `isLoading`, `error`

---

#### Этап 2: Применение локальных изменений

```typescript
const productsWithLocal = applyLocalChanges(
  apiProducts,
  localProducts,
  removedIds
)
```

**Утилита:** `applyLocalChanges(apiProducts, localProductsById, removedIds)`

**Логика:**

1. Фильтрует `apiProducts` - убирает ID из `removedIds`
2. Накладывает патчи из `localProductsById` (перезаписывает поля поверх API-данных)
3. Добавляет в начало/конец новые товары из `localProductsById` с `source: "local"`

**Вход:**

- `apiProducts: Product[]` - данные с API
- `localProductsById: Record<string, Partial<Product>>` - из Redux
- `removedIds: Set<string>` - из Redux

**Выход:** `Product[]` - массив с учетом локальных изменений

---

#### Этап 3: Фильтрация

```typescript
const filteredProducts = useFilteredProducts(productsWithLocal)
```

**Хук:** `useFilteredProducts(products)` (переносим из `features/filters`)

**Логика:**

- Читает фильтры из Redux (`filters` slice)
- Применяет поиск (debounce ~300ms)
- Применяет фильтры по категории, цене и т.д.

**Вход:** `Product[]` - после локальных изменений
**Выход:** `Product[]` - отфильтрованные товары

---

#### Этап 4: Пагинация

```typescript
const { paginatedProducts, totalCount } = usePagination(filteredProducts)
```

**Хук:** `usePagination(products)`

**Логика:**

- Читает/пишет состояние пагинации в Redux (`pagination` slice)
- Вычисляет `totalPages` на основе `products.length`
- Возвращает slice массива для текущей страницы

**Вход:** `Product[]` - после фильтров
**Выход:**

```typescript
{
  paginatedProducts: Product[],  // slice для текущей страницы
  totalCount: number,             // products.length (до пагинации)
}
```

---

### Возвращаемый интерфейс `useProductsView()`

```typescript
interface UseProductsViewResult {
  products: Product[] // финальный массив (пагинированный)
  totalCount: number // до пагинации, после фильтров

  // Пустые состояния (для разных сообщений)
  apiEmpty: boolean // apiProducts.length === 0
  localEmpty: boolean // после applyLocalChanges пусто (все удалены)
  filteredEmpty: boolean // после фильтров пусто

  isLoading: boolean
  error: SerializedError | FetchBaseQueryError | undefined
}
```

**Три сообщения для пустых состояний:**

1. `apiEmpty` → "Нет товаров с сервера" (ошибка API или пустая база)
2. `localEmpty` → "Все товары удалены локально" (были с API, но все в `removedIds`)
3. `filteredEmpty` → "Ничего не найдено по фильтрам" (после поиска/фильтрации пусто)

---

## 2. Один продукт: `useProductView(id)`

### Логика обработки (последовательность проверок)

#### Шаг 1: Проверка локальных товаров

```typescript
const localProduct = localProductsById[id]
if (id.startsWith('local-') && localProduct) {
  // Локальный товар (созданный на клиенте)
  return { product: localProduct, isLocal: true, ... }
}
```

---

#### Шаг 2: Проверка удалённых

```typescript
if (removedIds.has(id)) {
  // Товар помечен как удалённый
  return { notFound: true, ... }
}
```

---

#### Шаг 3: Получение из API/кеша

```typescript
// Попытка 1: Достать из кеша списка (если useGetProductsQuery уже вызывался)
const cachedProduct = selectProductFromListCache(id)

// Попытка 2: Fallback на отдельный запрос
const {
  data: apiProduct,
  isLoading,
  error,
} = useGetProductByIdQuery(id, {
  skip: !!cachedProduct,
})

const product = cachedProduct || apiProduct
```

---

#### Шаг 4: Применение локального патча

```typescript
if (product && localProductsById[id]) {
  // Есть патч для этого товара - накладываем поверх
  product = { ...product, ...localProductsById[id] }
}
```

---

### Возвращаемый интерфейс `useProductView(id)`

```typescript
interface UseProductViewResult {
  product: Product | null
  isLocal: boolean // созданный локально (id = local-...)
  notFound: boolean // 404 или удалён
  isLoading: boolean
  error: SerializedError | FetchBaseQueryError | undefined
}
```

---

## 3. Флоу операций (Create / Edit / Delete)

### Создание товара (Create)

1. **Форма** генерит `local-${uuid}` и вызывает `createLocalProduct(product)`
2. **Redux action** записывает в `localProductsById[id] = { ...product, source: "local" }`
3. **useProductsView()** автоматически подхватывает новый товар (этап 2: `applyLocalChanges`)
4. **Виджет** рендерит обновлённый список

---

### Редактирование товара (Edit)

1. **Детальная страница** вызывает `useProductView(id)` → получает готовый `product` (с учетом локальных изменений)
2. **Форма** после сабмита вызывает `updateLocalProduct(id, patch)`
3. **Redux action** записывает/обновляет `localProductsById[id] = patch`
4. **useProductView(id)** автоматически вернёт обновлённый продукт (шаг 4: применение патча)

---

### Удаление товара (Delete)

#### Для API-товара:

1. Вызывается `removeProduct(id)`
2. Redux добавляет `id` в `removedIds`
3. `useProductsView()` автоматически исключает товар (этап 2: `applyLocalChanges`)
4. `useProductView(id)` вернёт `notFound: true` (шаг 2)

#### Для локального товара (`local-...`):

1. Вызывается `deleteLocalProduct(id)`
2. Redux удаляет `localProductsById[id]`
3. `useProductsView()` автоматически исключает товар (этап 2: `applyLocalChanges`)

---

## 4. Размещение файлов

```
widgets/products/
  model/
    hooks/
      useProductsView.ts       # агрегатор для списка (4 этапа)
      useProductView.ts        # агрегатор для одного товара
      usePagination.ts         # хук пагинации (этап 4)
      useFilteredProducts.ts   # хук фильтрации (этап 3, переносим из features)
    lib/
      applyLocalChanges.ts     # утилита для этапа 2
      index.ts

widgets/product-detail/
  model/
    hooks/
      # здесь может использоваться useProductView из widgets/products
```

---

## 5. Преимущества рефакторинга

1. **Виджеты проще** - не знают про removed/local/filters, просто рендерят результат
2. **Переиспользование** - `useProductView` используется в детальной странице, форме редактирования
3. **Тестируемость** - каждый этап изолирован, легко покрыть тестами
4. **Единая точка истины** - вся логика обработки данных в одном месте
5. **Расширяемость** - легко добавить новые этапы (сортировка, группировка и т.д.)

---

## 6. Миграция

### Этап 1: Создание утилит и хуков для этапов

- [ ] `applyLocalChanges.ts` - утилита для локальных изменений
- [ ] `usePagination.ts` - хук пагинации
- [ ] Перенос `useFilteredProducts.ts` из `features/filters`

### Этап 2: Агрегатор для списка

- [ ] `useProductsView.ts` - композиция всех этапов
- [ ] Обновление `ProductsWidget` - использование нового хука
- [ ] Удаление старой логики из виджета

### Этап 3: Агрегатор для одного товара

- [ ] `useProductView.ts` - логика для одного товара
- [ ] Обновление детальной страницы/формы редактирования
- [ ] Удаление дублирующей логики

### Этап 4: Тесты

- [ ] Unit-тесты для `applyLocalChanges`
- [ ] Интеграционные тесты для `useProductsView`
- [ ] Интеграционные тесты для `useProductView`

---

## 7. Решения по дизайну

### 7.1 Порядок товаров в списке

**Решение:** Сортировка по названию (alphabetically), без различий между локальными и API-товарами.

### 7.2 Мемоизация

**Решение:** Применять `useMemo` для результата `applyLocalChanges` в `useProductsView` для избежания лишних рендеров.

### 7.3 Получение товара по ID

**Решение:** Использовать `useGetProductByIdQuery(id)` как fallback. Кеш списка (`getProducts`) RTK Query автоматически предоставляет данные через normalized cache, поэтому отдельный селектор не нужен.

### 7.4 Обработка ошибок в `useProductView`

**Решение (отложено на этап 3):**

- Сначала проверяем локально (local-товар или удалённый)
- Если не найден локально и не удалён → идём в API
- Приоритет: `error` из API > `notFound`
- Детальная обработка будет реализована после списков товаров

### 7.5 Тип для `localProductsById`

**Решение (отложено):**

- Пока используем `Record<string, Partial<Product> & { source?: 'local' | 'edited' }>`
- Поле `source` опциональное, но для локальных/изменённых товаров всегда заполнено
- Возможно изменение типа в будущем после тестирования

### 7.6 Debounce для поиска

**Решение:** Debounce остаётся в компоненте `QueryFilter` (как сейчас). `useFilteredProducts` просто читает значение из Redux и применяет фильтры без дополнительного debounce.

---

## 8. План реализации (поэтапно)

### Этап 1: Утилита `applyLocalChanges` ✅ СЛЕДУЮЩИЙ ШАГ

- [ ] Создать `widgets/products/model/lib/applyLocalChanges.ts`
- [ ] Реализовать логику:
  - Фильтрация по `removedIds`
  - Применение патчей из `localProductsById`
  - Добавление локальных товаров
  - Сортировка по названию
- [ ] Добавить типы и JSDoc
- [ ] Unit-тесты для утилиты

### Этап 2: Хуки для этапов обработки

- [ ] Перенести `useFilteredProducts` из `features/filters/model/hooks/` в `widgets/products/model/hooks/`
- [ ] Создать `usePagination` в `widgets/products/model/hooks/`
- [ ] Обновить импорты в зависимых компонентах

### Этап 3: Агрегатор `useProductsView`

- [ ] Создать `widgets/products/model/hooks/useProductsView.ts`
- [ ] Композиция всех этапов с мемоизацией
- [ ] Расчёт пустых состояний (apiEmpty, localEmpty, filteredEmpty)
- [ ] Интеграционные тесты

### Этап 4: Обновление `ProductsWidget`

- [ ] Заменить логику на вызов `useProductsView()`
- [ ] Упростить рендеринг (только пустые состояния + грид)
- [ ] Удалить старую логику

### Этап 5: Агрегатор `useProductView` (один товар)

- [ ] Реализация по документации (раздел 2)
- [ ] Обновление детальной страницы и формы редактирования
- [ ] Тесты
