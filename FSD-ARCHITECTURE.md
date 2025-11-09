# Feature-Sliced Design Architecture

This project follows Feature-Sliced Design (FSD) methodology for better code organization and maintainability.

## Directory Structure

```
src/
├── app/                    # App layer - app configuration and providers
│   ├── layout.tsx         # Root layout with providers
│   ├── page.tsx           # Root page
│   ├── StoreProvider.tsx  # Redux store provider
│   └── globals.css        # Global styles
│
├── widgets/               # Widgets layer - complete UI blocks
│   └── products/          # Product catalog widgets
│       ├── ui/            # ProductsGrid, ProductsToolbar, ProductsSkeleton (TODO)
│       └── index.ts
│
├── features/              # Features layer - business functionality
│   ├── toggle-favorite/   # Favorite products feature (TODO)
│   ├── remove-product/    # Remove products feature (TODO)
│   ├── search/            # Search with debounce (TODO)
│   └── pagination/        # Front-end pagination (TODO)
│
├── entities/              # Entities layer - business entities
│   └── product/           # Product entity
│       ├── model/         # types.ts, mappers.ts (TODO)
│       ├── api/           # productsApi.ts - RTK Query (TODO)
│       ├── lib/           # Product helpers (TODO)
│       ├── ui/            # ProductCard.tsx (TODO)
│       └── index.ts
│
└── shared/                # Shared layer - reusable infrastructure
    ├── api/               # baseApi.ts - RTK Query base config
    ├── lib/               # Store, hooks, forms, validations
    │   ├── store.ts
    │   ├── hooks.ts
    │   ├── forms/         # FormField, FormError, useFormSubmission
    │   ├── validations/   # Zod schemas
    │   └── persist/       # ls.ts - localStorage helpers (TODO)
    └── ui/                # Skeleton.tsx - basic UI atoms
```

## Layer Rules

1. **Higher layers can import from lower layers**
2. **Lower layers cannot import from higher layers**
3. **Layers on the same level cannot import from each other**

## Import Rules

- ✅ `widgets` → `features`, `entities`, `shared`
- ✅ `features` → `entities`, `shared`
- ✅ `entities` → `shared`
- ❌ `shared` → any other layer
- ❌ `entities` → `features` or `widgets`

## Getting Started

1. Start building in `shared/` - add UI components and utilities
2. Create entities in `entities/` - define business objects
3. Build features in `features/` - implement business functionality
4. Compose widgets in `widgets/` - combine features into UI blocks
5. Use widgets on pages in `app/` - compose the application

For more information about FSD, visit: https://feature-sliced.design/
