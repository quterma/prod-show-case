# ProductImage Component

A robust, reusable image component with built-in loading, error handling, and fallback states for product images.

## Features

- ✅ **Loading State**: Shows skeleton animation while image loads
- ✅ **Error Handling**: Gracefully handles 404, invalid URLs, and network errors
- ✅ **Empty State**: Displays placeholder for empty/missing image URLs
- ✅ **Next.js Optimization**: Uses Next.js Image for automatic optimization
- ✅ **Theme Support**: Works seamlessly in light and dark modes
- ✅ **Customizable**: Supports custom className and fallback messages

## Usage

```tsx
import { ProductImage } from "@/shared/ui"

// Basic usage
<ProductImage src={product.image} alt={product.title} />

// With custom fallback message
<ProductImage
  src={product.image}
  alt={product.title}
  fallbackMessage="No image available"
/>

// With priority loading (for above-the-fold images)
<ProductImage
  src={product.image}
  alt={product.title}
  priority
/>

// With custom className
<ProductImage
  src={product.image}
  alt={product.title}
  className="mb-4"
/>
```

## API

| Prop              | Type      | Default                                                      | Description                         |
| ----------------- | --------- | ------------------------------------------------------------ | ----------------------------------- |
| `src`             | `string`  | **required**                                                 | Image URL                           |
| `alt`             | `string`  | **required**                                                 | Alt text for accessibility          |
| `className`       | `string`  | `undefined`                                                  | Additional CSS classes              |
| `fallbackMessage` | `string`  | `"Image not available"`                                      | Text shown when image fails to load |
| `priority`        | `boolean` | `false`                                                      | Next.js Image priority loading      |
| `sizes`           | `string`  | `"(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"` | Next.js responsive image sizes      |

## Edge Cases Handled

1. **Empty URL**: Shows placeholder immediately
2. **404 Error**: Shows placeholder after failed load
3. **Invalid Image Format**: Shows placeholder after error
4. **Network Error**: Shows placeholder after timeout
5. **Slow Loading**: Shows skeleton until image loads

## Replaced Components

This component replaces direct Next.js `<Image>` usage in:

- [ProductCard](../../entities/product/ui/ProductCard/ProductCard.tsx)
- [ProductDetailCard](../../entities/product/ui/ProductDetailCard/ProductDetailCard.tsx)

## Testing

Comprehensive test coverage includes:

- Loading state with skeleton
- Successful image load
- Empty src handling
- Error state handling
- Custom fallback messages
- Custom className support
- Priority and sizes props

Run tests:

```bash
pnpm test:run ProductImage
```
