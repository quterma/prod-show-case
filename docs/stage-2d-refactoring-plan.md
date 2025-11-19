# Stage 2D: ID & 404 Handling Refactoring Plan

**Цель:** Убрать хрупкую валидацию ID, перейти на строковые ID, упростить Redux state, сделать единообразную обработку "продукт не найден" → 404.

---

## Утверждённые решения:

1. **Scope:** Полный рефакторинг в рамках Stage 2D
2. **ID формат:** Строковые ID с использованием современной библиотеки (nanoid)
3. **Redux state:** 2 структуры (не 3):
   - `localProductsById: { [id: string]: Product }` — все созданные и патченные продукты
   - `removedProductIds: string[]` — удалённые продукты (API и локальные)
4. **404 handling:** Все сценарии "продукта нет" → 404 page
5. **Валидация ID:** Убрать `parseProductId`, просто искать продукт

---

## Этапы рефакторинга (выполнять последовательно):

### Этап 1: Установка nanoid и подготовка типов

**Задачи:**

1. Установить `nanoid` (легковесная, современная библиотека для уникальных ID)
2. Создать тип `ProductId = string` в `entities/product/model/types.ts`
3. Создать утилиту `generateLocalProductId()` в `shared/lib/utils/` → `"local_" + nanoid(10)`
4. Обновить тип `Product` → заменить `id: number` на `id: string`

**Затронутые файлы:**

- `package.json` (установка nanoid)
- `src/entities/product/model/types.ts` (тип `ProductId`, обновление `Product`)
- `src/shared/lib/utils/generateId.ts` (новая утилита)

**Коммит:** "refactor: add nanoid and prepare string-based ProductId type"

---

### Этап 2: Обновление Redux state (localProductsSlice)

**Задачи:**

1. Обновить `localProductsSlice`:
   - Убрать `source: "local" | "patch"`
   - Упростить до 2 структур:
     - `localProductsById: { [id: string]: Product }`
     - `removedProductIds: string[]`
2. Обновить actions (createLocalProduct, patchProduct, removeProduct):
   - `createLocalProduct` → генерирует ID через `generateLocalProductId()`
   - `patchProduct` → добавляет/обновляет в `localProductsById`
   - `removeProduct` → добавляет в `removedProductIds` (не удаляет из `localProductsById`)
3. Обновить selectors:
   - Упростить `makeSelectMergedProduct` (без проверки `source`)
   - Упростить `makeSelectMergedProducts`

**Затронутые файлы:**

- `src/features/local-products/model/localProductsSlice.ts`
- `src/features/local-products/model/selectors.ts`

**Коммит:** "refactor: simplify Redux state to two structures (localProductsById, removedProductIds)"

---

### Этап 3: Обновление API слоя (productsApi)

**Задачи:**

1. Обновить `useGetProductByIdQuery` → принимает `string` ID
2. Обновить `useGetProductsQuery` → маппинг `id: number` → `id: string`
3. Добавить mapper `apiProductToProduct` для преобразования API response

**Затронутые файлы:**

- `src/entities/product/api/productsApi.ts`
- `src/entities/product/model/mappers.ts` (если есть)

**Коммит:** "refactor: update API layer to handle string-based product IDs"

---

### Этап 4: Обновление page.tsx и убрать валидацию ID

**Задачи:**

1. Убрать `parseProductId` из `src/app/products/[id]/page.tsx`
2. Передавать `params.id` напрямую как строку
3. Убрать `src/shared/lib/validations/product.ts` (больше не нужен)
4. Обновить `ProductDetailWidget` → принимает `productId: string`

**Затронутые файлы:**

- `src/app/products/[id]/page.tsx`
- `src/shared/lib/validations/product.ts` (удалить)
- `src/shared/lib/validations/index.ts` (убрать экспорт)
- `src/widgets/product-detail/ui/ProductDetailWidget/ProductDetailWidget.tsx`

**Коммит:** "refactor: remove ID validation and use string IDs directly in page.tsx"

---

### Этап 5: Единообразная обработка "продукт не найден" → 404

**Задачи:**

