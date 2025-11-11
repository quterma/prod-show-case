import { render, screen } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"

import type {
  ProductFiltersState,
  ProductFiltersSetters,
} from "@/features/filters"

import { ProductsToolbar } from "./ProductsToolbar"

describe("ProductsToolbar", () => {
  const mockFilters: ProductFiltersState = {
    search: "",
    category: null,
    showOnlyFavorites: false,
    minPrice: null,
    maxPrice: null,
  }

  const mockSetters: ProductFiltersSetters = {
    setSearch: vi.fn(),
    setCategory: vi.fn(),
    setShowOnlyFavorites: vi.fn(),
    setMinPrice: vi.fn(),
    setMaxPrice: vi.fn(),
    resetFilters: vi.fn(),
  }

  it("renders search input", () => {
    render(
      <ProductsToolbar
        filters={mockFilters}
        setters={mockSetters}
        categories={[]}
        hasActiveFilters={false}
      />
    )
    expect(
      screen.getByPlaceholderText("Search products...")
    ).toBeInTheDocument()
  })

  it("renders categories when provided", () => {
    render(
      <ProductsToolbar
        filters={mockFilters}
        setters={mockSetters}
        categories={["electronics", "clothing"]}
        hasActiveFilters={false}
      />
    )
    expect(screen.getByText(/electronics/i)).toBeInTheDocument()
    expect(screen.getByText(/clothing/i)).toBeInTheDocument()
  })

  it("renders reset button as disabled when no active filters", () => {
    render(
      <ProductsToolbar
        filters={mockFilters}
        setters={mockSetters}
        categories={[]}
        hasActiveFilters={false}
      />
    )
    const resetButton = screen.getByRole("button", { name: /reset filters/i })
    expect(resetButton).toBeInTheDocument()
    expect(resetButton).toBeDisabled()
  })

  it("renders reset button as enabled when filters are active", () => {
    render(
      <ProductsToolbar
        filters={mockFilters}
        setters={mockSetters}
        categories={[]}
        hasActiveFilters={true}
      />
    )
    const resetButton = screen.getByRole("button", { name: /reset filters/i })
    expect(resetButton).toBeInTheDocument()
    expect(resetButton).not.toBeDisabled()
  })
})
