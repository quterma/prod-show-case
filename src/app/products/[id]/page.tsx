import { generateProductMetadata } from "@/shared/config/seo"
import { ProductDetailWidget } from "@/widgets/product-detail/ui/ProductDetailWidget"

type PageProps = {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params
  return generateProductMetadata(id)
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { id } = await params

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <ProductDetailWidget productId={id} />
    </div>
  )
}
