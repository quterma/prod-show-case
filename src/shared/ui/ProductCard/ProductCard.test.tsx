import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"

import type { Product } from "@/entities/product/model"

import { ProductCard } from "./ProductCard"

describe("ProductCard", () => {
  it("renders product information", () => {
    const mockProduct: Product = {
      id: 1,
      title: "Test Product",
      price: 99.99,
      category: "electronics",
      description: "Test description",
      image: "test.jpg",
      rating: { rate: 4.5, count: 100 },
    }

    render(<ProductCard product={mockProduct} />)

    expect(screen.getByText("Test Product")).toBeInTheDocument()
    expect(screen.getByText(/\$99\.99/i)).toBeInTheDocument()
    expect(screen.getByText(/electronics/i)).toBeInTheDocument()
  })
})
