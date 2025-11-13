"use client"

import { FavoriteButton } from "@/features/favorites"

import type { Product } from "../../model"

type ProductDetailCardProps = {
  product: Product
}

export function ProductDetailCard({ product }: ProductDetailCardProps) {
  return (
    <div className="relative">
      {/* Favorite button in top-right corner */}
      <div className="absolute top-0 right-0">
        <FavoriteButton productId={product.id} />
      </div>

      <h2 className="pr-12">{product.title}</h2>
      <p>Price: ${product.price}</p>
      <p>Category: {product.category}</p>
      <p>Description: {product.description}</p>
      <img src={product.image} alt={product.title} />
      <p>
        Rating: {product.rating.rate} ({product.rating.count} reviews)
      </p>
    </div>
  )
}
