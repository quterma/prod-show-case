import { render } from "@testing-library/react"
import { describe, it, expect } from "vitest"

import { Skeleton } from "./Skeleton"

describe("Skeleton", () => {
  it("renders skeleton with shimmer animation", () => {
    const { container } = render(<Skeleton />)
    const skeleton = container.querySelector(".animate-pulse")
    expect(skeleton).toBeInTheDocument()
    expect(skeleton).toHaveClass("bg-muted")
    expect(skeleton).toHaveClass("rounded-md")
  })

  it("accepts custom className", () => {
    const { container } = render(<Skeleton className="h-10 w-full" />)
    const skeleton = container.querySelector(".animate-pulse")
    expect(skeleton).toHaveClass("h-10")
    expect(skeleton).toHaveClass("w-full")
  })
})
