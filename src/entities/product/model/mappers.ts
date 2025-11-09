import type {
  Product,
  ProductDTO,
  ProductsList,
  ProductsListDTO,
} from "./types"

/**
 * Maps a single ProductDTO from API to domain Product model
 * Currently 1:1 mapping, but allows for future transformations
 *
 * @param dto - Product data from FakeStore API
 * @returns Domain Product model
 */
export function mapProductDTO(dto: ProductDTO): Product {
  return {
    id: dto.id,
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
