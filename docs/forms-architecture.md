# Forms Architecture — Create/Edit Product

**Дата аудита:** 2025-11-14
**Задача:** Архитектура форм создания и редактирования продуктов (RHF + Zod)
**Проект:** prod-show-case (учебный/портфолио)

---

## 🔍 Аудит существующих артефактов

### ✅ Что есть в `shared/lib/forms`

**Файлы:**

- [src/shared/lib/forms/components/FormField.tsx](../src/shared/lib/forms/components/FormField.tsx)
- [src/shared/lib/forms/hooks.ts](../src/shared/lib/forms/hooks.ts)
- [src/shared/lib/forms/index.ts](../src/shared/lib/forms/index.ts)

**Компоненты:**

1. **`FormField`** — обёртка для поля формы (label, error, required)
2. **`useFormSubmission`** — хук для обработки submit с loading/error

**Оценка:**

- ✅ **Оставляем:** Компоненты универсальные, переиспользуемые
- ⚠️ **Проблема:** Отсутствует `FormError` как отдельный компонент (импорт в `index.ts` не работает)
- 🔧 **Дополнить:** Нужны типы для интеграции с RHF (`Controller`, `FieldErrors`)

---

### ✅ Что есть в `shared/lib/validations`

**Файлы:**

- [src/shared/lib/validations/common.ts](../src/shared/lib/validations/common.ts)

**Валидаторы:**

```typescript
commonValidations = {
  requiredString,
  optionalString,
  email,
  positiveNumber,
  price,
  futureDate,
}
```

**Оценка:**

- ✅ **Оставляем:** Базовые валидаторы работают
- 🔧 **Дополнить:** Нужны специфичные для продукта валидаторы (title, description, price, image URL)

---

## 🎯 Требования к формам

### Функциональность

1. **Create Product** — создание продукта локально (не отправляется на API)
2. **Edit Product** — редактирование существующего продукта (локальные изменения)
3. **Validation** — Zod схемы для всех полей
4. **Persistence** — сохранение в `createdLocal` (localStorage)
5. **Integration** — формы как Feature, данные в Redux

### Поля формы

```typescript
title: string // required, min 3, max 100
price: number // required, positive, max 999999
description: string // required, min 10, max 500
category: string // required, select from dynamic categories
image: string // required, valid URL
rating: {
  // optional, только при редактировании
  rate: number // 0-5
  count: number // >= 0
}
```

---

## 🏗️ Архитектурное решение

### Принципы

1. **Без оверинжиниринга** — для MVP используем простую схему
2. **FSD-совместимость** — строго по слоям
3. **Переиспользуемость** — базовые компоненты в `shared/`, логика в `features/`
4. **Чистота** — схемы, типы, мапперы отделены от UI

---

## 📂 Распределение по FSD-слоям

### 1️⃣ **shared/lib/validations** — Схемы валидации

**Файл:** `src/shared/lib/validations/product.ts`

```typescript
import { z } from "zod"
import { commonValidations } from "./common"

/**
 * Product form validation schema
 * Used for both Create and Edit forms
 */
export const productFormSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must be at most 100 characters"),

  price: commonValidations.price,

  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description must be at most 500 characters"),

  category: z.string().min(1, "Category is required"),

  image: z
    .string()
    .url("Must be a valid URL")
    .regex(/\.(jpg|jpeg|png|webp|gif)$/i, "Must be an image URL"),

  // Optional: only for edit mode
  rating: z
    .object({
      rate: z.number().min(0).max(5),
      count: z.number().min(0),
    })
    .optional(),
})

export type ProductFormData = z.infer<typeof productFormSchema>
```

**Почему здесь?**

- ✅ Переиспользуемая схема валидации
- ✅ Независима от бизнес-логики
- ✅ `shared/` = инфраструктурный код

---

### 2️⃣ **entities/product/model** — Типы и мапперы

**Файл:** `src/entities/product/model/types.ts` (дополнить)

```typescript
/**
 * Product creation input (from form)
 */
export type ProductCreateInput = {
  title: string
  price: number
  description: string
  category: string
  image: string
}

/**
 * Product update input (from form)
 */
export type ProductUpdateInput = ProductCreateInput & {
  rating?: ProductRating
}
```

**Файл:** `src/entities/product/model/mappers.ts` (дополнить)

