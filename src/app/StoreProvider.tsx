"use client"

import { useState } from "react"
import { Provider } from "react-redux"

import { makeStore } from "@/shared/lib/store"

/**
 * StoreProvider - Redux store provider following official RTK pattern
 * React 19 compatible: uses useState with lazy initializer
 * See: https://redux-toolkit.js.org/usage/nextjs
 */
export default function StoreProvider({
  children,
}: {
  children: React.ReactNode
}) {
  // Use useState with lazy initializer to create store only once
  // This is React 19 compatible and avoids ref access during render
  const [store] = useState(() => makeStore())

  return <Provider store={store}>{children}</Provider>
}
