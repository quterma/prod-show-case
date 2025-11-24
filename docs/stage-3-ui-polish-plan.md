# Stage 3: UI Polish & UX

**Status:** Planned
**Timeline:** 3-5 days
**Dependencies:** Stage 2 (MVP) complete

---

## 1. Introduction

**Goal:** Transform MVP into a polished, production-ready UI with dark/light theme support, responsive design, consistent visual language, and enhanced UX feedback (toasts, animations).

**Key Decisions:**

- Icons: `lucide-react` (tree-shakable, lightweight)
- Toasts: `react-hot-toast` (4kb, zero dependencies)
- Theming: `next-themes` (SSR-safe, localStorage persistence)
- Animations: `tailwindcss-animate` (CSS-only, no Framer Motion)
- Images: `next/image` with aspect-square (1:1) for product cards
- Responsive: 1 column (mobile), 2 columns (tablet), 3 columns (desktop)

---

## 2. Current UI State Audit

### 2.1 Broken/Missing Components

**Skeleton** ([src/shared/ui/Skeleton/Skeleton.tsx](src/shared/ui/Skeleton/Skeleton.tsx)):

- Shows text `"Loading line 1"` instead of visual shimmer bars
- No animation effect

**ProductsGrid** ([src/widgets/products/ui/ProductsGrid/ProductsGrid.tsx](src/widgets/products/ui/ProductsGrid/ProductsGrid.tsx)):

- Not a grid layout — uses plain `<div>` wrapper
- No responsive breakpoints

**QueryFilter** ([src/features/filters/ui/QueryFilter/QueryFilter.tsx](src/features/filters/ui/QueryFilter/QueryFilter.tsx)):

- Uses undefined `className="search-input"` (class not in CSS)
- Native `<input>` without consistent styling

**EmptyState** ([src/shared/ui/EmptyState/EmptyState.tsx](src/shared/ui/EmptyState/EmptyState.tsx)):

- Minimal: only `<h3>` + `<p>` text
- No icon, no visual hierarchy

### 2.2 Hardcoded Colors (needs token migration)

**Button** ([src/shared/ui/Button/Button.tsx](src/shared/ui/Button/Button.tsx)):

- `primary`: `bg-blue-600 hover:bg-blue-700` → should use `bg-primary`
- `secondary`: `bg-gray-600 hover:bg-gray-700` → should use `bg-secondary`
- `outline`: `bg-white text-gray-700 border-gray-300` → should use semantic tokens

**ProductCard** ([src/entities/product/ui/ProductCard/ProductCard.tsx](src/entities/product/ui/ProductCard/ProductCard.tsx)):

- `border` (no color) → should use `border-border`
- `text-gray-600`, `text-gray-500` → should use `text-muted-foreground`
- No product image displayed (API provides `product.image`)
- No rating display (API provides `rating.rate` and `rating.count`)

**Modal** ([src/shared/ui/Modal/Modal.tsx](src/shared/ui/Modal/Modal.tsx)):

- Check if uses hardcoded colors or already compatible with tokens

### 2.3 Missing Features

- No theme toggle (dark/light mode UI control)
- No toast notifications for CRUD operations
- No product images in cards
- No responsive grid layout
- No visual feedback for loading states (shimmer)

---

## 3. Design System

### 3.1 Color Tokens (already defined in [src/app/globals.css](src/app/globals.css))

**Brand Colors:**

```css
--primary: #3b82f6 (blue-500) --primary-foreground: #ffffff --secondary: #f3f4f6
  (gray-100) --secondary-foreground: #1f2937 (gray-800) --destructive: #ef4444
  (red-500) --destructive-foreground: #ffffff --success: #10b981 (green-500)
  --success-foreground: #ffffff;
```

**Base Colors:**

```css
--background: #ffffff (light) / #09090b (dark) --foreground: #09090b (light) /
  #fafafa (dark) --card: #ffffff (light) / #09090b (dark)
  --card-foreground: #09090b (light) / #fafafa (dark) --muted: #f4f4f5 (light) /
  #27272a (dark) --muted-foreground: #71717a (light) / #a1a1aa (dark)
  --accent: #f4f4f5 (light) / #27272a (dark) --accent-foreground: #18181b
  (light) / #fafafa (dark) --border: #e4e4e7 (light) / #27272a (dark)
  --input: #e4e4e7 (light) / #27272a (dark) --ring: #3b82f6 (light) / #1d4ed8
  (dark);
```

