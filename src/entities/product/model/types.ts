/**
 * Product rating information
 */
export type ProductRating = {
  /** Average rating from 0 to 5 */
  rate: number
  /** Total number of reviews */
  count: number
}

/**
 * Product category enum
 * Matches FakeStore API categories
 */
export type ProductCategory =
  | "men's clothing"
  | "women's clothing"
  | "jewelery"
  | "electronics"

/**
 * Product entity (domain model)
 * Represents a product in the application
 */
export type Product = {
  /** Unique product ID */
  id: number
  /** Product title/name */
  title: string
  /** Price in USD */
  price: number
  /** Product description */
  description: string
  /** Product category */
  category: ProductCategory
  /** Product image URL */
  image: string
  /** Product rating information */
  rating: ProductRating
}

/**
 * Product DTO (Data Transfer Object)
 * Shape of data from FakeStore API
 * Currently 1:1 with domain model
 */
export type ProductDTO = {
  id: number
  title: string
  price: number
  description: string
  category: string
  image: string
  rating: {
    rate: number
    count: number
  }
}

/**
 * Array of products (list response)
 */
export type ProductsList = Product[]

/**
 * Array of product DTOs (API list response)
 */
export type ProductsListDTO = ProductDTO[]

/**
 * Product filters for search and filtering
 * Used for client-side filtering
 */
export type ProductFilters = {
  /** Search query for title/description */
  search?: string
  /** Filter by category */
  category?: ProductCategory
  /** Minimum price */
  minPrice?: number
  /** Maximum price */
  maxPrice?: number
}

/**
 * Product state for persistence
 * Tracks favorites, deleted items, and locally created products
 */
export type ProductState = {
  /** IDs of favorite products */
  favorites: number[]
  /** IDs of deleted products */
  deleted: number[]
  /** Locally created products (not yet synced to API) */
  createdLocal: Product[]
}
