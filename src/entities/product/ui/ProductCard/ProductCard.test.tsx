import { configureStore } from "@reduxjs/toolkit"
import { render, screen } from "@testing-library/react"
import { Provider } from "react-redux"
import { describe, it, expect } from "vitest"

import favoritesReducer from "@/features/favorites/model/favoritesSlice"
import { localProductsReducer } from "@/features/local-products"

import type { Product } from "../../model"

import { ProductCard } from "./ProductCard"

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

describe("ProductCard", () => {
  it("renders product information", () => {
    const mockProduct: Product = {
      id: "1",
      title: "Test Product",
      price: 99.99,
      category: "electronics",
      description: "Test description",
      image: "test.jpg",
      rating: { rate: 4.5, count: 100 },
    }

    const store = createTestStore()

    render(
      <Provider store={store}>
        <ProductCard product={mockProduct} />
      </Provider>
    )

    expect(screen.getByText("Test Product")).toBeInTheDocument()
    expect(screen.getByText(/\$99\.99/i)).toBeInTheDocument()
    expect(screen.getByText(/electronics/i)).toBeInTheDocument()
  })
})
