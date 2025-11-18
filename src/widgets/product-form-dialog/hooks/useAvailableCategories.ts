import { useMemo } from "react"

import { useGetProductsQuery, useDynamicCategories } from "@/entities/product"
import { selectLocalProductsArray } from "@/features/local-products"
import { useAppSelector } from "@/shared/lib/store"

/**
 * Aggregator hook for getting available categories from all products
 *
 * Combines:
 * 1. Products from API (useGetProductsQuery)
 * 2. Local products from store (selectLocalProductsArray)
 * 3. Extracts categories using useDynamicCategories
 *
 * Returns empty array on error to allow fallback to manual input
 *
 * @returns Array of unique category strings or empty array
 */
export function useAvailableCategories(): string[] {
  // Fetch API products
  const { data: apiProducts = [] } = useGetProductsQuery()

  // Get local products from store
  const localProducts = useAppSelector(selectLocalProductsArray)

  // Concatenate API and local products
  const allProducts = useMemo(
    () => [...apiProducts, ...localProducts],
    [apiProducts, localProducts]
  )

  // Extract categories
  const categories = useDynamicCategories(allProducts)

  // Return categories or empty array (for fallback to manual input)
  return categories || []
}
