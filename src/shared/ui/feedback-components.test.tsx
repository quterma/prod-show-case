import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"

import { EmptyState } from "./EmptyState"
import { ErrorMessage } from "./ErrorMessage"
import { Skeleton } from "./Skeleton"

describe("Feedback Components", () => {
  it("renders Skeleton with default lines", () => {
    render(<Skeleton />)
    expect(screen.getByText(/Loading line 1/i)).toBeInTheDocument()
  })

  it("renders ErrorMessage with message", () => {
    render(<ErrorMessage message="Test error" />)
    expect(screen.getByText(/Test error/i)).toBeInTheDocument()
  })

  it("renders EmptyState with default title", () => {
    render(<EmptyState />)
    expect(screen.getByText(/No data/i)).toBeInTheDocument()
  })
})
