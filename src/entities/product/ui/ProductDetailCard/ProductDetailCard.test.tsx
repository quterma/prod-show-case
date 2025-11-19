import { configureStore } from "@reduxjs/toolkit"
import { render, screen } from "@testing-library/react"
import { Provider } from "react-redux"
import { describe, it, expect } from "vitest"

import favoritesReducer from "@/features/favorites/model/favoritesSlice"
import { localProductsReducer } from "@/features/local-products"

import type { Product } from "../../model"

import { ProductDetailCard } from "./ProductDetailCard"

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

describe("ProductDetailCard", () => {
  it("renders full product details", () => {
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
        <ProductDetailCard product={mockProduct} />
      </Provider>
    )

    expect(screen.getByText("Test Product")).toBeInTheDocument()
    expect(screen.getByText(/\$99\.99/i)).toBeInTheDocument()
    expect(screen.getByText(/electronics/i)).toBeInTheDocument()
    expect(screen.getByText(/Test description/i)).toBeInTheDocument()
    expect(screen.getByText(/4\.5/i)).toBeInTheDocument()
  })

  it("renders favorite button", () => {
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
        <ProductDetailCard product={mockProduct} />
      </Provider>
    )

    expect(screen.getByLabelText("Add to favorites")).toBeInTheDocument()
  })
})
