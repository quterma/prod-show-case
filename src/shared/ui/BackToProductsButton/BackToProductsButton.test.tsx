import { render, screen } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"

import { BackToProductsButton } from "./BackToProductsButton"

// Mock next/navigation
const mockPush = vi.fn()
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}))

describe("BackToProductsButton", () => {
  it("renders button with correct text", () => {
    render(<BackToProductsButton />)
    expect(screen.getByText(/Back to Products/i)).toBeInTheDocument()
  })

  it("calls router.push with /products on click", () => {
    render(<BackToProductsButton />)
    const button = screen.getByText(/Back to Products/i)
    button.click()
    expect(mockPush).toHaveBeenCalledWith("/products")
  })
})
