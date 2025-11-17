import type { Product } from "@/entities/product"

import type { LocalProductEntry, LocalProductsState } from "../model"

/**
 * Remove soft-deleted API products
 * Filters out products whose IDs are in the removedApiIds list
 * Should be applied FIRST in the merge chain
 */
export function removeDeletedProducts(
  products: Product[],
  removedApiIds: number[]
): Product[] {
  if (removedApiIds.length === 0) return products

  const removedIdsSet = new Set(removedApiIds)
  return products.filter((product) => !removedIdsSet.has(product.id))
}

/**
 * Apply patches from localProductsById to API products
 * Overwrites API product data with local edits
 * Note: API products have positive IDs, so any entry is guaranteed to be a patch
 */
export function applyProductPatches(
  products: Product[],
  localProductsById: LocalProductsState["localProductsById"]
): Product[] {
  return products.map((product) => {
    const localEntry = localProductsById[product.id]
    // If there's a local entry for this API product, use the patched data
    if (localEntry) {
      return localEntry.data
    }
    return product
  })
}

/**
 * Add locally created products (source="local") to the products list
 * Extracts products with source="local" from localProductsById and adds them
 */
export function addLocalProducts(
  products: Product[],
  localProductsById: LocalProductsState["localProductsById"]
): Product[] {
  const localProducts = (
    Object.values(localProductsById) as LocalProductEntry[]
  )
    .filter((entry) => entry.source === "local")
    .map((entry) => entry.data)

  return [...products, ...localProducts]
}

/**
 * Sort products alphabetically by title (case-insensitive)
 * Should be applied LAST in the merge chain
 */
export function sortProductsByTitle(products: Product[]): Product[] {
  return products.sort((a, b) =>
    a.title.toLowerCase().localeCompare(b.title.toLowerCase())
  )
}

/**
 * Merge API products with local changes
 * Applies all transformations in sequence:
 * 1. Remove soft-deleted products
 * 2. Apply local patches
 * 3. Add locally created products
 * 4. Sort alphabetically by title
 *
 * @param apiProducts - Raw products list from API
 * @param localProductsById - Map of local product entries (edits + creations)
 * @param removedApiIds - List of soft-deleted API product IDs
 * @returns Merged and sorted products list
 */
export function mergeLocalProducts(
  apiProducts: Product[],
  localProductsById: LocalProductsState["localProductsById"],
  removedApiIds: number[]
): Product[] {
  let result = removeDeletedProducts(apiProducts, removedApiIds)
  result = applyProductPatches(result, localProductsById)
  result = addLocalProducts(result, localProductsById)
  result = sortProductsByTitle(result)
  return result
}
