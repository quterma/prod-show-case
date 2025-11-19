import { render } from "@testing-library/react"
import { Provider } from "react-redux"
import { describe, it, expect, vi } from "vitest"

import { makeStore } from "@/shared/lib/store"

import { ProductsWidget } from "./ProductsWidget"

// Mock ProductFormDialogWidget
vi.mock("@/widgets/product-form-dialog", () => ({
  ProductFormDialogWidget: () => null,
}))

// Mock ProductsToolbar components
vi.mock("@/features/favorites", () => ({
  ShowOnlyFavoritesToggle: () => null,
}))

vi.mock("@/shared/ui", () => ({
  Button: ({
    children,
    ...props
  }: {
    children: React.ReactNode
    [key: string]: unknown
  }) => <button {...props}>{children}</button>,
  ResetLocalDataButton: () => null,
}))

describe("ProductsWidget", () => {
  it("renders without crashing", () => {
    const store = makeStore()
    const { container } = render(
      <Provider store={store}>
        <ProductsWidget />
      </Provider>
    )

    expect(container).toBeTruthy()
  })
})
