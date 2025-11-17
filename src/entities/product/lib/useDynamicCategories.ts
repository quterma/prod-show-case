import { useMemo } from "react"

import type { Product } from "@/entities/product"

/**
 * Hook to get dynamic categories from products with memoization
 * @param products - Array of products to extract categories from
 * @returns Sorted array of unique category names, or undefined if no valid categories
 */
export function useDynamicCategories(
  products?: Product[]
): string[] | undefined {
  return useMemo(() => {
    if (!products || products.length === 0) {
      return undefined
    }

    // Filter only valid non-empty category strings
    // TODO: Add dev warning for invalid categories (undefined/null/empty strings)
    const validCategories = products
      .map((p) => p.category)
      .filter((cat): cat is string => Boolean(cat?.trim()))

    if (validCategories.length === 0) {
      return undefined
    }

    const categorySet = new Set(validCategories)
    return Array.from(categorySet).sort()
  }, [products])
}
