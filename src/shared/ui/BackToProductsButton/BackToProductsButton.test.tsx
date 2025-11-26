import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"

import { ROUTES } from "@/shared/config"

import { BackToProductsButton } from "./BackToProductsButton"

describe("BackToProductsButton", () => {
  it("renders link with correct text", () => {
    render(<BackToProductsButton />)
    expect(screen.getByText(/Back to Products/i)).toBeInTheDocument()
  })

  it("has correct href attribute", () => {
    render(<BackToProductsButton />)
    const link = screen.getByRole("link", { name: /Back to Products/i })
    expect(link).toHaveAttribute("href", ROUTES.products.list)
  })
})
