import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"

import type { Product } from "../../model"

import { ProductDetailCard } from "./ProductDetailCard"

describe("ProductDetailCard", () => {
  it("renders full product details", () => {
    const mockProduct: Product = {
      id: 1,
      title: "Test Product",
      price: 99.99,
      category: "electronics",
      description: "Test description",
      image: "test.jpg",
      rating: { rate: 4.5, count: 100 },
    }

    render(<ProductDetailCard product={mockProduct} />)

    expect(screen.getByText("Test Product")).toBeInTheDocument()
    expect(screen.getByText(/\$99\.99/i)).toBeInTheDocument()
    expect(screen.getByText(/electronics/i)).toBeInTheDocument()
    expect(screen.getByText(/Test description/i)).toBeInTheDocument()
    expect(screen.getByText(/4\.5/i)).toBeInTheDocument()
  })
})
