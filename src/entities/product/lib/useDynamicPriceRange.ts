import { useMemo } from "react"

import type { Product } from "@/entities/product/model"

/**
 * Hook to get dynamic price range from products with memoization
 * @param products - Array of products to extract price range from
 * @returns Object with min and max price, or undefined if no valid prices
 */
export function useDynamicPriceRange(
  products?: Product[]
): { min: number; max: number } | undefined {
  return useMemo(() => {
    if (!products || products.length === 0) {
      return undefined
    }

    // Filter only valid prices (numbers, finite, non-negative)
    // TODO: Add dev warning for invalid prices (undefined/null/NaN/Infinity/negative)
    const validPrices = products
      .map((p) => p.price)
      .filter(
        (price): price is number =>
          typeof price === "number" &&
          !isNaN(price) &&
          isFinite(price) &&
          price >= 0
      )

    if (validPrices.length === 0) {
      return undefined
    }

    const min = Math.min(...validPrices)
    const max = Math.max(...validPrices)

    // If all products have the same price, price range filter is meaningless
    if (min === max) {
      return undefined
    }

    return { min, max }
  }, [products])
}