```typescript
/**
 * Maps form data to ProductCreateInput
 */
export function formToProductInput(
  formData: ProductFormData
): ProductCreateInput {
  return {
    title: formData.title,
    price: formData.price,
    description: formData.description,
    category: formData.category,
    image: formData.image,
  }
}

/**
 * Maps existing Product to form data (for editing)
 */
export function productToFormData(product: Product): ProductFormData {
  return {
    title: product.title,
    price: product.price,
    description: product.description,
    category: product.category,
    image: product.image,
    rating: product.rating,
  }
}

/**
 * Creates a new Product from form input (for local storage)
 */
export function createLocalProduct(
  input: ProductCreateInput,
  tempId: number
): Product {
  return {
    id: tempId, // Negative ID for local products
    ...input,
    rating: { rate: 0, count: 0 }, // Default rating for new products
  }
}
```

**Почему здесь?**

- ✅ Типы и мапперы принадлежат сущности Product
- ✅ `entities/` = доменные модели
- ✅ Переиспользуются в разных фичах

---

### 3️⃣ **features/product-form** — Бизнес-логика форм

**Структура:**

```
features/product-form/
├── model/
│   ├── localProductsSlice.ts   # Redux slice для createdLocal
│   ├── selectors.ts             # Селекторы
│   └── index.ts
├── ui/
│   ├── ProductForm/
│   │   ├── ProductForm.tsx      # Основная форма (RHF)
│   │   └── index.ts
│   ├── CreateProductDialog/
│   │   ├── CreateProductDialog.tsx
│   │   └── index.ts
│   ├── EditProductDialog/
│   │   ├── EditProductDialog.tsx
│   │   └── index.ts
│   └── index.ts
└── index.ts
```

---

#### **3.1 Redux Slice (features/product-form/model/localProductsSlice.ts)**

```typescript
import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { Product } from "@/entities/product"
import { getFromLS, setToLS } from "@/shared/lib/persist"

const LS_KEY = "prod-showcase:createdLocal"

type LocalProductsState = {
  items: Product[]
  nextId: number // Negative IDs for local products (-1, -2, -3...)
}

const initialState: LocalProductsState = {
  items: getFromLS<Product[]>(LS_KEY) ?? [],
  nextId: -1,
}

const localProductsSlice = createSlice({
  name: "localProducts",
  initialState,
  reducers: {
    addLocalProduct: (state, action: PayloadAction<Omit<Product, "id">>) => {
      const newProduct: Product = {
        ...action.payload,
        id: state.nextId,
      }
      state.items.push(newProduct)
      state.nextId -= 1

      // Persist to localStorage
      setToLS(LS_KEY, state.items)
    },

    updateLocalProduct: (state, action: PayloadAction<Product>) => {
      const index = state.items.findIndex((p) => p.id === action.payload.id)
      if (index !== -1) {
        state.items[index] = action.payload
        setToLS(LS_KEY, state.items)
      }
    },

    removeLocalProduct: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter((p) => p.id !== action.payload)
      setToLS(LS_KEY, state.items)
    },

    clearLocalProducts: (state) => {
      state.items = []
      state.nextId = -1
      setToLS(LS_KEY, [])
    },
  },
})

export const {
  addLocalProduct,
  updateLocalProduct,
  removeLocalProduct,
  clearLocalProducts,
} = localProductsSlice.actions

export default localProductsSlice.reducer
```

**Почему здесь?**

- ✅ Управление локальными продуктами = бизнес-логика
- ✅ `features/` = пользовательские действия (create, edit)
- ✅ Persistence внутри slice (синхронность)

---

#### **3.2 Селекторы (features/product-form/model/selectors.ts)**

```typescript
import { createSelector } from "@reduxjs/toolkit"
import type { RootState } from "@/shared/lib/store"

export const selectLocalProducts = (state: RootState) =>
  state.localProducts.items

export const selectLocalProductById = createSelector(
  [selectLocalProducts, (_state: RootState, id: number) => id],
  (products, id) => products.find((p) => p.id === id)
)

export const selectIsLocalProduct = createSelector(
  [(_state: RootState, id: number) => id],
  (id) => id < 0 // Local products have negative IDs
)
```

---

#### **3.3 Основная форма (features/product-form/ui/ProductForm/ProductForm.tsx)**

