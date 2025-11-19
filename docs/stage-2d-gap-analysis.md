# Stage 2D Gap Analysis

**Дата:** Ноябрь 18, 2025
**Статус:** Ready for Implementation
**Цель:** Завершить обработку ошибок и edge cases (404, ErrorBoundary, валидация)

---

## ✅ Что уже реализовано

### 1. Error Handling в Виджетах

**ProductsWidget (widgets/products/ui/ProductsWidget.tsx):**

- ✅ Обработка `error` state из RTK Query
- ✅ ErrorMessage с кнопкой Retry
- ✅ 4 типа EmptyState (emptyAPIData, emptyLocalData, emptyFavoriteData, emptyFilteredData)
- ✅ Toolbar остаётся доступным при ошибках

**ProductDetailWidget (widgets/product-detail/ui/ProductDetailWidget.tsx):**

- ✅ Обработка `error` state из RTK Query
- ✅ ErrorMessage с кнопкой Retry
- ✅ 2 типа EmptyState (removed, notFound)
- ✅ Загрузочный скелетон

### 2. View Hooks - Обработка Состояний

**useProductView (widgets/product-detail/hooks/useProductView.ts):**

- ✅ Различает API error vs notFound
- ✅ Игнорирует API error для локальных продуктов (id < 0)
- ✅ Определяет "removed" vs "notFound":
  - `removed`: API вернул продукт, но selector вернул null (soft-delete)
  - `notFound`: Продукта нет ни в API, ни в локальном store
- ✅ Возвращает `refetch()` для Retry

**useProductsView (widgets/products/hooks/useProductsView.ts):**

- ✅ Обработка error state
- ✅ 4 типа emptyState (детализированные сообщения)
- ✅ Возвращает `refetch()`

### 3. ID Handling в Page

**products/[id]/page.tsx:**

- ✅ Извлекает ID из URL: `useParams<{ id: string }>()`
- ✅ Конвертирует в number: `Number(params.id)`
- ⚠️ **НЕТ валидации** - напрямую передаёт в ProductDetailWidget

### 4. Local Products Support

- ✅ Поддержка отрицательных ID для локальных продуктов
- ✅ API error игнорируется для id < 0
- ✅ Мёрж локальных продуктов через `useMergedProduct`

---

## ❌ Пробелы (Gaps)

### 1. Not-Found Pages - ПОЛНОСТЬЮ ОТСУТСТВУЮТ

**Отсутствующие файлы:**

- ❌ `app/not-found.tsx` - глобальная 404
- ❌ `app/products/[id]/not-found.tsx` - product-specific 404

**Проблемы:**

- Невалидный ID (букв, символы) → `Number(params.id)` = `NaN` → передаётся в API
- Next.js не показывает стандартную 404 при неправильном ID
- Нет визуальной 404 страницы для пользователя

### 2. Global ErrorBoundary - ОТСУТСТВУЕТ

**Текущее состояние:**

- ❌ `app/layout.tsx` НЕ обёрнут в ErrorBoundary
- ❌ Нет React Error Boundary компонента
- ❌ Нет `app/error.tsx` (Next.js Error Boundary convention)

**Проблемы:**

- Фатальная ошибка в компоненте → белый экран
- Нет fallback UI для критических ошибок
- Нет возможности восстановления (Reset App)

### 3. ID Validation - ОТСУТСТВУЕТ

**Текущая логика:**

```typescript
// products/[id]/page.tsx
const params = useParams<{ id: string }>()
return <ProductDetailWidget productId={Number(params.id)} />
```

**Проблемы:**

- `Number("abc")` = `NaN` → API запрос с NaN
- `Number("1.5")` = `1.5` → дробный ID
- `Number("999999")` = 999999 → несуществующий, но валидный ID
- Локальные ID (`-1`, `-2`) считаются валидными, но нет проверки

**Нет различия между:**

- Невалидный формат ID (`/products/abc`) → должна быть 404
- Несуществующий, но валидный ID (`/products/999999`) → API вернёт 404, обработается в виджете

### 4. LocalStorage Validation - ЧАСТИЧНО

**Текущее состояние:**

- ✅ `safeLoadFromStorage.ts` есть валидация типов
- ⚠️ Нет явного graceful degradation при corrupt data
- ⚠️ Persist middleware не проверяет валидность перед сохранением

**Потенциальная проблема:**

- Corrupt localStorage → невалидный JSON → падение при гидрации

---

## 🎯 Затрагиваемые файлы и модули

### Создать новые файлы:

1. **app/not-found.tsx**
   - Глобальная 404 страница
   - Визуальный UI с навигацией на главную

