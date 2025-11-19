import type { Product } from "@/entities/product"
import { ProductCard } from "@/entities/product"

type ProductsGridProps = {
  products: Product[]
}

export function ProductsGrid({ products }: ProductsGridProps) {
  return (
    <div>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
