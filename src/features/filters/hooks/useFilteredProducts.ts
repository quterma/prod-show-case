import { useMemo } from "react"

import type { Product } from "@/entities/product"
import { useAppSelector } from "@/shared/lib/store"

import { makeSelectFilteredProducts } from "../model/selectors"

/**
 * Thin hook for filtering products using Redux selectors
 * Creates a memoized selector instance and returns filtered products
 *
 * @param products - Products to filter (from merged products)
 * @returns Filtered products array (empty if no products)
 *
 * @example
 * ```ts
 * const mergedProducts = useMergedProducts(apiData)
 * const filteredProducts = useFilteredProducts(mergedProducts)
 * ```
 */
export function useFilteredProducts(products: Product[]): Product[] {
  // Create memoized selector instance (stable across re-renders)
  const selectFilteredProducts = useMemo(() => makeSelectFilteredProducts(), [])

  // Use selector with products argument
  const result = useAppSelector((state) =>
    selectFilteredProducts(state, products)
  )

  // Return empty array if undefined (standardize return type)
  return result ?? []
}
