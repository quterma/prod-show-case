import type { Product } from "@/entities/product/model"

/**
 * Extracts unique categories from products array
 *
 * @param products - Array of products
 * @returns Sorted array of unique category names
 *
 * @example
 * ```ts
 * const products = [
 *   { category: "electronics", ... },
 *   { category: "jewelery", ... },
 *   { category: "electronics", ... }
 * ]
 * const categories = getDynamicCategories(products)
 * // => ["electronics", "jewelery"]
 * ```
 */
export function getDynamicCategories(products: Product[]): string[] {
  const categorySet = new Set(products.map((p) => p.category))
  return Array.from(categorySet).sort()
}
