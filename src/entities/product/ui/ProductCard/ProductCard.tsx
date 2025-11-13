"use client"

import { FavoriteButton } from "@/features/favorites"

import type { Product } from "../../model"

type ProductCardProps = {
  product: Product
  onClick?: () => void
}

export function ProductCard({ product, onClick }: ProductCardProps) {
  return (
    <div
      onClick={onClick}
      className="relative border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
    >
      {/* Favorite button in top-right corner */}
      <div className="absolute top-2 right-2">
        <FavoriteButton productId={product.id} />
      </div>

      <h3 className="text-lg font-semibold mb-2 pr-10">{product.title}</h3>
      <p className="text-gray-600 mb-1">Price: ${product.price}</p>
      <p className="text-gray-500 text-sm">Category: {product.category}</p>
    </div>
  )
}
