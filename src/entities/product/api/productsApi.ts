import { baseApi } from "@/shared/api"

import { mapProductDTO, mapProductsDTO } from "../model/mappers"
import type {
  Product,
  ProductDTO,
  ProductId,
  ProductsListDTO,
} from "../model/types"

/**
 * Products API endpoints
 * Injected into base API for cache management
 */
export const productsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * Get all products from FakeStore API
     * Returns mapped domain models with string-based IDs
     */
    getProducts: builder.query<Product[], void>({
      query: () => "/products",
      transformResponse: (response: ProductsListDTO) =>
        mapProductsDTO(response),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Product" as const, id })),
              { type: "Product", id: "LIST" },
            ]
          : [{ type: "Product", id: "LIST" }],
    }),

    /**
     * Get single product by ID from FakeStore API
     * Accepts string ID (converted to number for API call)
     * Returns mapped domain model or undefined if not found
     */
    getProductById: builder.query<Product | undefined, ProductId>({
      query: (id) => `/products/${id}`,
      transformResponse: (response: ProductDTO | null) => {
        // Handle 404 or null response from API
        if (!response) return undefined
        return mapProductDTO(response)
      },
      providesTags: (_result, _error, id) => [{ type: "Product", id }],
    }),
  }),
})

// Export hooks for use in components
export const { useGetProductsQuery, useGetProductByIdQuery } = productsApi
