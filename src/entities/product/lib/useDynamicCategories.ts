import { useMemo } from "react"

import type { Product } from "@/entities/product/model"

import { getDynamicCategories } from "./getDynamicCategories"

/**
 * Hook to get dynamic categories from products with memoization
 * @param products - Array of products to extract categories from
 * @returns Array of unique category names
 */
export function useDynamicCategories(products?: Product[]): string[] {
  return useMemo(() => getDynamicCategories(products ?? []), [products])
}
