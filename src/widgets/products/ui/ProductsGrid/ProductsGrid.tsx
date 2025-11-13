import type { Product } from "@/entities/product"
import { ProductCard } from "@/entities/product"

type ProductsGridProps = {
  products: Product[]
  onItemClick?: (id: number) => void
}

export function ProductsGrid({ products, onItemClick }: ProductsGridProps) {
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
