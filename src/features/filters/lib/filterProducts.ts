import type { Product } from "@/entities/product/model"

/**
 * Filter products by search query (case-insensitive)
 * Searches in product title and description
 */
export function filterBySearch(products: Product[], query: string): Product[] {
  if (!query.trim()) return products

  const lowerQuery = query.toLowerCase()

  return products.filter(
    (product) =>
      product.title.toLowerCase().includes(lowerQuery) ||
      product.description.toLowerCase().includes(lowerQuery)
  )
}

/**
 * Filter products by category
 * TODO: Implement category filtering when needed
 */
export function filterByCategory(
  products: Product[],
  category: string | null
): Product[] {
  if (!category) return products

  // TODO: Implement filtering logic
  return products
}

/**
 * Filter products by favorites status
 * TODO: Implement favorites filtering when needed
 */
export function filterByFavorites(
  products: Product[],
  showOnlyFavorites: boolean
): Product[] {
  if (!showOnlyFavorites) return products

  // TODO: Implement filtering logic (needs favorites state from store)
  return products
}

/**
 * Filter products by price range
 * TODO: Implement price filtering when needed
 */
export function filterByPrice(
  products: Product[],
  minPrice: number | null,
  maxPrice: number | null
): Product[] {
  if (minPrice === null && maxPrice === null) return products

  // TODO: Implement filtering logic
  return products
}
