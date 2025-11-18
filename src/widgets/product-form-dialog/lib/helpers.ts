import type { Product } from "@/entities/product"
import type { UpsertLocalProductPayload } from "@/features/local-products"

/**
 * Creates payload for creating a new local product
 * ID will be auto-assigned by the store
 *
 * @param productData - Product data without ID
 * @returns Payload for upsertLocalProduct action (create mode)
 */
export function createProductPayload(
  productData: Omit<Product, "id">
): UpsertLocalProductPayload {
  return {
    data: productData,
    source: "local",
  }
}

/**
 * Creates payload for updating an existing product
 * Determines source based on product ID (negative = local, positive = API)
 *
 * @param productData - Product data without ID
 * @param id - Product ID to update
 * @returns Payload for upsertLocalProduct action (update mode)
 */
export function updateProductPayload(
  productData: Omit<Product, "id">,
  id: number
): UpsertLocalProductPayload {
  const source = id < 0 ? "local" : "api"

  return {
    id,
    data: productData,
    source,
  }
}
