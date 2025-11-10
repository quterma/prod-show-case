import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"

import type { Product } from "@/entities/product/model"

import { ProductsWidget } from "./ProductsWidget"

describe("ProductsWidget", () => {
  it("renders toolbar and grid", () => {
    const mockProducts: Product[] = [
      {
        id: 1,
        title: "Product 1",
        price: 10.99,
        category: "electronics",
        description: "Description 1",
        image: "img1.jpg",
        rating: { rate: 4.5, count: 100 },
      },
    ]

    render(<ProductsWidget products={mockProducts} />)

    expect(screen.getByText(/Products Toolbar/i)).toBeInTheDocument()
    expect(screen.getByText("Product 1")).toBeInTheDocument()
  })
})
