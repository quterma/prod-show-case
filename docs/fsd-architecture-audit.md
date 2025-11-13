# FSD Architecture — Issues & Recommendations

> Last updated: 2025-11-13
> Status: Production Ready (0 critical issues)

## ✅ Recently Completed

### Pagination Bounds Validation

**Completed:** 2025-11-13
**Implementation:** State-level validation with `maxPage` field in Redux

**Changes:**

- Added `maxPage: number | null` to `PaginationState` ([paginationSlice.ts:8](../src/features/pagination/model/paginationSlice.ts#L8))
- `setPage` clamps between 1 and `maxPage` ([paginationSlice.ts:21-30](../src/features/pagination/model/paginationSlice.ts#L21-L30))
- `setMaxPage` action auto-corrects `currentPage` if out of bounds ([paginationSlice.ts:32-37](../src/features/pagination/model/paginationSlice.ts#L32-L37))
- ProductsWidget syncs `totalPages` → `maxPage` via useEffect ([ProductsWidget.tsx:51-53](../src/widgets/products/ui/ProductsWidget/ProductsWidget.tsx#L51-L53))
- Full test coverage (15 tests) ([paginationSlice.test.ts](../src/features/pagination/model/paginationSlice.test.ts))

**Result:** Cannot set page 999 when only 2 pages exist — properly clamped to valid range.

### Redux Selectors Memoization

**Status:** Already implemented correctly
**Location:** [ProductsWidget.tsx:40-44](../src/widgets/products/ui/ProductsWidget/ProductsWidget.tsx#L40-L44)

Selectors are wrapped in `useMemo(() => makeSelector(), [])` — creates stable instance per component, memoization works correctly.

---

## 🔴 Critical (blocks forms development)

### 1. API Error Handling

**Problem:** No centralized API error handling
**Location:** All widgets show generic "Failed to load"

**Solution:**

```typescript
// shared/lib/api-errors/handleApiError.ts
export const handleApiError = (error: unknown) => {
  if (isFetchBaseQueryError(error)) {
    const status = "status" in error ? error.status : null
    if (status === 404) return { message: "Resource not found" }
    if (status === 500) return { message: "Server error" }
    return { message: "data" in error ? error.data : "API error" }
  }
  return { message: "Network connection failed" }
}
```

**Time:** 1-2h
**Blocks:** Proper error handling in create/edit forms

---

### 2. Missing UI Components

**Problem:** No Input, Modal, Toast in shared/ui
**Needed for:** Product create/edit forms

**Solution:**

```
shared/ui/
├── Input/
│   ├── Input.tsx          # text, number, textarea + validation errors
│   └── Input.test.tsx
├── Modal/
│   ├── Modal.tsx          # backdrop, ESC close, a11y
│   └── Modal.test.tsx
└── Toast/
    ├── Toast.tsx          # auto-dismiss, top-right, success/error/info
    └── Toast.test.tsx
```

**Time:** 2-3h
**Blocks:** Create/edit product forms

---

## 🟡 High Priority (UX improvements)

### 3. Pagination — Page Numbers

**Problem:** Only Prev/Next buttons, no quick navigation
**Location:** `features/pagination/ui/Pagination.tsx`

**Solution:**

```tsx
<div className="flex gap-1">
  <button onClick={() => setPage(1)}>1</button>
  {currentPage > 3 && <span>...</span>}
  {pages.map((p) => (
    <button
      key={p}
      onClick={() => setPage(p)}
      className={p === currentPage ? "active" : ""}
    >
      {p}
    </button>
  ))}
  {currentPage < totalPages - 2 && <span>...</span>}
  <button onClick={() => setPage(totalPages)}>{totalPages}</button>
</div>
```

**Logic:** Show current +/- 1 page, first, last
**Time:** 1h

---

---

## 🟢 Medium Priority (future improvements)

### 4. Performance Optimization

**Problems:**

- No lazy loading for widgets
- No code splitting by features
- Everything loads upfront

**Solution:**

```tsx
// Lazy loading widgets
const ProductsWidget = dynamic(() =>
  import("@/widgets/products").then((m) => ({ default: m.ProductsWidget }))
)

// Code splitting features
const FilterToolbar = dynamic(() =>
  import("@/features/filters").then((m) => ({ default: m.FilterToolbar }))
)
```

**Time:** 2-3h
**Benefit:** Faster initial load (especially mobile)

---

### 5. Feature Flags

**Problem:** No A/B testing or gradual rollout mechanism

**Solution:**

```typescript
// shared/lib/feature-flags/useFeatureFlag.ts
export function useFeatureFlag(flag: string): boolean {
  return flags[flag] ?? false
}

// Usage
const showNewPagination = useFeatureFlag("new-pagination-ui")
```

**Time:** 1-2h
**Benefit:** Safer feature releases

---

### 6. Internationalization (i18n)

**Problem:** Hardcoded English text everywhere
**Location:** All UI components (buttons, labels, errors)

**Solution:**

```typescript
// shared/lib/i18n/useTranslation.ts
export function useTranslation() {
  const locale = useLocale() // 'en' | 'ru'
  return (key: string) => translations[locale][key]
}

// Usage
const t = useTranslation()
<button>{t('filters.reset')}</button>
```

**Time:** 4-6h (including translations)
**Needed for:** International markets

---

## 🔵 Low Priority (long-term)

### 7. Storybook

**Purpose:** UI component documentation, visual regression testing
**Time:** 3-4h setup + stories for all components
**When:** After component API stabilizes

### 8. Design System

**Purpose:** Unified tokens (colors, spacing, typography)
**Time:** 1-2 weeks
**When:** When designer joins team

### 9. Microfrontend Readiness

**Purpose:** Module federation, independent feature deployment
**Time:** 2-4 weeks
**When:** Scaling to multiple teams

---

## Priority Table

| #   | Task                    | Priority    | Complexity | Time | Blocks       |
| --- | ----------------------- | ----------- | ---------- | ---- | ------------ |
| 1   | API Error Handling      | 🔴 Critical | Low        | 1-2h | Forms        |
| 2   | Input/Modal/Toast UI    | 🔴 Critical | Medium     | 2-3h | Forms        |
| 3   | Pagination page numbers | 🟡 High     | Low        | 1h   | UX           |
| 4   | Lazy loading            | 🟢 Medium   | Medium     | 2-3h | Performance  |
| 5   | Feature flags           | 🟢 Medium   | Low        | 1-2h | A/B tests    |
| 6   | i18n                    | 🟢 Medium   | High       | 4-6h | Localization |
| 7   | Storybook               | 🔵 Low      | Medium     | 3-4h | DevUX        |
| 8   | Design system           | 🔵 Low      | High       | 1-2w | Consistency  |
| 9   | Microfrontend           | 🔵 Low      | Very High  | 2-4w | Scale        |

---

## Action Plan

### Week 1 (Critical — unblock forms)

1. API Error Handling (1-2h)
2. Input/Modal/Toast components (2-3h)
3. Create/edit forms implementation

### Week 2 (UX improvements)

4. Pagination with page numbers (1h)

### Later (when needed)

- Performance: lazy loading, code splitting
- Feature flags for A/B testing
- i18n for localization
- Storybook for component docs
- Design system when designer available
