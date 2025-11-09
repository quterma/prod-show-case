// TODO: Implement ProductCard component (without favorite logic)
// This component should display product information only

import type { Product } from "../model"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <div>
      {/* TODO: Implement product card UI */}
      <p>Product ID: {product.id}</p>
    </div>
  )
}
