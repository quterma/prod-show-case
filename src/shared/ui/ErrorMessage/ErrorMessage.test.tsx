import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"

import { ErrorMessage } from "./ErrorMessage"

describe("ErrorMessage", () => {
  it("renders with message", () => {
    render(<ErrorMessage message="Test error" />)
    expect(screen.getByText(/Test error/i)).toBeInTheDocument()
  })
})
