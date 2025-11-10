import type { Product } from "../../model"

type ProductDetailCardProps = {
  product: Product
}

export function ProductDetailCard({ product }: ProductDetailCardProps) {
  return (
    <div>
      <h2>{product.title}</h2>
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
