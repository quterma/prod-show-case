import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"

import { Skeleton } from "./Skeleton"

describe("Skeleton", () => {
  it("renders with default lines", () => {
    render(<Skeleton />)
    expect(screen.getByText(/Loading line 1/i)).toBeInTheDocument()
  })
})
