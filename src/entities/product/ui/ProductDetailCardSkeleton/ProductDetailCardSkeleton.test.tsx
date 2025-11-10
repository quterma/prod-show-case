import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"

import { ProductDetailCardSkeleton } from "./ProductDetailCardSkeleton"

describe("ProductDetailCardSkeleton", () => {
  it("renders skeleton placeholder for product details", () => {
    render(<ProductDetailCardSkeleton />)
    expect(screen.getByText(/Loading title/i)).toBeInTheDocument()
    expect(screen.getByText(/Loading description/i)).toBeInTheDocument()
  })
})