1. Обновить `useProductView`:
   - API 404 (`error.status === 404`) → `emptyState = "notFound"`
   - Продукт в `removedProductIds` → `emptyState = "notFound"` (не "removed")
   - Убрать различие между "removed" и "notFound"
2. Обновить `ProductDetailWidget`:
   - При `emptyState === "notFound"` → вызывать `notFound()`
   - Убрать отдельный рендер для `emptyState === "removed"`
3. Обновить `page.tsx`:
   - Убрать условие `if (productId === null) notFound()`

**Затронутые файлы:**

- `src/widgets/product-detail/hooks/useProductView.ts`
- `src/widgets/product-detail/ui/ProductDetailWidget/ProductDetailWidget.tsx`
- `src/app/products/[id]/page.tsx`

**Коммит:** "refactor: unify 'product not found' handling to always trigger 404"

---

### Этап 6: Обновление компонентов и форм

**Задачи:**

1. Обновить все компоненты, использующие `Product.id`:
   - `ProductCard`
   - `ProductDetailCard`
   - `ProductFormDialog`
2. Обновить форму создания/редактирования продукта
3. Обновить все места, где используется `id: number` → `id: string`

**Затронутые файлы:**

- `src/entities/product/ui/**/*`
- `src/widgets/product-form-dialog/**/*`
- `src/features/**/*` (где используется `Product`)

**Коммит:** "refactor: update all components to use string-based product IDs"

---

### Этап 7: Обновление тестов

**Задачи:**

1. Обновить все тесты с `id: number` → `id: string`
2. Использовать `generateLocalProductId()` в моках
3. Обновить тесты для `localProductsSlice`
4. Убедиться, что все тесты проходят

**Затронутые файлы:**

- `src/**/*.test.ts`
- `src/**/*.test.tsx`
- `tests/setup.ts` (если нужно)

**Коммит:** "test: update all tests to use string-based product IDs"

---

### Этап 8: Обновление persist слоя и миграция данных

**Задачи:**

1. Обновить `persist` утилиты для работы со строковыми ID
2. Добавить миграцию localStorage:
   - Преобразовать старые числовые ID → строковые
   - Обновить формат `localProductsById` (убрать `source`)
3. Добавить версионирование localStorage (для будущих миграций)

**Затронутые файлы:**

- `src/shared/lib/persist/**/*`
- `src/features/local-products/model/localProductsSlice.ts` (миграция)

**Коммит:** "refactor: update persist layer and add localStorage migration"

---

### Этап 9: Финальная проверка и cleanup

**Задачи:**

1. Проверить все файлы на упоминания `id: number`, `productId < 0`, `isLocalProduct`
2. Удалить мёртвый код
3. Обновить комментарии и JSDoc
4. Убедиться, что lint и тесты проходят
5. Обновить `docs/stage-2d-todo.md` → убрать Баг 2 (решён)

**Затронутые файлы:**

- Все файлы проекта (проверка)

**Коммит:** "refactor: final cleanup after string ID migration"

---

### Этап 10: Итоговый отчёт

**Задачи:**

1. Создать отчёт `docs/stage-2d-report.md`
2. Описать все изменения
3. Список затронутых файлов
4. Миграционный путь для существующих данных

**Затронутые файлы:**

- `docs/stage-2d-report.md`

**Коммит:** "docs: add Stage 2D refactoring report"

---

## Порядок выполнения:

1. Этап 1 → коммит → отчёт (1 абзац)
2. Этап 2 → коммит → отчёт (1 абзац)
3. ... и так далее до Этапа 10

**После каждого этапа:**

- ✅ Lint проходит
- ✅ Тесты проходят (или обновлены)
- ✅ Коммит создан
- ✅ Краткий отчёт (1 абзац) для проверки

---

## Примечания:

- **nanoid:** Легковесная (~130 байт), быстрая, безопасная, URL-friendly
- **Формат локального ID:** `"local_" + nanoid(10)` → `"local_V1StGXR8_Z"`
- **Формат API ID:** `String(apiId)` → `"1"`, `"123"`
- **Backwards compatibility:** Миграция localStorage на этапе 8
