# Changelog

История изменений проекта.

---

## [Unreleased]

### Improved - Reset Local Data now resets filters

**Дата:** 2025-01-13

**Описание:** Reset Local Data теперь сбрасывает не только избранное и удаленные продукты, но и все активные фильтры.

**Изменения:**

- `resetLocalData` thunk теперь вызывает `resetFilters()` для сброса всех фильтров
- Добавлены unit-тесты для `resetLocalData` thunk (2 теста)
- Обновлена документация в `docs/features-overview.md`

**UX обоснование:**
После очистки локальных данных логично видеть полный список продуктов без активных фильтров. Например, фильтр "показывать только избранное" не имеет смысла после очистки избранного.

**Файлы:**

- `src/features/reset-local-data/model/resetLocalData.ts` - добавлен `resetFilters()`
- `src/features/reset-local-data/model/resetLocalData.test.ts` - новый файл с тестами
- `docs/features-overview.md` - обновлена документация

---

### Added - Remove Product Feature (Soft Delete)

**Дата:** 2025-01-13

**Описание:** Добавлена фича soft-delete для скрытия продуктов с персистентностью в localStorage.

**Изменения:**

1. **Новая фича `features/remove-product/`**
   - Redux slice `removedSlice` хранит массив ID удаленных продуктов
   - localStorage персистентность (ключ: `prod-showcase:removed`)
   - Действия: `toggleRemoved`, `addRemoved`, `removeRemoved`, `resetRemoved`
   - Селекторы: `makeSelectIsRemoved`, `makeSelectVisibleProducts`
   - Компонент `RemoveButton` с иконкой корзины и browser confirm

2. **Интеграция в карточки продуктов**
   - `ProductCard` - добавлен RemoveButton рядом с FavoriteToggle
   - `ProductDetailCard` - добавлен RemoveButton рядом с FavoriteToggle
   - Обе кнопки в `flex gap-1` контейнере в правом верхнем углу

3. **Фильтрация удаленных продуктов**
   - Новая функция `filterByRemoved` в `features/filters/lib/filterProducts.ts`
   - Интегрирована как ПЕРВЫЙ фильтр в каскаде (приоритет над всеми остальными)
   - Экспортирована через `features/filters/lib/index.ts`
   - Удаленные продукты скрыты везде, включая избранное

4. **Сброс данных**
   - Обновлен thunk `resetLocalData` для очистки удаленных продуктов
   - Теперь вызывает `resetFavorites()` и `resetRemoved()`

5. **Тесты**
   - Обновлены все тесты для включения `removed` reducer
   - Все 116 тестов проходят успешно

**Файлы:**

- `src/features/remove-product/model/removedSlice.ts` - новый
- `src/features/remove-product/model/selectors.ts` - новый
- `src/features/remove-product/ui/RemoveButton/RemoveButton.tsx` - новый
- `src/features/remove-product/index.ts` - новый
- `src/features/filters/lib/filterProducts.ts` - изменен
- `src/features/filters/model/selectors.ts` - изменен
- `src/features/reset-local-data/model/resetLocalData.ts` - изменен
- `src/shared/lib/store.ts` - добавлен removed reducer
- `src/entities/product/ui/ProductCard/ProductCard.tsx` - изменен
- `src/entities/product/ui/ProductDetailCard/ProductDetailCard.tsx` - изменен
- 7 тестовых файлов обновлены

---

### Refactored - Rename FavoriteButton to FavoriteToggle

**Дата:** 2025-01-13

**Описание:** Переименован компонент `FavoriteButton` в `FavoriteToggle` для единообразия с `ShowOnlyFavoritesToggle`.

**Изменения:**

- Удален старый артефакт `src/features/toggle-favorite/`
- Переименована директория `FavoriteButton/` → `FavoriteToggle/`
- Переименован компонент и тип пропсов
- Обновлены импорты в `ProductCard`, `ProductDetailCard`, тестах
- Обновлен публичный API `features/favorites/index.ts`

**Файлы:**

- `src/features/toggle-favorite/` - удалена вся директория
- `src/features/favorites/ui/FavoriteButton/` - переименована в `FavoriteToggle/`
- `src/features/favorites/ui/FavoriteToggle/FavoriteToggle.tsx` - переименован компонент
- `src/features/favorites/index.ts` - обновлен экспорт

---

### Refactored - Export Pattern Consistency

**Дата:** 2025-01-13

**Описание:** Все публичные API (`index.ts`) конвертированы на именные экспорты для явной документации, лучшего tree-shaking и предотвращения утечек.

**Изменения:**

1. **Features:**
   - `features/filters/index.ts` - именные экспорты + `export { default as filtersReducer }`
   - `features/filters/lib/index.ts` - именные экспорты функций фильтрации
   - `features/pagination/index.ts` - именные экспорты + `export { default as paginationReducer }`

2. **Entities:**
   - `entities/product/index.ts` - именные экспорты, исправлены имена мапперов
   - `entities/product/api/index.ts` - именные экспорты API и хуков
   - `entities/product/lib/index.ts` - именные экспорты хуков
   - `entities/product/model/index.ts` - именные экспорты типов и мапперов
   - `entities/product/ui/index.ts` - именные экспорты компонентов
   - Все вложенные `ui/*/index.ts` - именные экспорты

3. **Widgets:**
   - `widgets/products/index.ts` - именные экспорты компонентов

4. **Shared:**
   - `shared/lib/index.ts` - именные экспорты, удален несуществующий `UseFormSubmissionOptions`
   - `shared/ui/index.ts` - именные экспорты компонентов

**Обработка default exports:**
Reducers экспортируются как default в slice файлах, но реэкспортируются с именем в публичном API:

```typescript
export { default as filtersReducer } from "./model/filtersSlice"
export { default as paginationReducer } from "./model/paginationSlice"
```

**Файлы:** 28+ index.ts файлов обновлены

---

### Removed - README Files from src

**Дата:** 2025-01-13

**Описание:** Удалены разрозненные README файлы из папок src, информация консолидирована в docs.

**Изменения:**

- Удалены `src/entities/product/README.md`
- Удалены `src/shared/ui/README.md`
- Удалены `src/widgets/products/README.md`
- Создан `docs/features-overview.md` с консолидированной документацией всех фич
- Создан `docs/changelog.md` для истории изменений

**Причина:** Разрозненные README неудобны, вся документация теперь в `docs/`.

---

## [Previous] - Pagination Feature

**Дата:** 2025-01-12

Реализована фронтенд-пагинация с автоматическим сбросом при изменении фильтров через listener middleware.

---

## [Previous] - Filters Feature

**Дата:** 2025-01-11

Реализована комплексная система фильтрации с поиском (debounce), категориями, ценами, рейтингом и избранным.

---

## [Previous] - Favorites Feature

**Дата:** 2025-01-10

Реализована функциональность избранного с localStorage персистентностью и интеграцией в фильтры.
