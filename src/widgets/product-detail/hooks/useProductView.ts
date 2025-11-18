import { useGetProductByIdQuery } from "@/entities/product"
import type { Product } from "@/entities/product"
import { useMergedProduct } from "@/features/local-products"

/**
 * Empty state types for product detail view
 */
export type ProductViewEmptyState = "notFound" | "removed" | null

/**
 * Result interface for useProductView hook
 */
export interface UseProductViewResult {
  /** Final product with local changes applied (or null) */
  product: Product | null
  /** Loading state from RTK Query */
  isLoading: boolean
  /** Error from RTK Query (only for API products with positive IDs) */
  error: unknown
  /** Empty state reason (notFound, removed, or null if product exists) */
  emptyState: ProductViewEmptyState
  /** Refetch function from RTK Query */
  refetch: () => void
}

/**
 * Aggregator hook for product detail view data pipeline
 *
 * Orchestrates:
 * 1. Fetch product from API (always, even for local products)
 * 2. Merge with local changes (handles local/patched/removed products)
 * 3. Determine empty state (notFound vs removed)
 *
 * For local products (id < 0):
 * - API will return 404 error (expected, ignored)
 * - useMergedProduct returns local product from store
 *
 * For API products (id > 0):
 * - API returns product data or error
 * - useMergedProduct checks if removed or patched
 *
 * @param productId - Product ID (can be negative for local products)
 * @returns Complete product view state
 *
 * @example
 * ```ts
 * function ProductDetailWidget({ productId }: { productId: number }) {
 *   const { product, isLoading, error, emptyState, refetch } = useProductView(productId)
 *
 *   if (error) return <ErrorMessage onRetry={refetch} />
 *   if (isLoading) return <Skeleton />
 *   if (emptyState === "removed") return <EmptyState title="Product was removed" />
 *   if (emptyState === "notFound") return <EmptyState title="Product not found" />
 *   return <ProductDetailCard product={product!} />
 * }
 * ```
 */
export function useProductView(productId: number): UseProductViewResult {
  // Always fetch from API (will error for local products, which is expected)
  const {
    data: apiProduct,
    isLoading,
    error,
    refetch,
  } = useGetProductByIdQuery(productId)

  // Merge API product with local changes
  const product = useMergedProduct(productId, apiProduct)

  // Build result object
  const result: UseProductViewResult = {
    product,
    isLoading,
    error: null,
    emptyState: null,
    refetch,
  }

  // For local products (negative ID), ignore API errors
  const isLocalProduct = productId < 0

  // Handle error state (only for API products)
  if (error && !isLocalProduct) {
    result.error = error
    return result
  }

  // Handle loading state
  if (isLoading) {
    return result
  }

  // Handle empty state
  if (product === null) {
    // Determine if product was removed or never existed
    if (!isLocalProduct && apiProduct) {
      // API product exists but selector returned null -> must be soft-deleted
      result.emptyState = "removed"
    } else {
      // Product doesn't exist (not in API, not in local store)
      result.emptyState = "notFound"
    }
    return result
  }

  // Product exists
  return result
}
