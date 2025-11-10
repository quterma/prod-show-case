import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"

import { ProductCardSkeleton } from "./ProductCardSkeleton"

describe("ProductCardSkeleton", () => {
  it("renders skeleton placeholder", () => {
    render(<ProductCardSkeleton />)
    expect(screen.getByText(/Loading title/i)).toBeInTheDocument()
  })
})
