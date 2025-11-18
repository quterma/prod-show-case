import { useMemo } from "react"

import type { Product } from "@/entities/product"
import { useAppSelector } from "@/shared/lib/store"

import { makeSelectMergedProduct } from "../model"

/**
 * Hook for merging a single product with local changes using Redux selectors
 * Creates a memoized selector instance and returns merged product or null
 *
 * Logic:
 * - If productId < 0: returns local product (ignores apiProduct)
 * - If productId > 0 and soft-deleted: returns null
 * - If productId > 0 and has patch: returns patched product
 * - Otherwise: returns apiProduct or null
 *
 * @param productId - Product ID (can be negative for local products)
 * @param apiProduct - Product from API (undefined if not fetched or error)
 * @returns Merged product or null
 *
 * @example
 * ```ts
 * const { data: apiProduct } = useGetProductByIdQuery(productId)
 * const product = useMergedProduct(productId, apiProduct)
 * ```
 */
export function useMergedProduct(
  productId: number,
  apiProduct: Product | undefined
): Product | null {
  // Create memoized selector instance (stable across re-renders)
  const selectMergedProduct = useMemo(() => makeSelectMergedProduct(), [])

  // Use selector with productId and apiProduct arguments
  const result = useAppSelector((state) =>
    selectMergedProduct(state, productId, apiProduct)
  )

  return result
}
