import { ProductCardSkeleton } from "@/entities/product/ui"

/**
 * Loading skeleton for ProductsGrid
 * Shows 9 skeleton cards in a grid layout
 */
export function ProductsGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {Array.from({ length: 9 }).map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  )
}
