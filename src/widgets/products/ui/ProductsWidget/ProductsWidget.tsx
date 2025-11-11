import type { Product } from "@/entities/product/model"
import { getDynamicCategories } from "@/shared/lib/categories"

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
  // Extract dynamic categories from products for filters
  const categories = getDynamicCategories(products)

  return (
    <div>
      <ProductsToolbar categories={categories} />
      <ProductsGrid
        products={products}
        isLoading={isLoading}
        onItemClick={onItemClick}
      />
    </div>
  )
}
