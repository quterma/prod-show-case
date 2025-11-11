import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect, vi } from "vitest"

import { SearchInput } from "./SearchInput"

describe("SearchInput", () => {
  it("renders with default placeholder", () => {
    render(<SearchInput value="" onChange={vi.fn()} />)

    expect(
      screen.getByPlaceholderText("Search products...")
    ).toBeInTheDocument()
  })

  it("renders with custom placeholder", () => {
    render(
      <SearchInput value="" onChange={vi.fn()} placeholder="Custom search" />
    )

    expect(screen.getByPlaceholderText("Custom search")).toBeInTheDocument()
  })

  it("displays provided value", () => {
    render(<SearchInput value="test query" onChange={vi.fn()} />)

    expect(screen.getByDisplayValue("test query")).toBeInTheDocument()
  })

  it("calls onChange when typing", async () => {
    const user = userEvent.setup()
    const handleChange = vi.fn()

    render(<SearchInput value="" onChange={handleChange} />)

    const input = screen.getByPlaceholderText("Search products...")

    await user.type(input, "test")

    // onChange should be called for each character typed
    expect(handleChange).toHaveBeenCalled()
    expect(handleChange.mock.calls.length).toBeGreaterThan(0)
  })

  it("has correct input type", () => {
    render(<SearchInput value="" onChange={vi.fn()} />)

    const input = screen.getByPlaceholderText("Search products...")

    expect(input).toHaveAttribute("type", "search")
  })
})
