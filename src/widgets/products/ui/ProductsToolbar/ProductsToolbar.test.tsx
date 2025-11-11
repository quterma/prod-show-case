import { render, screen } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"

import { ProductsToolbar } from "./ProductsToolbar"

describe("ProductsToolbar", () => {
  it("renders search input", () => {
    render(
      <ProductsToolbar
        searchQuery=""
        onSearchChange={vi.fn()}
        categories={[]}
      />
    )
    expect(
      screen.getByPlaceholderText("Search products...")
    ).toBeInTheDocument()
  })

  it("renders categories when provided", () => {
    render(
      <ProductsToolbar
        searchQuery=""
        onSearchChange={vi.fn()}
        categories={["electronics", "clothing"]}
      />
    )
    expect(screen.getByText(/electronics/i)).toBeInTheDocument()
    expect(screen.getByText(/clothing/i)).toBeInTheDocument()
  })
})
