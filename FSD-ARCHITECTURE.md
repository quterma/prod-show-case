# Feature-Sliced Design Architecture

This project follows Feature-Sliced Design (FSD) methodology for better code organization and maintainability.

## Directory Structure

```
src/
├── app/                    # App layer - app configuration and providers
│   ├── layout.tsx         # Root layout with providers
│   ├── page.tsx           # Root page
│   └── StoreProvider.tsx  # Redux store provider
│
├── pages/                 # Pages layer (empty - using App Router)
│
├── widgets/               # Widgets layer - complete UI blocks
│   └── products/          # Product-related widgets
│
├── features/              # Features layer - business functionality
│   └── product/           # Product features (create, edit, filter, etc.)
│
├── entities/              # Entities layer - business entities
│   └── product/           # Product entity
│
└── shared/                # Shared layer - reusable infrastructure
    ├── api/              # API configuration and base client
    ├── lib/              # Utilities, store, validations, etc.
    └── ui/               # Reusable UI components
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