```typescript
"use client"

import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { productFormSchema, type ProductFormData } from "@/shared/lib/validations/product"
import { FormField, useFormSubmission } from "@/shared/lib/forms"

type ProductFormProps = {
  defaultValues?: Partial<ProductFormData>
  onSubmit: (data: ProductFormData) => void | Promise<void>
  submitLabel?: string
  isEdit?: boolean
}

export function ProductForm({
  defaultValues,
  onSubmit,
  submitLabel = "Submit",
  isEdit = false,
}: ProductFormProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productFormSchema),
    defaultValues,
  })

  const { handleSubmit: handleFormSubmit, isSubmitting, submitError } =
    useFormSubmission(onSubmit)

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <Controller
        name="title"
        control={control}
        render={({ field }) => (
          <FormField
            label="Product Title"
            error={errors.title?.message}
            required
          >
            <input
              {...field}
              type="text"
              className="w-full px-3 py-2 border rounded"
              placeholder="Enter product title"
            />
          </FormField>
        )}
      />

      <Controller
        name="price"
        control={control}
        render={({ field }) => (
          <FormField label="Price" error={errors.price?.message} required>
            <input
              {...field}
              type="number"
              step="0.01"
              className="w-full px-3 py-2 border rounded"
              placeholder="0.00"
              onChange={(e) => field.onChange(parseFloat(e.target.value))}
            />
          </FormField>
        )}
      />

      <Controller
        name="description"
        control={control}
        render={({ field }) => (
          <FormField
            label="Description"
            error={errors.description?.message}
            required
          >
            <textarea
              {...field}
              rows={4}
              className="w-full px-3 py-2 border rounded"
              placeholder="Enter product description"
            />
          </FormField>
        )}
      />

      <Controller
        name="category"
        control={control}
        render={({ field }) => (
          <FormField
            label="Category"
            error={errors.category?.message}
            required
          >
            <select {...field} className="w-full px-3 py-2 border rounded">
              <option value="">Select category</option>
              {/* Categories should be loaded dynamically */}
              <option value="electronics">Electronics</option>
              <option value="jewelery">Jewelery</option>
              <option value="men's clothing">Men's Clothing</option>
              <option value="women's clothing">Women's Clothing</option>
            </select>
          </FormField>
        )}
      />

      <Controller
        name="image"
        control={control}
        render={({ field }) => (
          <FormField label="Image URL" error={errors.image?.message} required>
            <input
              {...field}
              type="url"
              className="w-full px-3 py-2 border rounded"
              placeholder="https://example.com/image.jpg"
            />
          </FormField>
        )}
      />

      {submitError && (
        <div className="text-red-600 text-sm">{submitError}</div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {isSubmitting ? "Submitting..." : submitLabel}
      </button>
    </form>
  )
}
```

---

#### **3.4 Create Dialog (features/product-form/ui/CreateProductDialog/CreateProductDialog.tsx)**

```typescript
"use client"

import { useAppDispatch } from "@/shared/lib/hooks"
import { addLocalProduct } from "../../model/localProductsSlice"
import { formToProductInput, createLocalProduct } from "@/entities/product"
import type { ProductFormData } from "@/shared/lib/validations/product"
import { ProductForm } from "../ProductForm"

type CreateProductDialogProps = {
  onClose: () => void
}

export function CreateProductDialog({ onClose }: CreateProductDialogProps) {
  const dispatch = useAppDispatch()

  const handleCreate = (formData: ProductFormData) => {
    const input = formToProductInput(formData)
    const newProduct = createLocalProduct(input, -1) // Temp ID, will be replaced

    dispatch(addLocalProduct(newProduct))
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">Create New Product</h2>
        <ProductForm onSubmit={handleCreate} submitLabel="Create Product" />
        <button onClick={onClose} className="mt-2 text-gray-600">
          Cancel
        </button>
      </div>
    </div>
  )
}
```

---

#### **3.5 Edit Dialog (features/product-form/ui/EditProductDialog/EditProductDialog.tsx)**

