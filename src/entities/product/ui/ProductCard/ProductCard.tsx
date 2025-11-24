"use client"

import { useRouter } from "next/navigation"

import { FavoriteToggle } from "@/features/favorites"
import { RemoveButton } from "@/features/local-products"
import { Card } from "@/shared/ui"

import type { Product } from "../../model"

type ProductCardProps = {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const router = useRouter()

  const handleClick = () => {
    router.push(`/products/${product.id}`)
  }

  return (
    <Card
      onClick={handleClick}
      className="relative p-4 hover:shadow-md transition-shadow cursor-pointer group"
    >
      {/* Action buttons in top-right corner */}
      <div className="absolute top-2 right-2 flex gap-1 z-10">
        <RemoveButton productId={product.id} />
        <FavoriteToggle productId={product.id} />
      </div>

      <div className="aspect-square bg-muted rounded-md mb-3 overflow-hidden">
        {/* Image placeholder - will be replaced in 3C */}
        <div className="w-full h-full bg-secondary/20 flex items-center justify-center text-muted-foreground text-xs">
          Image
        </div>
      </div>

      <h3
        className="text-lg font-semibold mb-2 pr-8 line-clamp-1"
        title={product.title}
      >
        {product.title}
      </h3>
      <div className="flex justify-between items-center mt-auto">
        <p className="font-medium text-foreground">${product.price}</p>
        <p className="text-muted-foreground text-sm">{product.category}</p>
      </div>
    </Card>
  )
}
