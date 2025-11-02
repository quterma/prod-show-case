# Product Features

This folder contains product-related features according to Feature-Sliced Design (FSD) architecture.

## Structure

Features should be organized by business capabilities:

- `create-product/` - Product creation functionality
- `edit-product/` - Product editing functionality
- `delete-product/` - Product deletion functionality
- `filter-products/` - Product filtering and search
- `product-analytics/` - Product analytics and reporting

## Feature Structure

Each feature should contain:

- `model/` - Feature-specific state and business logic
- `api/` - Feature-specific API methods
- `ui/` - Feature UI components (forms, modals, etc.)
- `lib/` - Feature utilities and helpers

## Usage

Features are self-contained pieces of functionality that:

- Can be used in multiple widgets
- Have clear business purpose
- Don't depend on other features
- Can be developed and tested independently
