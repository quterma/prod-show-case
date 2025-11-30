import { productsMetadata } from "@/shared/config/seo"
import { ProductsWidget } from "@/widgets/products/ui/ProductsWidget"

export const metadata = productsMetadata

export default function ProductsPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <ProductsWidget />
    </div>
  )
}
