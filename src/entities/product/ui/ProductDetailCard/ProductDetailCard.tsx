import { Star } from "lucide-react"
import Image from "next/image"

import { FavoriteToggle } from "@/features/favorites"
import { RemoveButton } from "@/features/local-products"
import { Card } from "@/shared/ui"

import type { Product } from "../../model"

type ProductDetailCardProps = {
  product: Product
}

export function ProductDetailCard({ product }: ProductDetailCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-[350px_1fr] gap-8 p-6 md:p-8">
        {/* Image Section */}
        <div className="relative aspect-square bg-muted rounded-lg overflow-hidden">
          <Image
            src={product.image}
            alt={product.title}
            fill
            className="object-contain p-8 mix-blend-multiply dark:mix-blend-normal"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        </div>

        {/* Info Section */}
        <div className="flex flex-col space-y-6">
          <div className="space-y-4">
            <div className="flex justify-between items-start gap-4">
              <h1 className="text-2xl md:text-3xl font-bold text-foreground leading-tight">
                {product.title}
              </h1>
              <div className="flex gap-2 shrink-0">
                <RemoveButton productId={product.id} />
                <FavoriteToggle productId={product.id} />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-2xl font-bold text-primary">
                ${product.price}
              </span>
              <div className="flex items-center gap-1 text-sm text-muted-foreground bg-secondary/50 px-2.5 py-1 rounded-full">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium text-foreground">
                  {product.rating.rate}
                </span>
                <span>({product.rating.count} reviews)</span>
              </div>
            </div>

            <span className="inline-block px-3 py-1 text-sm font-medium bg-accent text-accent-foreground rounded-full capitalize">
              {product.category}
            </span>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold text-foreground">Description</h3>
            <p className="text-muted-foreground leading-relaxed">
              {product.description}
            </p>
          </div>
        </div>
      </div>
    </Card>
  )
}
