import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"

import { ProductsToolbar } from "./ProductsToolbar"

describe("ProductsToolbar", () => {
  it("renders toolbar placeholder", () => {
    render(<ProductsToolbar />)
    expect(screen.getByText(/Products Toolbar/i)).toBeInTheDocument()
  })
})
