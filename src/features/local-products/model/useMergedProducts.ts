import { useMemo } from "react"

import type { Product } from "@/entities/product"
import { useAppSelector } from "@/shared/lib/store"

import { makeSelectMergedProducts } from "./selectors"

/**
 * Thin hook for merging API products with local changes using Redux selectors
 * Creates a memoized selector instance and returns merged products
 *
 * Applies all transformations:
 * 1. Remove soft-deleted products
 * 2. Apply local patches
 * 3. Add locally created products
 * 4. Sort alphabetically by title
 *
 * @param products - Products to merge (from API or other source)
 * @returns Merged products array or undefined if no products
 *
 * @example
 * ```ts
 * const { data } = useGetProductsQuery()
 * const mergedProducts = useMergedProducts(data)
 * ```
 */
export function useMergedProducts(
  products: Product[] | undefined
): Product[] | undefined {
  // Create memoized selector instance (stable across re-renders)
  const selectMergedProducts = useMemo(() => makeSelectMergedProducts(), [])

  // Use selector with products argument
  return useAppSelector((state) => selectMergedProducts(state, products))
}