**Radius:**

```css
--radius-lg: 0.5rem --radius-md: calc(0.5rem - 2px)
  --radius-sm: calc(0.5rem - 4px);
```

**Typography:**

```css
--font-sans: var(--font-geist-sans) --font-mono: var(--font-geist-mono);
```

### 3.2 Tailwind v4 Integration

All tokens exposed via `@theme inline` in [src/app/globals.css](src/app/globals.css):

- Use `bg-primary`, `text-foreground`, `border-border`, etc. in components
- Avoid hardcoded colors like `bg-blue-600`, `text-gray-500`

### 3.3 Dark Mode

**Implementation:**

- `next-themes` provider in [src/app/layout.tsx](src/app/layout.tsx)
- Theme class: `.dark` applied to `<html>` element
- Storage: `localStorage` key `theme` (system/light/dark)
- SSR-safe: `suppressHydrationWarning` on `<html>`

**Testing:**

- Every component must be tested in both light and dark modes
- Check contrast ratios (text on background must be readable)

---

## 4. Shared UI Kit Refactoring

### 4.1 Button (refactor existing)

**Location:** [src/shared/ui/Button/Button.tsx](src/shared/ui/Button/Button.tsx)

**Changes:**

```typescript
// Old (hardcoded)
primary: "bg-blue-600 text-white hover:bg-blue-700"

// New (tokens)
primary: "bg-primary text-primary-foreground hover:bg-primary/90"
secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80"
outline: "bg-background text-foreground border border-input hover:bg-accent"
ghost: "hover:bg-accent text-accent-foreground"
```

**Destructive variant (new):**

```typescript
destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90"
```

**Usage:** RemoveButton should use `variant="destructive"`

### 4.2 Input (new component)

**Location:** [src/shared/ui/Input/Input.tsx](src/shared/ui/Input/Input.tsx)

**API:**

```typescript
type InputProps = {
  // Core
  name: string
  type?: "text" | "email" | "password" | "number" | "search"
  value?: string
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void

  // Validation
  error?: string // Red border + error text below
  helperText?: string // Muted text below input
  required?: boolean // Show asterisk (*) in label

  // Layout
  label?: string // Label above input
  placeholder?: string
  fullWidth?: boolean // w-full or w-auto

  // Icon (left only for MVP)
  iconLeft?: React.ReactNode // Lucide icon (e.g., <Search />)

  // HTML passthrough
  disabled?: boolean
  autoFocus?: boolean
} & Omit<HTMLInputAttributes, "type" | "name">
```

**Styling:**

- Use `bg-background`, `text-foreground`, `border-input`
- Error state: `border-destructive`, `text-destructive`
- Focus: `ring-ring` (uses `--ring` token)
- Disabled: `opacity-50 cursor-not-allowed`

**React Hook Form integration:**

- Forward `ref` for `register()`
- Spread `...rest` for RHF props

### 4.3 Skeleton (refactor existing)

**Location:** [src/shared/ui/Skeleton/Skeleton.tsx](src/shared/ui/Skeleton/Skeleton.tsx)

**Changes:**

- Remove text `"Loading line {n}"`
- Add visual shimmer bars:
  ```tsx
  <div className="h-4 bg-muted rounded animate-pulse" />
  ```
- Use `tailwindcss-animate` for shimmer effect (already installed)

**API:**

```typescript
type SkeletonProps = {
  lines?: number // Number of skeleton lines (default: 3)
  className?: string // Custom height/width
}
```

**Usage in ProductsWidget:**

```tsx
<Skeleton lines={5} /> // Show 5 shimmer bars while loading
```

### 4.4 EmptyState (refactor existing)

**Location:** [src/shared/ui/EmptyState/EmptyState.tsx](src/shared/ui/EmptyState/EmptyState.tsx)

**Changes:**