```typescript
"use client"

import { useAppDispatch, useAppSelector } from "@/shared/lib/hooks"
import { updateLocalProduct } from "../../model/localProductsSlice"
import { selectLocalProductById } from "../../model/selectors"
import { productToFormData } from "@/entities/product"
import type { ProductFormData } from "@/shared/lib/validations/product"
import { ProductForm } from "../ProductForm"

type EditProductDialogProps = {
  productId: number
  onClose: () => void
}

export function EditProductDialog({ productId, onClose }: EditProductDialogProps) {
  const dispatch = useAppDispatch()
  const product = useAppSelector((state) =>
    selectLocalProductById(state, productId)
  )

  if (!product) return null

  const handleUpdate = (formData: ProductFormData) => {
    const updatedProduct = {
      ...product,
      ...formData,
    }

    dispatch(updateLocalProduct(updatedProduct))
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">Edit Product</h2>
        <ProductForm
          defaultValues={productToFormData(product)}
          onSubmit={handleUpdate}
          submitLabel="Update Product"
          isEdit
        />
        <button onClick={onClose} className="mt-2 text-gray-600">
          Cancel
        </button>
      </div>
    </div>
  )
}
```

---

### 4️⃣ **Интеграция с Redux Store**

**Файл:** `src/shared/lib/store.ts` (дополнить)

```typescript
import localProductsReducer from "@/features/product-form/model/localProductsSlice"

const rootReducer = combineSlices(baseApi, {
  favorites: favoritesReducer,
  filters: filtersReducer,
  pagination: paginationReducer,
  removed: removedReducer,
  localProducts: localProductsReducer, // 👈 Добавить
})
```

---

### 5️⃣ **Интеграция с ProductsWidget**

Локальные продукты должны объединяться с данными из API:

**Файл:** `src/widgets/products/ui/ProductsWidget/ProductsWidget.tsx` (изменить)

```typescript
import { useGetProductsQuery } from "@/entities/product"
import { selectLocalProducts } from "@/features/product-form/model/selectors"
import { useAppSelector } from "@/shared/lib/hooks"

export function ProductsWidget() {
  const { data: apiProducts, isLoading, error } = useGetProductsQuery()
  const localProducts = useAppSelector(selectLocalProducts)

  // Merge API + local products
  const allProducts = useMemo(() => {
    if (!apiProducts) return localProducts
    return [...localProducts, ...apiProducts]
  }, [apiProducts, localProducts])

  // ... rest of the component
}
```

---

## 🔄 Persistence стратегия

### Текущая схема

```typescript
// localStorage keys
"prod-showcase:favorites"      → number[]
"prod-showcase:deleted"        → number[]
"prod-showcase:createdLocal"   → Product[]  // 👈 Новый ключ
```

### Синхронизация

- **Запись:** В Redux action (`localProductsSlice`)
- **Чтение:** При инициализации store (`initialState`)
- **Очистка:** Через `reset-local-data` фичу

---

## 🧪 Тестирование

### Unit тесты

1. **Валидация (shared/lib/validations/product.test.ts)**
   - Проверка схемы на корректные данные
   - Проверка ошибок валидации
   - Граничные случаи (min/max длины, URL)

2. **Мапперы (entities/product/model/mappers.test.ts)**
   - `formToProductInput` — преобразование формы в input
   - `productToFormData` — заполнение формы из продукта
   - `createLocalProduct` — создание с temp ID

3. **Redux slice (features/product-form/model/localProductsSlice.test.ts)**
   - `addLocalProduct` — добавление с автоинкрементом ID
   - `updateLocalProduct` — обновление существующего
   - `removeLocalProduct` — удаление
   - Persistence в localStorage

### Integration тесты

4. **ProductForm (features/product-form/ui/ProductForm/ProductForm.test.tsx)**
   - Рендер полей
   - Валидация при submit
   - Вызов onSubmit с правильными данными

5. **CreateProductDialog (features/product-form/ui/CreateProductDialog/CreateProductDialog.test.tsx)**
   - Создание продукта → dispatch action
   - Закрытие диалога после создания

---

## 📋 Чеклист реализации

### Подготовка (shared/)

- [ ] Создать `shared/lib/validations/product.ts` с `productFormSchema`
- [ ] Экспортировать через `shared/lib/validations/index.ts`
- [ ] Убедиться, что `FormField` и `useFormSubmission` работают

### Сущность (entities/product/)

- [ ] Добавить типы `ProductCreateInput`, `ProductUpdateInput` в `types.ts`
- [ ] Добавить мапперы `formToProductInput`, `productToFormData`, `createLocalProduct` в `mappers.ts`
- [ ] Экспортировать через `entities/product/index.ts`

