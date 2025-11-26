import type { Product } from "@/entities/product"
import { useGetProductsQuery } from "@/entities/product/api"
import {
  useDynamicCategories,
  useDynamicPriceRange,
} from "@/entities/product/lib"
import { useFavoriteProducts } from "@/features/favorites/hooks"
import { useFilteredProducts } from "@/features/filters/hooks"
import { useMergedProducts } from "@/features/local-products/hooks"
import { usePagination } from "@/features/pagination/hooks"
import { useIsMobile } from "@/shared/lib/hooks"

/**
 * Empty state types for different stages of product processing
 */
export type EmptyState =
  | "emptyAPIData" // No data from API
  | "emptyLocalData" // No data after merging with local changes
  | "emptyFavoriteData" // No favorite products (when filtering by favorites)
  | "emptyFilteredData" // No products after applying filters

/**
 * Result of the useProductsView hook
 */
export interface UseProductsViewResult {
  /** Paginated products to display */
  paginatedProducts: Product[]
  /** Total number of pages */
  totalPages: number
  /** Whether pagination is enabled (false on mobile) */
  isPaginationEnabled: boolean
  /** Dynamic categories extracted from current products (undefined if no data) */
  categories: string[] | undefined
  /** Dynamic price range extracted from current products (undefined if no data) */
  priceRange: { min: number; max: number } | undefined
  /** Loading state from RTK Query */
  isLoading: boolean
  /** Error from RTK Query */
  error: unknown
  /** Empty state indicator (if data is empty at any stage) */
  emptyState: EmptyState | null
  /** Refetch function from RTK Query */
  refetch: () => void
}

/**
 * Main aggregator hook for products view
 * Orchestrates the entire data flow pipeline:
 * 1. Fetch from API (RTK Query)
 * 2. Merge with local changes
 * 3. Filter by favorites (if enabled)
 * 4. Apply filters
 * 5. Paginate results
 * 6. Extract dynamic categories and price range
 *
 * Returns processed products with all metadata and states.
 * Determines empty state based on data at each stage.
 * Returns undefined for categories/priceRange if data is not available.
 *
 * @returns Products view result with data, loading, error, and empty states
 *
 * @example
 * ```tsx
 * function ProductsWidget() {
 *   const { paginatedProducts, pagination, categories, priceRange, isLoading, error, emptyState } = useProductsView()
 *
 *   if (isLoading) return <Skeleton />
 *   if (error) return <ErrorMessage />
 *   if (emptyState) return <EmptyStateMessage state={emptyState} />
 *
 *   return (
 *     <>
 *       <Toolbar categories={categories} priceRange={priceRange} />
 *       <ProductGrid products={paginatedProducts} pagination={pagination} />
 *     </>
 *   )
 * }
 * ```
 */
export function useProductsView(): UseProductsViewResult {
  // 0. Check if viewport is mobile (disable pagination on mobile)
  const isMobile = useIsMobile()
  const isPaginationEnabled = !isMobile

  // 1. Fetch products from API
  const { data: apiProducts, isLoading, error, refetch } = useGetProductsQuery()

  // 2. Merge with local changes (patches, deletions, creations)
  const mergedProducts = useMergedProducts(apiProducts)

  // 3. Filter by favorites (if "show only favorites" is enabled)
  const favoriteProducts = useFavoriteProducts(mergedProducts)

  // 4. Apply filters (category, search, etc.)
  const filteredProducts = useFilteredProducts(favoriteProducts)

  // 5. Paginate final results (only if pagination is enabled)
  const pagination = usePagination(filteredProducts)

  // 6. Extract dynamic categories and price range from favoriteProducts
  // If favoriteProducts is empty, both will return undefined and filters will be hidden
  const categories = useDynamicCategories(favoriteProducts)
  const priceRange = useDynamicPriceRange(favoriteProducts)

  // Build result object with default values
  const result: UseProductsViewResult = {
    // Use pagination only if enabled, otherwise show all filtered products
    paginatedProducts: isPaginationEnabled
      ? pagination.paginatedProducts
      : filteredProducts,
    totalPages: isPaginationEnabled ? pagination.totalPages : 1,
    isPaginationEnabled,
    categories,
    priceRange,
    isLoading,
    error: error ?? null,
    emptyState: null,
    refetch,
  }

  // Early return on error
  if (error) {
    return result
  }

  // Early return on loading
  if (isLoading) {
    return result
  }

  // Check for empty API data
  if (!apiProducts || apiProducts.length === 0) {
    result.emptyState = "emptyAPIData"
    return result
  }

  // Check for empty merged data
  if (mergedProducts.length === 0) {
    result.emptyState = "emptyLocalData"
    return result
  }

  // Check for empty favorites (only if filtering by favorites returned empty)
  if (favoriteProducts.length === 0) {
    result.emptyState = "emptyFavoriteData"
    return result
  }

  // Check for empty filtered data
  if (filteredProducts.length === 0) {
    result.emptyState = "emptyFilteredData"
    return result
  }

  // Success case - return result with data
  return result
}
