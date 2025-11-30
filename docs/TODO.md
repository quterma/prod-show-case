# Portfolio Improvements TODO

**Current Status:** MVP Complete + UI Polish ✅ + Deployed to Vercel ✅

---

## 🚀 Priority 1: Essential

### 1. Add Screenshots to README - DONE

---

### 2. Add Dynamic SEO Metadata - DONE

---

### 3. Run Lighthouse Audit - DONE

---

## ⭐ Priority 2: Recommended (Week 2, 6-10 hours)

### 4. Comprehensive E2E Tests (4-6 hours)

- [ ] Product CRUD flow (`e2e/product-crud.spec.ts`)
- [ ] Filters flow (`e2e/filters.spec.ts`)
- [ ] Favorites flow (`e2e/favorites.spec.ts`)
- [ ] Theme persistence (`e2e/theme.spec.ts`)
- [ ] Mobile responsive (`e2e/mobile.spec.ts`)
- [ ] Accessibility (`e2e/accessibility.spec.ts`)

**Why:** E2E tests show understanding of user journeys. Strong differentiator.

---

### 5. Analytics Integration (1-2 hours)

- [ ] Add Vercel Analytics or Google Analytics 4
- [ ] Track events: `product_view`, `favorite_added`, `product_created`, `filter_used`

**Why:** Shows data-driven thinking.

---

### 6. Architecture Diagram (2 hours)

- [ ] Create FSD layer + data flow diagram (Mermaid/draw.io)
- [ ] Add to `docs/ARCHITECTURE.md`

**Why:** Visuals help non-technical recruiters understand architecture.

---

### 7. Test Coverage (1 hour)

- [ ] Run `pnpm test:coverage`
- [ ] Add coverage badge to README
- [ ] Target: 80%+ for features/entities

**Why:** Coverage metrics show testing discipline.

---

## 🌟 Priority 3: Advanced (Optional, 8+ hours)

### 8. Accessibility Improvements (3-4 hours)

- [ ] Add `aria-describedby` to form inputs
- [ ] Add "Skip to content" link
- [ ] Improve focus indicators
- [ ] Test with screen reader
- [ ] Target: Lighthouse Accessibility > 95

---

### 9. Storybook (4-6 hours)

- [ ] Install Storybook
- [ ] Create stories for shared UI (Button, Input, Card, Modal, Skeleton)
- [ ] Deploy to Chromatic or GitHub Pages

**Why:** Shows design system thinking.

---

### 10. Internationalization (3-4 hours)

- [ ] Install `next-intl`
- [ ] Add English + 1 language
- [ ] Add language switcher

**Why:** Shows scalability thinking.

---

### 11. Web Vitals Tracking (2 hours)

- [ ] Track LCP, FID, CLS
- [ ] Use Vercel Analytics or custom dashboard

---

### 12. API Mocking with MSW (2 hours)

- [ ] Install MSW
- [ ] Create handlers for FakeStore API
- [ ] Use in E2E tests

---

## 🎯 Portfolio Enhancements

### README

- [ ] Add "Why I Built This" section
- [ ] Add "Tech Highlights" (FSD, Smart Widgets, RTK Query)
- [ ] Add "Challenges & Solutions" (SSR hydration, localStorage)

### GitHub Repository

- [ ] Add topics: `nextjs`, `react`, `typescript`, `redux-toolkit`, `fsd`, `portfolio`
- [ ] Pin repository to profile

---

**Last Updated:** 2025-11-30