2. **app/products/[id]/not-found.tsx**
   - Product-specific 404
   - Сообщение "Product not found"
   - Навигация на список продуктов

3. **app/error.tsx**
   - Next.js Error Boundary convention
   - Fallback UI с кнопкой "Reset App"
   - Опционально: логирование ошибок

4. **shared/ui/ErrorBoundary/** (опционально, если нужен кастомный)
   - React Error Boundary класс-компонент
   - Fallback UI компонент

### Модифицировать существующие файлы:

1. **app/products/[id]/page.tsx**
   - Добавить валидацию ID
   - Вызывать `notFound()` для невалидных ID
   - Поддержка отрицательных ID (локальные продукты)

2. **app/layout.tsx** (опционально)
   - Обернуть в кастомный ErrorBoundary (если не используем app/error.tsx)

3. **shared/lib/persist/safeLoadFromStorage.ts** (опционально)
   - Улучшить обработку corrupt data
   - Добавить fallback на пустое состояние

---

## 🚦 Логика Обработки Ошибок (Текущая vs Требуемая)

### Текущая логика (ProductDetailWidget):

```
URL: /products/abc
  ↓
params.id = "abc"
  ↓
Number("abc") = NaN
  ↓
useGetProductByIdQuery(NaN) → API error
  ↓
ProductDetailWidget → ErrorMessage "Failed to load product"
```

**Проблема:** Пользователь видит "Failed to load", а не "Page not found"

### Требуемая логика:

```
URL: /products/abc
  ↓
params.id = "abc"
  ↓
Валидация: isNaN(Number("abc")) = true
  ↓
notFound() → Next.js рендерит not-found.tsx
  ↓
Пользователь видит 404 страницу
```

### Валидация ID - Детали:

**Валидный ID:**

- Положительное целое число: `1`, `20`, `999`
- Отрицательное целое число (локальные): `-1`, `-2`, `-999`

**Невалидный ID:**

- Не число: `abc`, `1a2b`, `null`, `undefined`
- Дробное число: `1.5`, `3.14`
- Специальные значения: `NaN`, `Infinity`, `-Infinity`
- Пустая строка: ``
- Ноль: `0` (опционально - решить с автором)

---

## ❓ Вопросы к автору (для уточнения)

### 1. ID Validation Strategy

**Вопрос:** Где размещать логику валидации ID?

**Варианты:**

- **A.** В `products/[id]/page.tsx` - проверяем перед рендером виджета
- **B.** В `useProductView` хуке - универсально для всех мест использования
- **C.** В обоих местах (page для 404, hook для безопасности)

**Рекомендация:** Вариант A (page), т.к. это ответственность роутинга.

### 2. ID = 0 - Валидный или Нет?

**Вопрос:** Считать ли `id = 0` валидным?

- FakeStore API: вряд ли вернёт продукт с ID = 0
- Локальные продукты: используют отрицательные ID (-1, -2...)

**Рекомендация:** ID = 0 → невалидный (вызывать `notFound()`)

### 3. ErrorBoundary Scope

**Вопрос:** Какой scope для ErrorBoundary?

**Варианты:**

- **A.** Глобальный (app/layout.tsx) - ловит все фатальные ошибки
- **B.** Per-route (app/products/error.tsx) - изолирует ошибки по роутам
- **C.** Оба (глобальный + per-route)

**Рекомендация:** Начать с глобального (A), расширить до (C) если нужно.

### 4. Error Logging

**Вопрос:** Нужно ли логирование ошибок в ErrorBoundary?

- Console.error (development)
- External service (Sentry, production) - скорее всего нет для MVP

**Рекомендация:** Только console.error для MVP.

### 5. Fallback Mocks для API

**Вопрос:** Нужны ли fallback мокс при недоступности API?

- Roadmap упоминает "Mock Fallback Strategy" в Stage 5 (опционально)
- Текущая логика: error → ErrorMessage с Retry

**Рекомендация:** НЕ делать в Stage 2D, отложить на Stage 5.

---

## ✅ Implementation Checklist

### Task 1: Not-Found Pages

**1.1 Глобальная 404 (app/not-found.tsx)**

- [ ] Создать `app/not-found.tsx`
- [ ] Визуальный UI (EmptyState + Button)
- [ ] Навигация на главную (`/`)
- [ ] Tailwind стили
- [ ] Smoke test

**1.2 Product 404 (app/products/[id]/not-found.tsx)**

- [ ] Создать `app/products/[id]/not-found.tsx`
- [ ] Сообщение "Product not found"
- [ ] Навигация на `/products`
- [ ] Smoke test

**1.3 ID Validation в Page**

- [ ] Добавить функцию `isValidProductId(id: string): boolean`
- [ ] Проверка в `products/[id]/page.tsx`:
  - `isNaN(Number(id))` → `notFound()`
  - `!Number.isInteger(Number(id))` → `notFound()`
  - `Number(id) === 0` → `notFound()` (опционально)
- [ ] Поддержка отрицательных ID (локальные продукты)
- [ ] Unit тесты для `isValidProductId`

### Task 2: Global ErrorBoundary

**2.1 Next.js Error Convention (app/error.tsx)**

- [ ] Создать `app/error.tsx` (Next.js convention)
- [ ] Fallback UI с сообщением ошибки
- [ ] Кнопка "Reset App" → `reset()` + navigate to `/`
- [ ] Кнопка "Go Home" → navigate to `/`
- [ ] Console.error для development
- [ ] Smoke test (simulate error)

**2.2 Альтернатива: Кастомный ErrorBoundary (опционально)**

- [ ] Создать `shared/ui/ErrorBoundary/ErrorBoundary.tsx` (класс-компонент)
- [ ] State: `{ hasError: boolean, error: Error | null }`
- [ ] componentDidCatch для логирования
- [ ] Fallback UI компонент
- [ ] Обернуть `app/layout.tsx` children
- [ ] Unit тесты

### Task 3: Edge Cases Guards

**3.1 LocalStorage Validation**

- [ ] Проверить `safeLoadFromStorage` на обработку corrupt JSON
- [ ] Добавить try/catch в `persistMiddleware` (если нет)
- [ ] Graceful degradation: corrupt data → пустое состояние
- [ ] Unit тесты для corrupt data scenarios

**3.2 Persist Hydration Guards**

- [ ] Проверить `createPreloadedState` на SSR-безопасность
- [ ] Fallback на пустое состояние при ошибке гидрации
- [ ] Unit тесты

### Task 4: Testing

**4.1 Unit Tests**

- [ ] `isValidProductId` function (8+ test cases)
- [ ] ErrorBoundary component (error simulation)
- [ ] localStorage corrupt data handling

**4.2 Integration Tests**

- [ ] ProductDetailPage с невалидным ID → 404
- [ ] ProductDetailPage с несуществующим ID → "Product not found" EmptyState
- [ ] Simulate фатальная ошибка → ErrorBoundary

**4.3 E2E Tests (опционально для Stage 2D)**

- [ ] Navigate to `/products/abc` → 404 page
- [ ] Navigate to `/products/999999` → "Product not found"
- [ ] Trigger error → ErrorBoundary → Reset → navigate home

---

## 🔄 Recommended Implementation Order

**Phase 1: Not-Found Pages (Priority 1)**

1. Create `app/not-found.tsx`
2. Create `app/products/[id]/not-found.tsx`
3. Add ID validation to `products/[id]/page.tsx`
4. Unit tests for validation logic

**Phase 2: Global ErrorBoundary (Priority 1)**

1. Create `app/error.tsx`
2. Test with simulated errors
3. Add console logging

**Phase 3: Edge Cases (Priority 2)**

1. Review/improve localStorage validation
2. Add guards to persist hydration
3. Unit tests

**Phase 4: Testing (Priority 3)**

1. Unit tests for validation
2. Integration tests for 404 handling
3. Smoke tests for ErrorBoundary

---

## 📊 Summary

### Missing Components:

- ❌ 2 not-found.tsx files
- ❌ 1 error.tsx file
- ❌ ID validation logic
- ⚠️ Enhanced localStorage guards (optional)

### Complexity Estimate:

- **Simple:** Not-found pages (1-2 hours)
- **Simple:** ID validation (1 hour)
- **Medium:** ErrorBoundary + testing (2-3 hours)
- **Optional:** Enhanced localStorage guards (1-2 hours)

**Total: 5-8 hours** (1 рабочий день)

### Risk Assessment:

- **Low Risk:** Not-found pages (изолированные файлы)
- **Low Risk:** ID validation (добавление в page.tsx)
- **Medium Risk:** ErrorBoundary (влияет на глобальный рендеринг)

### DoD Verification:

✅ **Stage 2D Complete когда:**

- [ ] 404 страница работает для невалидных ID
- [ ] ErrorBoundary ловит фатальные ошибки
- [ ] Приложение не крашится при некорректных данных
- [ ] Все edge cases покрыты тестами

---

**Готов к реализации:** ДА ✅
**Блокеры:** НЕТ
**Вопросы к автору:** 5 (см. раздел "Вопросы к автору")
