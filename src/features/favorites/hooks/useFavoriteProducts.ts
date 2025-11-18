import { useMemo } from "react"

import type { Product } from "@/entities/product"
import { useAppSelector } from "@/shared/lib/store"

import { makeSelectFavoriteProducts } from "../model/selectors"

/**
 * Hook for filtering products by favorites state
 * - If "show only favorites" is enabled: returns only favorited products
 * - If disabled: returns all products unchanged
 *
 * @param products - Products to filter (from filtered products)
 * @returns Favorite-filtered products array (empty if no products)
 *
 * @example
 * ```ts
 * const filteredProducts = useFilteredProducts(mergedProducts)
 * const favoriteProducts = useFavoriteProducts(filteredProducts)
 * ```
 */
export function useFavoriteProducts(products: Product[]): Product[] {
  // Create memoized selector instance (stable across re-renders)
  const selectFavoriteProducts = useMemo(() => makeSelectFavoriteProducts(), [])

  // Use selector with products argument
  const result = useAppSelector((state) =>
    selectFavoriteProducts(state, products)
  )

  // Return empty array if undefined (standardize return type)
  return result ?? []
}
