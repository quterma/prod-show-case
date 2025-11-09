import "@testing-library/jest-dom"
import { cleanup } from "@testing-library/react"
import React from "react"
import { afterEach, beforeAll, vi } from "vitest"

// Cleanup after each test case (React Testing Library)
afterEach(() => {
  cleanup()
})

// Setup browser mocks for Next.js components
beforeAll(() => {
  // Mock Next.js router
  vi.mock("next/navigation", () => ({
    useRouter: () => ({
      push: vi.fn(),
      replace: vi.fn(),
      prefetch: vi.fn(),
      back: vi.fn(),
      forward: vi.fn(),
      refresh: vi.fn(),
    }),
    useSearchParams: () => ({
      get: vi.fn(),
      has: vi.fn(),
      forEach: vi.fn(),
    }),
    usePathname: () => "/",
  }))

  // Mock Next.js Link component
  vi.mock("next/link", () => ({
    __esModule: true,
    default: ({
      children,
      href,
      ...props
    }: {
      children: React.ReactNode
      href: string
      [key: string]: unknown
    }) => React.createElement("a", { href, ...props }, children),
  }))

  // Mock Next.js Image component
  vi.mock("next/image", () => ({
    __esModule: true,
    default: (props: { alt: string; [key: string]: unknown }) =>
      React.createElement("img", { ...props, alt: props.alt }),
  }))

  // Mock window.matchMedia (for responsive components)
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(), // deprecated
      removeListener: vi.fn(), // deprecated
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  })

  // Mock ResizeObserver
  global.ResizeObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }))

  // Mock IntersectionObserver
  global.IntersectionObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }))
})
