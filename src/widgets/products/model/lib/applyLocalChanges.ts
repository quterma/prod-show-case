import type { Product } from "@/entities/product"
import type {
  LocalProductEntry,
  LocalProductsState,
} from "@/features/local-products"

/**
 * Applies local changes to API products list
 *
 * This utility performs 3 operations in sequence:
 * 1. Filters out soft-deleted API products (removes IDs from removedApiIds)
 * 2. Applies patches from localProductsById (overrides API data with local edits)
 * 3. Adds locally created products (source="local" from localProductsById)
 * 4. Sorts all products alphabetically by title
 *
 * @param apiProducts - Raw products list from API
 * @param localProductsById - Map of local product entries (edits + creations)
 * @param removedApiIds - List of soft-deleted API product IDs
 * @returns Merged and sorted products list
 *
 * @example
 * ```ts
 * const apiProducts = [{ id: 1, title: "API Product", ... }]
 * const localProductsById = {
 *   1: { id: 1, data: { id: 1, title: "Edited Product", ... }, source: "api" },
 *   -1: { id: -1, data: { id: -1, title: "Local Product", ... }, source: "local" }
 * }
 * const removedApiIds = [2]
 *
 * const result = applyLocalChanges(apiProducts, localProductsById, removedApiIds)
 * // [
 * //   { id: 1, title: "Edited Product", ... },  // patched from local
 * //   { id: -1, title: "Local Product", ... }   // added from local
 * // ]
 * // Product with id=2 is filtered out
 * ```
 */
export function applyLocalChanges(
  apiProducts: Product[],
  localProductsById: LocalProductsState["localProductsById"],
  removedApiIds: number[]
): Product[] {
  // Step 1: Filter out removed API products
  const removedIdsSet = new Set(removedApiIds)
  const filteredProducts = apiProducts.filter(
    (product) => !removedIdsSet.has(product.id)
  )

  // Step 2: Apply patches from localProductsById (API overrides)
  const productsWithPatches = filteredProducts.map((product) => {
    const localEntry = localProductsById[product.id]
    // If there's a local entry for this API product, use the patched data
    if (localEntry && localEntry.source === "api") {
      return localEntry.data
    }
    return product
  })

  // Step 3: Add locally created products (source="local")
  const localProducts = (
    Object.values(localProductsById) as LocalProductEntry[]
  )
    .filter((entry) => entry.source === "local")
    .map((entry) => entry.data)

  const mergedProducts = [...productsWithPatches, ...localProducts]

  // Step 4: Sort alphabetically by title (case-insensitive)
  return mergedProducts.sort((a, b) =>
    a.title.toLowerCase().localeCompare(b.title.toLowerCase())
  )
}
