import { useMemo } from "react"

import type { Product } from "@/entities/product/model"

/**
 * Hook to get dynamic price range from products with memoization
 * @param products - Array of products to extract price range from
 * @returns Object with min and max price, or null if no products
 */
export function useDynamicPriceRange(
  products?: Product[]
): { min: number; max: number } | null {
  return useMemo(() => {
    if (!products || products.length === 0) {
      return null
    }

    const prices = products.map((p) => p.price)
    return {
      min: Math.min(...prices),
      max: Math.max(...prices),
    }
  }, [products])
}
