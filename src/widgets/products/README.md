# Products Widgets

This folder contains product-related widgets according to Feature-Sliced Design (FSD) architecture.

## Structure

Widgets are complete UI blocks that combine multiple features:

- `products-catalog/` - Complete product catalog with filtering and pagination
- `product-dashboard/` - Admin dashboard for product management
- `product-comparison/` - Product comparison widget
- `recommended-products/` - Product recommendations widget

## Widget Structure

Each widget should contain:

- `model/` - Widget-specific state management
- `ui/` - Widget main component and sub-components
- `lib/` - Widget utilities and configuration
- `api/` - Widget-specific API orchestration (if needed)

## Usage

Widgets are:

- Complete UI blocks ready to use on pages
- Composition of multiple features and entities
- Self-sufficient and can work independently
- The main building blocks for pages

Import widgets directly on your pages to build the application UI.
