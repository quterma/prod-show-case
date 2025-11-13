import type { Product } from "@/entities/product/model"

/**
 * Filter out removed products
 * Returns only visible (non-removed) products
 * Should be applied FIRST in the filter chain
 */
export function filterByRemoved(
  products: Product[],
  removedIds: number[]
): Product[] {
  if (removedIds.length === 0) return products

  return products.filter((product) => !removedIds.includes(product.id))
}

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
 * Filter products by selected categories (multi-select)
 * Returns products that match ANY of the selected categories
 */
export function filterByCategories(
  products: Product[],
  categories: string[]
): Product[] {
  if (categories.length === 0) return products

  return products.filter((product) => categories.includes(product.category))
}

/**
 * Filter products by minimum rating
 * Returns products with rating >= minRating
 */
export function filterByRating(
  products: Product[],
  minRating: number | null
): Product[] {
  if (minRating === null) return products

  return products.filter((product) => product.rating.rate >= minRating)
}

/**
 * Filter products by favorites status
 * Returns only favorited products when showOnlyFavorites is true
 */
export function filterByFavorites(
  products: Product[],
  showOnlyFavorites: boolean,
  favoriteIds: number[]
): Product[] {
  if (!showOnlyFavorites) return products

  return products.filter((product) => favoriteIds.includes(product.id))
}

/**
 * Filter products by price range
 * Returns products within the specified price range (inclusive)
 */
export function filterByPrice(
  products: Product[],
  minPrice: number | null,
  maxPrice: number | null
): Product[] {
  if (minPrice === null && maxPrice === null) return products

  return products.filter((product) => {
    const matchesMin = minPrice === null || product.price >= minPrice
    const matchesMax = maxPrice === null || product.price <= maxPrice
    return matchesMin && matchesMax
  })
}
