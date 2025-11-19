# ID System Refactoring (Completed)

**Дата завершения**: 2025-11-19
**Статус**: ✅ Завершено

## Обзор изменений

Проведен полный рефакторинг системы идентификации товаров с числовых ID на строковые.

### До рефакторинга (v1)

```typescript
// API товары: положительные числа
type ProductId = number  // 1, 2, 3, ...

// Локальные товары: отрицательные числа
const localId = -1, -2, -3, ...

// Проверки типа товара
if (id < 0) { /* локальный */ }
if (id > 0) { /* API */ }

// Redux state с полем source
type LocalProductEntry = {
  id: number
  data: Product
  source: "local" | "api"  // Дублирование информации
}

type LocalProductsState = {
  localProductsById: Record<number, LocalProductEntry>
  removedApiIds: number[]
  nextLocalId: number  // -1, -2, -3, ...
}
```

### После рефакторинга (v2)

```typescript
// Все товары: строковые ID
type ProductId = string

// API товары: строковые представления чисел
const apiId = "1", "2", "3", ...

// Локальные товары: префикс "local_" + nanoid
const localId = "local_abc123def4567"

// Проверки типа товара
if (id.startsWith("local_")) { /* локальный */ }

// Упрощенный Redux state без source
type LocalProductsState = {
  localProductsById: Record<ProductId, Product>  // Напрямую Product
  removedProductIds: ProductId[]  // И API и локальные
}
```

## Ключевые преимущества

### 1. Унифицированная система ID

- Нет магических чисел и проверок на знак
- Семантичные префиксы для локальных товаров
- Простая и понятная логика

### 2. Упрощенный Redux state

- Удалено поле `source` (избыточность)
- Удалено поле `nextLocalId` (генерация через nanoid)
- Одна структура `removedProductIds` для всех типов товаров

### 3. Лучшая читаемость кода

```typescript
// Было
if (product.source === "local" || product.id < 0) { ... }

// Стало
if (product.id.startsWith("local_")) { ... }
```

## LocalStorage структура

### Favorites (app:favorites:v2)

```typescript
{
  favoriteIds: ProductId[] // ["1", "2", "3"]
}
```

### LocalProducts (app:localProducts:v2)

```typescript
{
  localProductsById: Record<ProductId, Product>
  removedProductIds: ProductId[]
}
```

## Затронутые компоненты

### Типы и модели

- ✅ `Product.id: number` → `Product.id: ProductId (string)`
- ✅ `ProductId` экспортируется из `@/entities/product`
- ✅ Все мappers конвертируют API numeric ID → string

### Redux state

- ✅ `favoritesSlice` - строковые ID, v2 storage
- ✅ `localProductsSlice` - упрощенная структура, v2 storage
- ✅ `persistRegistry` - обновлены ключи на v2
- ✅ Все селекторы используют `id.startsWith("local_")`

### Утилиты

- ✅ `generateLocalProductId()` - генерирует `"local_" + nanoid(10)`
- ✅ `mapProductDTO()` - конвертирует `dto.id` в `String(dto.id)`

### Хуки и компоненты

- ✅ `useProductView` - проверка `id.startsWith("local_")`
- ✅ `useMergedProduct` - работает со строковыми ID
- ✅ Все компоненты обновлены

### Тесты

- ✅ Все 129 тестов прошли
- ✅ Все mock data обновлены на строковые ID
- ✅ Все preloadedState обновлены под новую структуру

## Проверка статуса

```bash
# TypeScript компиляция
pnpm tsc --noEmit
# ✅ 0 ошибок

# Линтер
pnpm lint:check
# ✅ 0 ошибок (1 warning о <img> - не критично)

# Тесты
pnpm test:run
# ✅ 129/129 passed
```

## API совместимость

FakeStore API продолжает возвращать числовые ID. Конвертация происходит автоматически в маппере:

```typescript
export function mapProductDTO(dto: ProductDTO): Product {
  return {
    id: String(dto.id), // Convert API numeric ID to string
    // ... rest
  }
}
```

## Рекомендации для разработчиков

### Работа с ID

```typescript
// ✅ Правильно - используем ProductId type
import type { ProductId } from "@/entities/product"
function processProduct(id: ProductId) { ... }

// ✅ Проверка типа товара
const isLocal = id.startsWith("local_")

// ✅ Создание локального товара
import { generateLocalProductId } from "@/shared/lib/utils"
const newId = generateLocalProductId() // "local_abc123def4567"

// ❌ Неправильно - не используем числовые проверки
if (id < 0) { ... }  // ТИП ОШИБКА!
if (typeof id === "number") { ... }  // ВСЕГДА false
```

### Удаление товаров

```typescript
// ✅ Универсальная логика удаления (не зависит от типа товара)
// При вызове removeProduct:
// 1. Если товар есть в localProductsById - удаляется оттуда
// 2. ID добавляется в removedProductIds (скрывает из UI)
dispatch(removeProduct("local_abc123")) // → удаляется из localProductsById + в removedProductIds
dispatch(removeProduct("123")) // → удаляется из localProductsById (если был патч) + в removedProductIds

// Префикс "local_" используется только для генерации уникальных ID (nanoid)
// Логика удаления не проверяет префикс - работает универсально для всех товаров
```

### Redux selectors

```typescript
// ✅ Используем обновленные селекторы
import { selectRemovedProductIds } from "@/features/local-products"

// ❌ Старые селекторы удалены
import { selectRemovedApiIds } from "@/features/local-products" // НЕ СУЩЕСТВУЕТ
```

### LocalStorage ключи

```typescript
// Текущая версия - v2
"app:favorites:v2"
"app:localProducts:v2"
```

## Связанные документы

- [docs/stage-2d-refactoring-plan.md](./stage-2d-refactoring-plan.md) - Исходный план рефакторинга
- [docs/current-architecture.md](./current-architecture.md) - Актуальная архитектура
- [CLAUDE.md](../CLAUDE.md) - Инструкции для AI ассистента

## Примечания

- LocalStorage использует версионированные ключи (v2)
- Данные сохраняются автоматически через persistMiddleware
- При очистке localStorage все локальные изменения будут потеряны

## Changelog

**2025-11-19**:

- ✅ Рефакторинг типов и Redux state (Stages 1-3)
- ✅ Обновление компонентов и форм (Stages 4-6)
- ✅ Исправление всех тестов (Stage 7)
- ✅ Обновлена документация
- ✅ Универсальная логика удаления товаров (без проверки префикса "local\_")
- ✅ Убрана вся логика миграции v1→v2 (приложение не deployed)