### Фича (features/product-form/)

- [ ] Создать `model/localProductsSlice.ts` с actions
- [ ] Создать `model/selectors.ts`
- [ ] Создать `ui/ProductForm/ProductForm.tsx`
- [ ] Создать `ui/CreateProductDialog/CreateProductDialog.tsx`
- [ ] Создать `ui/EditProductDialog/EditProductDialog.tsx`
- [ ] Экспортировать через `features/product-form/index.ts`

### Интеграция

- [ ] Добавить `localProductsReducer` в `store.ts`
- [ ] Обновить `ProductsWidget` для слияния API + local
- [ ] Обновить `reset-local-data` для очистки `createdLocal`

### Тестирование

- [ ] Unit тесты для валидации
- [ ] Unit тесты для мапперов
- [ ] Unit тесты для Redux slice
- [ ] Component тесты для ProductForm
- [ ] Integration тесты для Create/Edit dialogs

---

## 🎨 UX соображения

### Где размещать кнопки

1. **Create Product** — кнопка в `ProductsToolbar` (рядом с фильтрами)
2. **Edit Product** — кнопка в `ProductCard` (только для локальных продуктов)
3. **Delete Product** — существующая фича `remove-product` (работает для всех)

### Визуальные отличия

Локальные продукты должны быть визуально отличимы:

```typescript
// ProductCard.tsx
{isLocal && (
  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
    Local
  </span>
)}
```

### Ограничения

- Редактировать можно **только локальные продукты** (ID < 0)
- Продукты из API — **только просмотр и удаление**

---

## ❓ Вопросы к автору (Тенгу)

### 1. API интеграция

**Вопрос:** FakeStore API поддерживает POST/PUT для создания/редактирования продуктов, но это fake endpoints (не сохраняются). Нужно ли имитировать API вызовы или сразу только localStorage?

**Предложение:** Для MVP делать только localStorage, но заложить структуру для будущей интеграции с реальным API (через RTK Query mutations).

### 2. Editing scope

**Вопрос:** Разрешить редактирование **только локальных продуктов** или также продуктов из API (с сохранением изменений локально)?

**Предложение для портфолио:**

- **Вариант A (проще):** Редактировать только локальные
- **Вариант B (показывает навыки):** Редактировать любые, но изменения API-продуктов сохранять как "overrides" в localStorage

### 3. Form placement

**Вопрос:** Форма в диалоге (modal), отдельной странице или сайдбаре?

**Предложение:** Modal (Dialog) — современно, не требует роутинга, лучше UX.

### 4. Image upload

**Вопрос:** Загрузка изображений на сервер или только URL?

**Предложение для MVP:** Только URL (no file upload), это упрощает реализацию.

### 5. Category input

**Вопрос:** Выбор из существующих категорий или возможность создать новую?

**Предложение:** Select из динамических категорий (уже реализовано в Step 1), без создания новых.

---

## 🚀 Следующие шаги

После утверждения архитектуры:

1. **Stage 2C Step 7.1** — Validation schemas + mappers
2. **Stage 2C Step 7.2** — Redux slice + selectors
3. **Stage 2C Step 7.3** — ProductForm component
4. **Stage 2C Step 7.4** — Create/Edit dialogs
5. **Stage 2C Step 7.5** — Integration with ProductsWidget
6. **Stage 2C Step 7.6** — Tests
7. **Stage 2C Step 7.7** — UX polish (modal animations, local badge)

---

## 📚 Литература и референсы

- [React Hook Form + Zod](https://react-hook-form.com/get-started#SchemaValidation)
- [FSD: Features layer](https://feature-sliced.design/docs/reference/layers#features)
- [Redux Toolkit: Writing slices](https://redux-toolkit.js.org/tutorials/quick-start#create-a-redux-state-slice)
- Existing codebase examples:
  - [features/favorites](../src/features/favorites) — Redux + localStorage pattern
  - [shared/lib/forms](../src/shared/lib/forms) — Form components
  - [entities/product](../src/entities/product) — Mappers pattern

---

**Статус:** 🟡 Ожидает утверждения (Awaiting approval)
**Следующее действие:** Обсуждение архитектуры + ответы на вопросы
