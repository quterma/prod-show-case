import { configureStore } from "@reduxjs/toolkit"
import { render, screen } from "@testing-library/react"
import { Provider } from "react-redux"
import { describe, it, expect, vi } from "vitest"

import type { Product } from "@/entities/product/model"
import favoritesReducer from "@/features/favorites/model/favoritesSlice"
import { localProductsReducer } from "@/features/local-products"

import { ProductsGrid } from "./ProductsGrid"

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}))

// Helper to create test store
function createTestStore() {
  return configureStore({
    reducer: {
      favorites: favoritesReducer,
      localProducts: localProductsReducer,
    },
    preloadedState: {
      favorites: {
        favoriteIds: [],
        showOnlyFavorites: false,
      },
      localProducts: {
        localProductsById: {},
        removedProductIds: [],
      },
    },
  })
}

describe("ProductsGrid", () => {
  it("renders list of products", () => {
    const mockProducts: Product[] = [
      {
        id: "1",
        title: "Product 1",
        price: 10.99,
        category: "electronics",
        description: "Description 1",
        image: "img1.jpg",
        rating: { rate: 4.5, count: 100 },
      },
      {
        id: "2",
        title: "Product 2",
        price: 20.99,
        category: "jewelery",
        description: "Description 2",
        image: "img2.jpg",
        rating: { rate: 3.5, count: 50 },
      },
    ]

    const store = createTestStore()

    render(
      <Provider store={store}>
        <ProductsGrid products={mockProducts} />
      </Provider>
    )

    expect(screen.getByText("Product 1")).toBeInTheDocument()
    expect(screen.getByText("Product 2")).toBeInTheDocument()
  })
})
