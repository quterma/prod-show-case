import { useMemo } from "react"

import type { Product } from "@/entities/product/model"

/**
 * Hook to get dynamic categories from products with memoization
 * @param products - Array of products to extract categories from
 * @returns Sorted array of unique category names
 */
export function useDynamicCategories(products?: Product[]): string[] {
  return useMemo(() => {
    if (!products || products.length === 0) {
      return []
    }

    const categorySet = new Set(products.map((p) => p.category))
    return Array.from(categorySet).sort()
  }, [products])
}
