import type { Product } from "@/entities/product"
import { ProductCard } from "@/entities/product"

type ProductsGridProps = {
  products: Product[]
}

export function ProductsGrid({ products }: ProductsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {products.map((product, index) => (
        <ProductCard key={product.id} product={product} priority={index < 4} />
      ))}
    </div>
  )
}
