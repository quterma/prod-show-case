import { baseApi } from "./baseApi";

// Product type definition
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl?: string;
}

// Extend the base API with products endpoints
export const productsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<Product[], void>({
      // For now, use queryFn with mock data since we don't have a real backend
      queryFn: async () => {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Mock products data
        const mockProducts: Product[] = [
          {
            id: 1,
            name: "Example Product 1",
            description: "This is a mock product for testing RTK Query",
            price: 29.99,
            category: "Electronics",
            imageUrl: "/placeholder-image.jpg",
          },
          {
            id: 2,
            name: "Example Product 2",
            description: "Another mock product for validation",
            price: 49.99,
            category: "Accessories",
            imageUrl: "/placeholder-image.jpg",
          },
        ];

        return { data: mockProducts };
      },
      providesTags: ["Product"],
    }),
    getProduct: builder.query<Product, number>({
      // Mock single product
      queryFn: async (id) => {
        await new Promise((resolve) => setTimeout(resolve, 300));

        const mockProduct: Product = {
          id: id as number,
          name: `Product ${id}`,
          description: `Detailed description for product ${id}`,
          price: Math.random() * 100,
          category: "Sample Category",
          imageUrl: "/placeholder-image.jpg",
        };

        return { data: mockProduct };
      },
      providesTags: (_result, _error, id) => [{ type: "Product", id }],
    }),
  }),
});

// Export hooks for usage in components
export const { useGetProductsQuery, useGetProductQuery } = productsApi;