- Add Lucide icon prop
- Improve layout: centered text, icon above title
- Use semantic colors: `text-muted-foreground` for description

**API:**

```typescript
type EmptyStateProps = {
  icon?: React.ReactNode // Lucide icon (e.g., <PackageOpen />)
  title?: string // Main message
  description?: string // Secondary text (was "note")
  action?: React.ReactNode // CTA button
}
```

**Default icon:** `<PackageOpen />` from Lucide (if no icon provided)

**Usage:**

```tsx
<EmptyState
  icon={<PackageOpen className="w-12 h-12 text-muted-foreground" />}
  title="No products found"
  description="Try adjusting your filters"
  action={<Button onClick={resetFilters}>Reset Filters</Button>}
/>
```

### 4.5 Card (new component)

**Location:** [src/shared/ui/Card/Card.tsx](src/shared/ui/Card/Card.tsx)

**Purpose:** Reusable wrapper for ProductCard, future widgets

**API:**

```typescript
type CardProps = {
  children: React.ReactNode
  className?: string
  onClick?: () => void
  hover?: boolean // Enable hover effect (shadow)
}
```

**Styling:**

```tsx
<div className="bg-card text-card-foreground border border-border rounded-lg p-4">
  {children}
</div>
```

**Hover effect (if `hover={true}`):**

```tsx
hover:shadow-lg transition-shadow cursor-pointer
```

### 4.6 Modal (verify dark mode)

**Location:** [src/shared/ui/Modal/Modal.tsx](src/shared/ui/Modal/Modal.tsx)

**Check:**

- Does backdrop use `bg-black/50` or token?
- Does modal content use `bg-background` and `text-foreground`?
- Does border use `border-border`?

**Expected changes (if needed):**

```tsx
// Backdrop
<div className="fixed inset-0 bg-black/50" />

// Modal content
<div className="bg-card text-card-foreground border border-border rounded-lg">
```

---

## 5. Components Polish

### 5.1 ProductCard (entities layer)

**Location:** [src/entities/product/ui/ProductCard/ProductCard.tsx](src/entities/product/ui/ProductCard/ProductCard.tsx)

**Changes:**

1. **Add product image:**

   ```tsx
   import Image from "next/image"

   ;<div className="relative aspect-square w-full overflow-hidden rounded-md bg-muted">
     <Image
       src={product.image}
       alt={product.title}
       fill
       className="object-cover"
     />
   </div>
   ```

2. **Migrate to Card component:**

   ```tsx
   import { Card } from "@/shared/ui/Card"

   ;<Card hover onClick={handleClick}>
     {/* content */}
   </Card>
   ```

3. **Use semantic tokens:**

   ```tsx
   // Old
   <p className="text-gray-600 mb-1">Price: ${product.price}</p>

   // New
   <p className="text-foreground mb-1">Price: ${product.price}</p>
   <p className="text-muted-foreground text-sm">Category: {product.category}</p>
   ```

4. **Optional: Rating display (can skip for MVP):**
   ```tsx
   {
     product.rating && (
       <div className="flex items-center gap-1 text-sm text-muted-foreground">
         <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
         <span>{product.rating.rate}</span>
         <span>({product.rating.count})</span>
       </div>
     )
   }
   ```

**DoD:** ProductCard shows image, uses semantic tokens, works in dark mode.

### 5.2 ProductsGrid (widgets layer)

**Location:** [src/widgets/products/ui/ProductsGrid/ProductsGrid.tsx](src/widgets/products/ui/ProductsGrid/ProductsGrid.tsx)

**Changes:**

```tsx
// Old
<div>
  {products.map(product => <ProductCard key={product.id} product={product} />)}
</div>

// New
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
  {products.map(product => <ProductCard key={product.id} product={product} />)}
</div>
```

**Breakpoints:**

- Mobile (< 640px): 1 column
- Tablet (640px - 1024px): 2 columns
- Desktop (≥ 1024px): 3 columns

**Gap:** `gap-4` (1rem) between cards

**DoD:** Grid responsive, cards align properly on all screen sizes.

### 5.3 QueryFilter (features layer)

