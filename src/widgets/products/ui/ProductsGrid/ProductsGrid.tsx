import type { Product } from "@/entities/product/model"
import { ProductCard, ProductCardSkeleton } from "@/entities/product/ui"

type ProductsGridProps = {
  products: Product[]
  isLoading?: boolean
  onItemClick?: (id: number) => void
}

export function ProductsGrid({
  products,
  isLoading,
  onItemClick,
}: ProductsGridProps) {
  if (isLoading) {
    return (
      <div>
        {Array.from({ length: 9 }).map((_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </div>
    )
  }

  return (
    <div>
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onClick={onItemClick ? () => onItemClick(product.id) : undefined}
        />
      ))}
    </div>
  )
}
