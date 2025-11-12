import { useMemo } from "react"

import type { Product } from "@/entities/product/model"
import { useAppSelector } from "@/shared/lib/hooks"

import { makeSelectFilteredProducts } from "./selectors"

/**
 * Thin hook for filtering products using Redux selectors
 * Creates a memoized selector instance and returns filtered products
 *
 * @param products - Products to filter (from API or other source)
 * @returns Filtered products array or undefined if no products
 *
 * @example
 * ```ts
 * const { data } = useGetProductsQuery()
 * const filteredProducts = useFilteredProducts(data)
 * ```
 */
export function useFilteredProducts(
  products: Product[] | undefined
): Product[] | undefined {
  // Create memoized selector instance (stable across re-renders)
  const selectFilteredProducts = useMemo(() => makeSelectFilteredProducts(), [])

  // Use selector with products argument
  return useAppSelector((state) => selectFilteredProducts(state, products))
}