**Location:** [src/features/filters/ui/QueryFilter/QueryFilter.tsx](src/features/filters/ui/QueryFilter/QueryFilter.tsx)

**Changes:**

```tsx
import { Input } from "@/shared/ui/Input"
import { Search } from "lucide-react"

// Old
<input
  type="search"
  value={localQuery}
  onChange={handleChange}
  placeholder="Search products..."
  className="search-input"
/>

// New
<Input
  type="search"
  name="search"
  value={localQuery}
  onChange={handleChange}
  placeholder="Search products..."
  iconLeft={<Search className="w-4 h-4 text-muted-foreground" />}
/>
```

**DoD:** QueryFilter uses Input component with search icon, no undefined classes.

### 5.4 Filters Toolbar (widgets layer)

**Location:** [src/widgets/products/ui/ProductsWidget/ProductsWidget.tsx](src/widgets/products/ui/ProductsWidget/ProductsWidget.tsx) (or separate Toolbar component)

**Changes:**

- Wrap filters in responsive flex container
- Mobile: stack vertically (`flex-col`)
- Desktop: horizontal row (`flex-row`)

**Example:**

```tsx
<div className="flex flex-col sm:flex-row gap-4 mb-6">
  <QueryFilter />
  <CategoryFilter />
  <PriceFilter />
  <RatingFilter />
  <ShowOnlyFavoritesToggle />
  <ResetFiltersButton />
  <ThemeToggle /> {/* NEW */}
</div>
```

**DoD:** Toolbar responsive, theme toggle integrated.

### 5.5 Pagination (features layer)

**Location:** [src/features/pagination/ui/Pagination/Pagination.tsx](src/features/pagination/ui/Pagination/Pagination.tsx)

**Changes:**

- Use Button component with `variant="outline"`
- Add icons: `<ChevronLeft />`, `<ChevronRight />` from Lucide
- Disable buttons properly (use `disabled` prop)

**Example:**

```tsx
<div className="flex items-center gap-2">
  <Button
    variant="outline"
    size="sm"
    onClick={handlePrevious}
    disabled={currentPage === 1}
  >
    <ChevronLeft className="w-4 h-4" />
    Previous
  </Button>

  <span className="text-sm text-muted-foreground">
    Page {currentPage} of {totalPages}
  </span>

  <Button
    variant="outline"
    size="sm"
    onClick={handleNext}
    disabled={currentPage === totalPages}
  >
    Next
    <ChevronRight className="w-4 h-4" />
  </Button>
</div>
```

**DoD:** Pagination uses Button component, icons, semantic tokens.

---

## 6. Theme Toggle

**Location:** [src/features/theme-toggle/ui/ThemeToggle/ThemeToggle.tsx](src/features/theme-toggle/ui/ThemeToggle/ThemeToggle.tsx)

**FSD Layer:** `features/theme-toggle` (user interaction feature)

**API:**

```tsx
export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      aria-label="Toggle theme"
    >
      {theme === "light" ? (
        <Moon className="w-4 h-4" />
      ) : (
        <Sun className="w-4 h-4" />
      )}
    </Button>
  )
}
```

**Icon Pattern:**

- Show **next** theme icon (if light mode → show Moon icon = "switch to dark")
- Sun icon: light mode
- Moon icon: dark mode

**Placement:** ProductsWidget toolbar (right side, after filters)

**SSR Handling:**

- `useTheme()` from `next-themes` is client-only
- Wrap ThemeToggle in `"use client"` directive
- No hydration mismatch (next-themes handles this)

**DoD:** Theme toggle works, persists in localStorage, no hydration errors.

---

## 7. Toast Integration

**Library:** `react-hot-toast` (already installed, provider in [src/app/ToastProvider.tsx](src/app/ToastProvider.tsx))

### 7.1 Toast Messages (fixed strings)

**Create Product:**

```tsx
toast.success("Product created successfully")
```

**Edit Product:**

```tsx
toast.success("Product updated")
```

**Delete Product:**

```tsx
toast.success("Product removed")
```

**API Error (optional, for Stage 4):**

```tsx
toast.error("Failed to load products")
```

### 7.2 Integration Points

