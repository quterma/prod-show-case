import type { Product } from "@/entities/product/model"

import { ProductsGrid } from "../ProductsGrid"
import { ProductsToolbar } from "../ProductsToolbar"

type ProductsWidgetProps = {
  products: Product[]
  isLoading?: boolean
  onItemClick?: (id: number) => void
}

export function ProductsWidget({
  products,
  isLoading,
  onItemClick,
}: ProductsWidgetProps) {
  return (
    <div>
      <ProductsToolbar />
      <ProductsGrid
        products={products}
        isLoading={isLoading}
        onItemClick={onItemClick}
      />
    </div>
  )
}
