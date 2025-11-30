# Product Showcase

**Live Demo:** [https://prod-show-case.vercel.app/](https://prod-show-case.vercel.app/)

A modern, production-ready product showcase application built with Next.js 16, React 19, and Feature-Sliced Design (FSD) architecture. This project demonstrates scalable frontend architecture, advanced state management, and comprehensive testing practices.

---

## 🚀 Tech Stack

### Core

- **Next.js 16** (App Router)
- **React 19** with modern features
- **TypeScript** strict mode
- **Tailwind CSS v4** with semantic design tokens

### Architecture & State

- **Feature-Sliced Design (FSD)** for maintainable architecture
- **Redux Toolkit + RTK Query** for state management & API
- Custom localStorage persistence with SSR-safe hydration

### Forms & Validation

- **React Hook Form** + **Zod** schemas
- Real-time validation with custom field components

### Testing

- **Vitest** (174+ unit/component tests)
- **Playwright** (E2E tests)
- **Pre-commit hooks** (Husky + lint-staged)

---

## 📋 Features

### Product Management

- Browse products from FakeStore API
- Create/edit local products with form validation
- Soft-delete API products, hard-delete local products
- Product detail pages with full CRUD operations

### Advanced Filtering & Search

- Debounced search (300ms) - title/description
- Multi-select category filter
- Price range slider (dynamic min/max)
- Rating threshold filter
- "Show only favorites" toggle
- Reset all filters

### Favorites & Persistence

- Add/remove favorites with localStorage persistence
- Auto-cleanup when products deleted
- SSR-safe hydration (no flash of wrong state)

### UI/UX

- Dark/light theme toggle (next-themes)
- Toast notifications for CRUD operations
- Responsive grid (1/2/3 columns on mobile/tablet/desktop)
- Loading skeletons with shimmer effect
- Error boundaries & empty states
- Confirmation modals for destructive actions

### Developer Experience

- Smart Widgets pattern (data fetching isolated in widgets)
- View Hooks Aggregators (`useProductsView`, `useProductView`)
- Factory selectors for memoization
- Strict FSD layer rules (enforced via ESLint)

---

## 🏛️ Architecture

This project follows **Feature-Sliced Design (FSD)** principles:

```
src/
├── app/        # Next.js routes, providers, global config
├── widgets/    # Smart UI blocks (ProductsWidget, ProductDetailWidget)
├── features/   # Business logic (filters, favorites, pagination, forms)
├── entities/   # Business models (product entity, API, mappers)
└── shared/     # Reusable infrastructure (UI, utils, API config)
```

**Key Principles:**

- Layered imports: Higher layers import from lower layers only
- Widgets own data fetching, pages are thin routing layers
- Custom middleware for selective localStorage persistence
- RTK Query with `baseApi.injectEndpoints()` pattern

See **[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)** for detailed architecture overview.

---

## 🛠️ Quick Start

### Prerequisites

- Node.js 18+
- pnpm (recommended)

### Installation & Development

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev
# Open http://localhost:3000
```

### Testing

```bash
# Unit/component tests (watch mode)
pnpm test

# Unit tests (CI mode)
pnpm test:run

# E2E tests (Playwright)
pnpm test:e2e

# Test coverage report
pnpm test:coverage
```

### Code Quality

```bash
# Lint & auto-fix
pnpm lint

# Format code (Prettier)
pnpm format

# Type check
pnpm type-check
```

---

## 📚 Documentation

- **[CLAUDE.md](CLAUDE.md)** - Development guidelines for Claude Code
- **[Architecture](docs/ARCHITECTURE.md)** - FSD architecture, data flow, key decisions
- **[TODO](docs/TODO.md)** - Portfolio improvements roadmap

---

## 🎯 Key Highlights

### Architecture Excellence

- **FSD implementation** with strict layer rules (app → widgets → features → entities → shared)
- **Smart Widgets pattern**: Data fetching isolated in widgets, pages stay thin
- **Custom persistence middleware**: Selective localStorage sync for `favorites` + `localProducts`

### State Management

- **RTK Query** with automatic caching & request deduplication
- **SSR-safe hydration**: `createPreloadedState()` prevents hydration mismatches
- **Factory selectors**: Memoized selectors for `isRemoved`, `isFavorite` checks

### Testing Culture

- **174+ tests** across entities, features, widgets, shared utils
- **Pre-commit hooks** run Prettier + ESLint + Vitest on staged files
- **E2E tests** for critical user journeys

### Production Patterns

- Error boundaries (global + route-level)
- Loading states (skeletons with shimmer)
- Empty states with helpful CTAs
- Toast notifications for CRUD feedback
- Confirmation modals for destructive actions
- Theme persistence across reloads

---

## 📦 Project Status

**Stage:** MVP Complete + UI Polish ✅
**Deployment:** Vercel (auto-deploy on push to main)
**Tests:** 174 unit/component tests passing

**Implemented:**

- ✅ Products list & detail pages
- ✅ Search (debounced), filters (category, price, rating), pagination
- ✅ Favorites with localStorage persistence
- ✅ Local products (create/edit/delete) with form validation
- ✅ Dark/light theme toggle
- ✅ Toast notifications
- ✅ Error boundaries, 404 page, empty states
- ✅ Responsive design (mobile/tablet/desktop)

**Next Steps:** See [docs/TODO.md](docs/TODO.md) for portfolio improvements (screenshots, SEO, E2E tests, analytics).

---

## 🔗 External Resources

- [FakeStore API](https://fakestoreapi.com) - Data source
- [Feature-Sliced Design](https://feature-sliced.design) - Architecture methodology
- [Next.js Documentation](https://nextjs.org/docs)
- [Redux Toolkit](https://redux-toolkit.js.org/)

---

## 📄 License

This is a portfolio/test assignment project.

---

**Built with 💻 by [Your Name]**
**Last Updated:** 2025-11-30