**ProductFormDialog** ([src/widgets/product-form-dialog/ui/ProductFormDialogWidget.tsx](src/widgets/product-form-dialog/ui/ProductFormDialogWidget.tsx)):

```tsx
import toast from "react-hot-toast"

const handleSubmit = (data: ProductFormData) => {
  if (editMode) {
    dispatch(patchProduct({ id, patch: data }))
    toast.success("Product updated")
  } else {
    dispatch(addCreatedProduct(data))
    toast.success("Product created successfully")
  }
  onClose()
}
```

**RemoveButton** ([src/features/local-products/ui/RemoveButton/RemoveButton.tsx](src/features/local-products/ui/RemoveButton/RemoveButton.tsx)):

```tsx
import toast from "react-hot-toast"

const handleRemove = () => {
  if (isLocalProduct(productId)) {
    dispatch(removeCreatedProduct(productId))
  } else {
    dispatch(markAsDeleted(productId))
  }
  toast.success("Product removed")
}
```

**Toast Styling:** Already configured in `ToastProvider` to use semantic tokens (`--background`, `--foreground`, `--border`).

**DoD:** Toasts appear for create/edit/delete actions, use semantic tokens, position `bottom-right`.

---

## 8. Responsive Layout

### 8.1 Breakpoints (Tailwind defaults)

- `sm`: 640px (tablet)
- `md`: 768px
- `lg`: 1024px (desktop)
- `xl`: 1280px

### 8.2 Grid Layout

**ProductsGrid:**

- Mobile: `grid-cols-1`
- Tablet: `sm:grid-cols-2`
- Desktop: `lg:grid-cols-3`

### 8.3 Forms (ProductFormDialog)

**Modal width:**

- Mobile: full-width minus padding (`max-w-md`)
- Desktop: fixed width (`max-w-lg`)

**Input fields:**

- `fullWidth={true}` on mobile
- Auto-width on desktop (if needed)

### 8.4 Toolbar

**Filters toolbar:**

- Mobile: vertical stack (`flex-col`)
- Desktop: horizontal row (`sm:flex-row`)

**Buttons:**

- Mobile: full-width (`w-full sm:w-auto`)
- Desktop: auto-width

### 8.5 Padding & Spacing

**Page container:**

```tsx
<div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
```

**Gap between elements:**

- Small: `gap-2` (0.5rem)
- Medium: `gap-4` (1rem)
- Large: `gap-6` (1.5rem)

**DoD:** All layouts responsive, no horizontal scroll on mobile, readable on tablet/desktop.

---

## 9. Stage 3 Sub-stages

### 9A: Tokens & Theming (Day 1: 0.5-1 day)

**Tasks:**

1. Verify all tokens in [src/app/globals.css](src/app/globals.css) (already done)
2. Refactor Button to use semantic tokens
3. Verify Modal uses semantic tokens
4. Test all existing components in dark mode
5. Fix any contrast issues (text on background)

**DoD:**

- ✅ All UI components use semantic tokens (no `bg-blue-600`, `text-gray-500`)
- ✅ Dark mode works without visual bugs (test every page)
- ✅ High contrast in both themes (text readable)

**Deliverables:**

- Updated Button component
- Dark mode audit report (if issues found)

---

### 9B: Shared UI Primitives (Day 2: 1-1.5 days)

**Tasks:**

1. Create Input component with `label`, `error`, `iconLeft`
2. Refactor Skeleton to show shimmer bars
3. Refactor EmptyState to include Lucide icon
4. Create Card component (wrapper for ProductCard)
5. Add `destructive` variant to Button
6. Write unit tests for new components

**DoD:**

- ✅ Input component works with React Hook Form
- ✅ Skeleton shows visual shimmer (no text)
- ✅ EmptyState includes icon and better layout
- ✅ Card component reusable and styled
- ✅ All new components have tests

**Deliverables:**

- [src/shared/ui/Input/Input.tsx](src/shared/ui/Input/Input.tsx)
- [src/shared/ui/Input/Input.test.tsx](src/shared/ui/Input/Input.test.tsx)
- Updated Skeleton, EmptyState, Card components
- Tests passing (`pnpm test:run`)

---

