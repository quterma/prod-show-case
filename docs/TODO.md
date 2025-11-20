# TODO: Remaining Tasks

**Status:** Post Stage 2D (partial)
**Next:** Stage 2D completion → Stage 3 (UI Polish)

---

## 🔥 Stage 2D: Error Handling & Guards (Remaining)

### 1. ID Validation & 404 Handling

**Status:** ⚠️ Partial - only numeric validation exists

**Tasks:**

- [ ] Add comprehensive ID validation utility (`isValidProductId`)
  - Edge cases: empty, non-numeric, negative, zero, float, too large
- [ ] Call `notFound()` from `app/products/[id]/page.tsx` for invalid IDs
- [ ] Create `app/products/[id]/not-found.tsx` (product-specific 404)
- [ ] Test edge cases: `/products/abc`, `/products/-1`, `/products/999999`

**Files:**

- `app/products/[id]/page.tsx` - add validation before rendering
- `app/products/[id]/not-found.tsx` - create
- `shared/lib/validations/` - add `isValidProductId` utility (optional)

---

### 2. Global 404 Page

**Status:** ❌ Not implemented

**Tasks:**

- [ ] Create `app/not-found.tsx` (global 404)
- [ ] Use existing `EmptyState` or create minimal 404 UI
- [ ] Add "Go Home" button → `/products`

**Files:**

- `app/not-found.tsx` - create

---

### 3. Global Error Boundary

**Status:** ✅ **DONE** (19.11.2025)

- Created `app/error.tsx`
- Handles fatal errors with "Try again" + "Go Home" buttons
- Uses `EmptyState` component for consistent UI

**No action needed.**

---

### 4. localStorage Edge Cases

**Status:** ✅ **DONE** - Safe hydration with fallbacks

- `safeLoadFromStorage` handles corrupted JSON, type mismatches
- `ls.ts` has try/catch for quota exceeded
- Tests cover edge cases

**No action needed.**

---

### 5. Консистентность Error/Empty States

**Status:** ✅ **DONE**

- `ProductsWidget` handles: loading, error, emptyAPIData, emptyLocalData, emptyFavoriteData, emptyFilteredData
- `ProductDetailWidget` handles: loading, error, notFound, removed
- Local errors → `ErrorMessage` in widget
- Fatal errors → `app/error.tsx`

**Possible improvement (discuss):**

- When product is deleted on detail page → currently shows `EmptyState`
- **Options:**
  1. Keep current behavior (EmptyState inside widget)
  2. Call `notFound()` → show product-specific 404
  3. Redirect to `/products`

---

## 📋 Stage 3: UI Polish & UX (Planned)

### 3.1 Visual Design (Must Have)

- [ ] Tailwind theme (colors, typography, spacing)
- [ ] Responsive grid (mobile, tablet, desktop)
- [ ] Icons library (heroicons / lucide-react)
- [ ] Consistent spacing and alignment

### 3.2 UI States (Must Have)

- [ ] Improved Skeleton components (shimmer effects)
- [ ] Better error visuals (illustrations, friendly messages)
- [ ] Enhanced empty states (call-to-action buttons)

### 3.3 UX Components (Should Have)

- [ ] Toast notifications (create/delete success)
- [ ] Tooltips (button hints, filter info)
- [ ] Modal improvements (animations, backdrop blur, focus trap)

### 3.4 Animations (Optional)

- [ ] Framer Motion for page transitions
- [ ] Hover effects on product cards
- [ ] Skeleton fade-in
- [ ] Stagger animations for lists

### 3.5 Light/Dark Mode (Optional)

- [ ] Theme toggle button
- [ ] Persist theme in localStorage
- [ ] Tailwind dark: mode
- [ ] CSS variables for colors

### 3.6 Accessibility (Must Have)

- [ ] ARIA labels for all interactive elements
- [ ] Keyboard navigation (Tab, Enter, Esc)
- [ ] Focus indicators
- [ ] Lighthouse Accessibility score > 90

---

## 🧪 Stage 4: Testing & Production (Planned)

### 4.1 Test Coverage (Must Have)

**Targets:**

- Features: 80%+
- Widgets: 70%+
- Entities: 80%+

**Priority:**

- [ ] Filters (all combinations)
- [ ] Pagination (edge cases)
- [ ] LocalProducts (create/edit/delete)
- [ ] Favorites (toggle, cleanup)

### 4.2 E2E Tests (Should Have)

**Playwright tests:**

- [ ] Browse list → details → back
- [ ] Search → filter → paginate
- [ ] Create product → edit → delete
- [ ] Add to favorites → filter "only favorites"
- [ ] Reset local data → verify cleanup
- [ ] Invalid product ID → 404
- [ ] API error → fallback UI

### 4.3 SEO Metadata (Should Have)

- [ ] Dynamic title/description for product pages
- [ ] Open Graph tags
- [ ] Twitter cards
- [ ] Canonical URLs

### 4.4 Performance (Should Have)

**Lighthouse targets:**

- Performance: > 90
- Accessibility: > 90
- Best Practices: > 90
- SEO: > 90

**Optimizations:**

- [ ] next/image for all images
- [ ] Code splitting (React.lazy)
- [ ] Bundle analysis
- [ ] Prefetch critical routes

### 4.5 Deployment (Should Have)

- [ ] Vercel/GitHub Pages setup
- [ ] CI/CD pipeline
- [ ] Environment variables
- [ ] Preview deployments

---

## 🐛 Known Issues

### 1. Pagination Auto-correction

**Status:** ✅ **FIXED** (20.11.2025)

- Auto-correction logic moved to `usePagination` hook
- Widget no longer needs manual reset
- 8 unit tests cover edge cases

**Details:** See commit `491680e`

---

### 2. Deleted Product on Detail Page

**Status:** 🤔 **Needs Decision**

**Current behavior:**

- Product deleted → shows `EmptyState` inside widget

**Possible improvements:**

1. Keep current (EmptyState)
2. Call `notFound()` → product-specific 404
3. Redirect to `/products`

**Action:** Discuss and choose approach

---

## 🚀 Quick Wins

**Low-effort, high-impact tasks:**

1. Add global 404 page (`app/not-found.tsx`) - 15 min
2. Add product-specific 404 (`app/products/[id]/not-found.tsx`) - 15 min
3. ID validation in detail page - 30 min
4. Icons library setup (heroicons) - 20 min
5. Toast notifications (success/error) - 1 hour

---

## 📝 Notes

- **Stage 2D remaining:** ~1-2 hours work
- **Stage 3 (must-have):** ~3-5 days
- **Stage 4 (must-have):** ~2-3 days

**Next priority:** Complete Stage 2D (404 pages + ID validation)

---

**Last updated:** 20.11.2025
