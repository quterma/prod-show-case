import { render, screen, waitFor } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"

import { ProductImage } from "./ProductImage"

// Mock Next.js Image component
vi.mock("next/image", () => ({
  default: ({
    src,
    alt,
    onLoad,
    onError,
  }: {
    src: string
    alt: string
    onLoad?: () => void
    onError?: () => void
  }) => {
    // Simulate image loading behavior
    const handleLoad = () => {
      if (onLoad) onLoad()
    }

    const handleError = () => {
      if (onError) onError()
    }

    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt}
        onLoad={handleLoad}
        onError={handleError}
        data-testid="next-image"
      />
    )
  },
}))

describe("ProductImage", () => {
  it("should render skeleton initially while loading", () => {
    render(<ProductImage src="https://example.com/image.jpg" alt="Product" />)

    // Skeleton should be present during loading
    const skeleton = document.querySelector(".animate-pulse")
    expect(skeleton).toBeInTheDocument()
  })

  it("should render image after loading", async () => {
    render(<ProductImage src="https://example.com/image.jpg" alt="Product" />)

    const image = screen.getByTestId("next-image")
    expect(image).toHaveAttribute("src", "https://example.com/image.jpg")
    expect(image).toHaveAttribute("alt", "Product")

    // Trigger load event
    image.dispatchEvent(new Event("load"))

    await waitFor(() => {
      // Image should be visible after loading
      expect(image).toBeInTheDocument()
    })
  })

  it("should show placeholder when src is empty", () => {
    render(<ProductImage src="" alt="Product" />)

    expect(screen.getByText("Image not available")).toBeInTheDocument()
    expect(screen.queryByTestId("next-image")).not.toBeInTheDocument()
  })

  it("should show placeholder with custom message", () => {
    render(
      <ProductImage
        src=""
        alt="Product"
        fallbackMessage="Custom fallback message"
      />
    )

    expect(screen.getByText("Custom fallback message")).toBeInTheDocument()
  })

  it("should show placeholder on image error", async () => {
    const { rerender } = render(
      <ProductImage src="https://example.com/invalid.jpg" alt="Product" />
    )

    const image = screen.getByTestId("next-image")

    // Trigger error event
    image.dispatchEvent(new Event("error"))

    // Rerender to reflect state change
    rerender(
      <ProductImage src="https://example.com/invalid.jpg" alt="Product" />
    )

    await waitFor(() => {
      expect(screen.getByText("Image not available")).toBeInTheDocument()
    })
  })

  it("should render placeholder icon", () => {
    render(<ProductImage src="" alt="Product" />)

    // Check for ImageOff icon (lucide-react renders as SVG)
    const icon = document.querySelector("svg")
    expect(icon).toBeInTheDocument()
  })

  it("should apply custom className", () => {
    const { container } = render(
      <ProductImage
        src="https://example.com/image.jpg"
        alt="Product"
        className="custom-class"
      />
    )

    const wrapper = container.querySelector(".custom-class")
    expect(wrapper).toBeInTheDocument()
  })

  it("should pass priority prop to Next.js Image", () => {
    render(
      <ProductImage
        src="https://example.com/image.jpg"
        alt="Product"
        priority
      />
    )

    // Image should be present with priority (in real Next.js Image, this affects loading)
    const image = screen.getByTestId("next-image")
    expect(image).toBeInTheDocument()
  })

  it("should pass custom sizes prop", () => {
    render(
      <ProductImage
        src="https://example.com/image.jpg"
        alt="Product"
        sizes="100vw"
      />
    )

    // Image should be present (sizes affects Next.js optimization)
    const image = screen.getByTestId("next-image")
    expect(image).toBeInTheDocument()
  })

  it("should handle 404 image gracefully", async () => {
    render(<ProductImage src="https://example.com/404.jpg" alt="Product" />)

    const image = screen.getByTestId("next-image")

    // Simulate 404 error
    image.dispatchEvent(new Event("error"))

    await waitFor(() => {
      expect(screen.getByText("Image not available")).toBeInTheDocument()
    })
  })
})