### 9C: Components Polish & Responsive (Day 3-4: 1.5-2 days)

**Tasks:**

1. Add product images to ProductCard (next/image, aspect-square)
2. Migrate ProductCard to use Card component
3. Add responsive grid to ProductsGrid (1/2/3 columns)
4. Refactor QueryFilter to use Input component
5. Make filters toolbar responsive (vertical on mobile)
6. Update Pagination with icons and Button component
7. Test on mobile/tablet/desktop viewports

**DoD:**

- ✅ ProductCard shows image (next/image)
- ✅ ProductsGrid responsive (1/2/3 columns)
- ✅ QueryFilter uses Input with search icon
- ✅ Toolbar responsive (stacks on mobile)
- ✅ Pagination styled with icons
- ✅ No horizontal scroll on mobile
- ✅ All components use semantic tokens

**Deliverables:**

- Updated ProductCard, ProductsGrid, QueryFilter, Pagination
- Responsive layouts tested in browser dev tools
- Screenshots of mobile/tablet/desktop views (optional)

---

### 9D: Optional UX (Day 4-5: 0.5-1 day)

**Tasks:**

1. Create ThemeToggle component (features/theme-toggle)
2. Integrate ThemeToggle in ProductsWidget toolbar
3. Add toast notifications to create/edit/delete actions
4. Test toast positioning (bottom-right, no overlap with toggle)
5. Add subtle hover effects on ProductCard (optional)
6. Add shimmer animation to Skeleton (tailwindcss-animate)

**DoD:**

- ✅ ThemeToggle works (Sun/Moon icons, localStorage persistence)
- ✅ Toasts appear for create/edit/delete with correct messages
- ✅ No UI overlap (toast zone vs toggle)
- ✅ Animations smooth (no jank)

**Deliverables:**

- [src/features/theme-toggle/ui/ThemeToggle/ThemeToggle.tsx](src/features/theme-toggle/ui/ThemeToggle/ThemeToggle.tsx)
- Toast integration in ProductFormDialog and RemoveButton
- Theme toggle visible in toolbar

---

## 10. Out of Scope (Stage 4 candidates)

**Not included in Stage 3:**

