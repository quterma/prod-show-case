import { render } from "@testing-library/react"
import { describe, it, expect } from "vitest"

import { ProductCardSkeleton } from "./ProductCardSkeleton"

describe("ProductCardSkeleton", () => {
  it("renders skeleton placeholder with shimmer elements", () => {
    const { container } = render(<ProductCardSkeleton />)
    // Check that Card and Skeleton components are rendered
    expect(container.firstChild).toBeInTheDocument()
    // Verify shimmer animation class is present
    const skeletons = container.querySelectorAll(".animate-pulse")
    expect(skeletons.length).toBeGreaterThan(0)
  })
})
