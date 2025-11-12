import { ProductCardSkeleton } from "@/entities/product/ui"

/**
 * Loading skeleton for ProductsGrid
 * Shows 9 skeleton cards in a grid layout
 */
export function ProductsGridSkeleton() {
  return (
    <div>
      {Array.from({ length: 9 }).map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  )
}
