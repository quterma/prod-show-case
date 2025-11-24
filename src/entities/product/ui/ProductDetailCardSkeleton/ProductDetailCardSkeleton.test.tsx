import { render } from "@testing-library/react"
import { describe, it, expect } from "vitest"

import { ProductDetailCardSkeleton } from "./ProductDetailCardSkeleton"

describe("ProductDetailCardSkeleton", () => {
  it("renders skeleton placeholder for product details", () => {
    const { container } = render(<ProductDetailCardSkeleton />)
    // Check that skeleton elements are rendered (shimmer bars, not text)
    const skeletons = container.querySelectorAll(".animate-pulse")
    expect(skeletons.length).toBeGreaterThan(0)
  })
})
