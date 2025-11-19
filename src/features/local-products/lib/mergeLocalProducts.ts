import type { Product, ProductId } from "@/entities/product"

import type { LocalProductsState } from "../model"

/**
 * Remove soft-deleted products (both API and local)
 * Filters out products whose IDs are in the removedProductIds list
 * Should be applied AFTER addLocalProducts to catch deleted local products
 */
export function removeDeletedProducts(
  products: Product[],
  removedProductIds: ProductId[]
): Product[] {
  if (removedProductIds.length === 0) return products

  const removedIdsSet = new Set(removedProductIds)
  return products.filter((product) => !removedIdsSet.has(product.id))
}

/**
 * Apply patches from localProductsById to API products
 * Overwrites API product data with local edits
 * Works for both API product patches and local product overrides
 */
export function applyProductPatches(
  products: Product[],
  localProductsById: LocalProductsState["localProductsById"]
): Product[] {
  return products.map((product) => {
    const localProduct = localProductsById[product.id]
    // If there's a local version for this product, use it
    if (localProduct) {
      return localProduct
    }
    return product
  })
}

/**
 * Add locally created products (ID starts with "local_") to the products list
 * Extracts products with local_ prefix from localProductsById and adds them
 */
export function addLocalProducts(
  products: Product[],
  localProductsById: LocalProductsState["localProductsById"]
): Product[] {
  const localProducts = Object.values(localProductsById).filter((product) =>
    product.id.startsWith("local_")
  )

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
 * 1. Apply local patches to API products
 * 2. Add locally created products
 * 3. Remove soft-deleted products (both API and local)
 * 4. Sort alphabetically by title
 *
 * Note: removeDeletedProducts runs AFTER addLocalProducts to ensure
 * deleted local products are filtered out correctly
 *
 * @param apiProducts - Raw products list from API
 * @param localProductsById - Map of local products (both created and patched)
 * @param removedProductIds - List of soft-deleted product IDs (both local and API)
 * @returns Merged and sorted products list
 */
export function mergeLocalProducts(
  apiProducts: Product[],
  localProductsById: LocalProductsState["localProductsById"],
  removedProductIds: ProductId[]
): Product[] {
  let result = applyProductPatches(apiProducts, localProductsById)
  result = addLocalProducts(result, localProductsById)
  result = removeDeletedProducts(result, removedProductIds)
  result = sortProductsByTitle(result)
  return result
}