- ❌ Tooltips (mentioned in TODO.md, but not critical for MVP)
- ❌ Modal animations (backdrop blur works, advanced animations later)
- ❌ Framer Motion (decided to use tailwindcss-animate only)
- ❌ Product rating display (API provides `rating.rate`, but can skip)
- ❌ Full accessibility audit (Lighthouse score > 90 is Stage 4)
- ❌ Toast undo action for delete (complex, requires temporary buffer)
- ❌ Stagger animations for product lists (nice-to-have)
- ❌ Page transitions (Next.js App Router doesn't need this)
- ❌ Warning tokens (`--warning`, `--warning-foreground`) — reserved for future

**Rationale:** Focus on core visual consistency, responsive design, and basic UX feedback. Advanced features can wait for Stage 4.

---

## 11. Risks & Mitigations

### Risk 1: Next/Image CORS with FakeStoreAPI

**Problem:** `next/image` may block external images from `fakestoreapi.com` due to missing remote patterns.

**Mitigation:**
Add to `next.config.ts`:

```ts
images: {
  remotePatterns: [
    {
      protocol: "https",
      hostname: "fakestoreapi.com",
    },
  ],
}
```

**Fallback:** If CORS still fails, use placeholder images or native `<img>` tag.

---

### Risk 2: Dark Mode Contrast Issues

**Problem:** Semantic tokens may produce low contrast in dark mode (e.g., `text-muted-foreground` on `bg-muted`).

**Mitigation:**

- Test every component in dark mode (Chrome DevTools: toggle `prefers-color-scheme`)
- Use contrast checker (WCAG AA: 4.5:1 for text, 3:1 for UI elements)
- Adjust token values in `globals.css` if needed

**Fallback:** Override specific components with higher contrast colors.

---

### Risk 3: Toast and ThemeToggle Overlap

**Problem:** Both toast and theme toggle positioned at bottom-right may overlap.

**Mitigation:**

- Toast: `bottom-right` (via ToastProvider config)
- ThemeToggle: toolbar (top of page)
- No overlap possible (different vertical zones)

**Fallback:** If overlap occurs, move toast to `bottom-center` or `top-right`.

---

### Risk 4: Mobile Toolbar Height

**Problem:** Vertical-stacked filters toolbar may be too tall on mobile (pushes content down).

**Mitigation:**

- Use collapsible filter panel (accordion) on mobile (Stage 4)
- For MVP: accept tall toolbar, ensure content scrollable

**Fallback:** Show "Filters" button that opens modal with filters (Stage 4 enhancement).

---

### Risk 5: Skeleton Shimmer Performance

**Problem:** CSS animations may cause jank on low-end devices.

**Mitigation:**

- Use `tailwindcss-animate` (lightweight, GPU-accelerated)
- Test on throttled CPU (Chrome DevTools: 4x slowdown)

**Fallback:** Disable shimmer animation, use static gray bars.

---

## 12. Final DoD for Stage 3

### Visual Consistency

- ✅ All components use semantic tokens (no hardcoded colors)
- ✅ Dark mode works on all pages (no contrast issues)
- ✅ Consistent spacing, borders, shadows across components

### Responsive Design

- ✅ ProductsGrid responsive (1/2/3 columns)
- ✅ Toolbar responsive (stacks on mobile)
- ✅ Forms responsive (full-width on mobile)
- ✅ No horizontal scroll on any screen size

### Component Quality

- ✅ ProductCard shows product image (next/image)
- ✅ Skeleton shows visual shimmer (no text)
- ✅ EmptyState includes icon and better layout
- ✅ Input component reusable (label, error, iconLeft)
- ✅ Button uses semantic tokens (including destructive variant)

### UX Feedback

- ✅ ThemeToggle functional (Sun/Moon icons, localStorage)
- ✅ Toasts appear for create/edit/delete actions
- ✅ Toast messages match specification (exact strings)

### Technical Quality

- ✅ All refactored components have tests
- ✅ No TypeScript errors (`pnpm tsc:check`)
- ✅ No ESLint warnings (`pnpm lint:check`)
- ✅ All tests pass (`pnpm test:run`)
- ✅ No console errors in browser (dev mode)

### Accessibility (Basic)

- ✅ ARIA labels on interactive elements (buttons, inputs)
- ✅ Alt text on product images
- ✅ Focus indicators visible (keyboard navigation)
- ✅ Modal focus trap works (ESC to close)

### Documentation

- ✅ Update [docs/TODO.md](docs/TODO.md) (mark Stage 3 complete)
- ✅ Update [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) if UI kit structure changed
- ✅ Add screenshots to [docs/stage-3-report.md](docs/stage-3-report.md) (optional)

---

## 13. Timeline Estimate

**Total:** 3-5 days (based on complexity and testing thoroughness)

| Sub-stage                | Tasks                                        | Time Estimate    |
| ------------------------ | -------------------------------------------- | ---------------- |
| 3A: Tokens & Theming     | Button refactor, dark mode audit             | 0.5-1 day        |
| 3B: Shared UI Primitives | Input, Skeleton, EmptyState, Card, tests     | 1-1.5 days       |
| 3C: Components Polish    | ProductCard images, grid responsive, toolbar | 1.5-2 days       |
| 3D: Optional UX          | ThemeToggle, toast integration               | 0.5-1 day        |
| **Total**                |                                              | **3.5-5.5 days** |

**Buffer:** 0.5 day for unexpected issues (CORS, contrast bugs, test failures)

---

## 14. Success Criteria

**Stage 3 is complete when:**

1. All sub-stage DoDs met (3A, 3B, 3C, 3D)
2. Final DoD checklist verified (section 12)
3. Visual regression test passed (compare before/after screenshots)
4. Code reviewed by second agent (Antigravity/Gemini)
5. Deployed to preview environment (Stage 4 task, but can start here)

**Next Step:** Stage 4 (Testing & Production) — see [docs/TODO.md](docs/TODO.md)

---

**Last updated:** 2025-11-24
**Author:** Claude Code (based on Tengu's specifications)
**Review Status:** Awaiting Tengu approval
