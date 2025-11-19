import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"

import { EmptyState } from "./EmptyState"

describe("EmptyState", () => {
  it("renders with default title", () => {
    render(<EmptyState />)
    expect(screen.getByText(/No data/i)).toBeInTheDocument()
  })

  it("renders with custom title and note", () => {
    render(<EmptyState title="Custom Title" note="Custom note" />)
    expect(screen.getByText(/Custom Title/i)).toBeInTheDocument()
    expect(screen.getByText(/Custom note/i)).toBeInTheDocument()
  })

  it("renders with action button", () => {
    render(<EmptyState action={<button>Test Action</button>} />)
    expect(screen.getByText(/Test Action/i)).toBeInTheDocument()
  })
})
