import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"

import { EmptyState } from "./EmptyState"

describe("EmptyState", () => {
  it("renders with default title", () => {
    render(<EmptyState />)
    expect(screen.getByText(/No data/i)).toBeInTheDocument()
  })
})
