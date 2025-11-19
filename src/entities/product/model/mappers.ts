import type {
  Product,
  ProductDTO,
  ProductsList,
  ProductsListDTO,
} from "./types"

/**
 * Maps a single ProductDTO from API to domain Product model
 * Converts numeric ID to string for unified ID handling
 *
 * @param dto - Product data from FakeStore API
 * @returns Domain Product model with string-based ID
 */
export function mapProductDTO(dto: ProductDTO): Product {
  return {
    id: String(dto.id), // Convert API numeric ID to string
    title: dto.title,
    price: dto.price,
    description: dto.description,
    category: dto.category as Product["category"],
    image: dto.image,
    rating: {
      rate: dto.rating.rate,
      count: dto.rating.count,
    },
  }
}

/**
 * Maps an array of ProductDTOs to domain Product models
 *
 * @param dtos - Array of product data from FakeStore API
 * @returns Array of domain Product models
 */
export function mapProductsDTO(dtos: ProductsListDTO): ProductsList {
  return dtos.map(mapProductDTO)
}
