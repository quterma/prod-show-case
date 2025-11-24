# TODO: Remaining Tasks

**Status:** Stage 2 Complete (MVP Done)
**Next:** Stage 3 (UI Polish) or Stage 4 (Production)

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

## 🚀 Quick Wins

**Low-effort, high-impact tasks for Stage 3:**

1. Icons library setup (heroicons/lucide) - 20 min
2. Toast notifications (success/error) - 1 hour
3. Improved skeleton shimmer effects - 30 min
4. Better empty state illustrations - 1 hour
5. Responsive grid improvements - 1 hour

---

## 📝 Notes

- **Stage 2:** ✅ Complete (MVP done)
- **Stage 3 (must-have):** ~3-5 days
- **Stage 4 (must-have):** ~2-3 days

**Next priority:** Stage 3 (UI Polish) or Stage 4 (Production Ready)

---

**Last updated:** 2025-11-20
