# Product Entity

This folder contains the product entity according to Feature-Sliced Design (FSD) architecture.

## Structure

```
product/
├── model/
│   ├── types.ts       # Product types and interfaces (TODO)
│   ├── mappers.ts     # API DTO to domain mapping (TODO)
│   └── index.ts       # Public API
├── api/
│   ├── productsApi.ts # RTK Query endpoints (TODO: implement using baseApi.injectEndpoints)
│   └── index.ts       # Public API
├── lib/
│   └── index.ts       # Product-specific helpers (TODO)
├── ui/
│   ├── ProductCard.tsx # Product display component (TODO)
│   └── index.ts        # Public API
└── index.ts           # Main Public API
```

## Current Status

**Status:** Baseline structure created, implementation pending

All files contain TODO markers and stub implementations. No business logic or API calls implemented yet.

## Usage

Import from this entity when you need basic product functionality:

```typescript
import { Product, ProductCard } from "@/entities/product"
```
