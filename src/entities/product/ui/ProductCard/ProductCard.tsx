import Image from "next/image"
import { useRouter } from "next/navigation"

import { FavoriteToggle } from "@/features/favorites"
import { RemoveButton } from "@/features/local-products"
import { Card } from "@/shared/ui"

import type { Product } from "../../model"

type ProductCardProps = {
  product: Product
  priority?: boolean
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
  const router = useRouter()

  const handleClick = () => {
    router.push(`/products/${product.id}`)
  }

  return (
    <Card
      onClick={handleClick}
      className="relative p-4 hover:shadow-md transition-shadow cursor-pointer group h-full flex flex-col"
    >
      {/* Action buttons in top-right corner */}
      <div className="absolute top-2 right-2 flex gap-1 z-10">
        <RemoveButton productId={product.id} />
        <FavoriteToggle productId={product.id} />
      </div>

      <div className="aspect-square relative bg-muted rounded-md mb-3 overflow-hidden">
        <Image
          src={product.image}
          alt={product.title}
          fill
          className="object-contain p-4 mix-blend-multiply dark:mix-blend-normal"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={priority}
        />
      </div>

      <h3
        className="text-lg font-semibold mb-2 pr-8 line-clamp-1 text-foreground"
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
