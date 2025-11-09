"use client"

import { useState } from "react"

import type { ProductState } from "@/entities/product"
import { getFromLS, setToLS, removeFromLS } from "@/shared/lib/persist"

const STORAGE_KEY = "test:productState"

/**
 * Test page for localStorage persistence utilities
 * Tests ProductState read/write/remove operations
 */
export default function TestPersistPage() {
  const [currentState, setCurrentState] = useState<ProductState | null>(null)
  const [readState, setReadState] = useState<ProductState | null>(null)

  // Create sample ProductState
  const sampleState: ProductState = {
    favorites: [1, 3, 5],
    deleted: [2, 4],
    createdLocal: [
      {
        id: 999,
        title: "Local Product Test",
        price: 99.99,
        description: "Test product created locally",
        category: "electronics",
        image: "https://via.placeholder.com/150",
        rating: { rate: 4.5, count: 10 },
      },
    ],
  }

  const handleWrite = () => {
    setToLS(STORAGE_KEY, sampleState)
    setCurrentState(sampleState)
  }

  const handleRead = () => {
    const state = getFromLS<ProductState>(STORAGE_KEY)
    setReadState(state)
  }

  const handleRemove = () => {
    removeFromLS(STORAGE_KEY)
    setCurrentState(null)
    setReadState(null)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">LocalStorage Persistence Test</h1>

      {/* Controls */}
      <section className="mb-8 p-6 border rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">Test Controls</h2>
        <div className="flex gap-4">
          <button
            onClick={handleWrite}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Write Sample State
          </button>
          <button
            onClick={handleRead}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Read from LS
          </button>
          <button
            onClick={handleRemove}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Remove from LS
          </button>
        </div>
      </section>

      {/* Written State */}
      <section className="mb-8 p-6 border rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">
          Test 1: setToLS() - Written State
        </h2>
        {currentState ? (
          <div>
            <p className="text-green-600 font-medium mb-2">
              ✅ State written to localStorage!
            </p>
            <div className="bg-gray-50 p-4 rounded">
              <p>
                <strong>Favorites:</strong> {currentState.favorites.join(", ")}
              </p>
              <p>
                <strong>Deleted:</strong> {currentState.deleted.join(", ")}
              </p>
              <p>
                <strong>Created Local:</strong>{" "}
                {currentState.createdLocal.length} product(s)
              </p>
            </div>
            <details className="mt-4">
              <summary className="cursor-pointer text-blue-600 hover:underline">
                Show full state (JSON)
              </summary>
              <pre className="mt-2 p-4 bg-gray-100 rounded overflow-auto text-xs">
                {JSON.stringify(currentState, null, 2)}
              </pre>
            </details>
          </div>
        ) : (
          <p className="text-gray-500">
            Click &quot;Write Sample State&quot; to test setToLS()
          </p>
        )}
      </section>

      {/* Read State */}
      <section className="mb-8 p-6 border rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">
          Test 2: getFromLS() - Read State
        </h2>
        {readState ? (
          <div>
            <p className="text-green-600 font-medium mb-2">
              ✅ State read from localStorage!
            </p>
            <div className="bg-gray-50 p-4 rounded">
              <p>
                <strong>Favorites:</strong> {readState.favorites.join(", ")}
              </p>
              <p>
                <strong>Deleted:</strong> {readState.deleted.join(", ")}
              </p>
              <p>
                <strong>Created Local:</strong> {readState.createdLocal.length}{" "}
                product(s)
              </p>
            </div>
            <details className="mt-4">
              <summary className="cursor-pointer text-blue-600 hover:underline">
                Show full state (JSON)
              </summary>
              <pre className="mt-2 p-4 bg-gray-100 rounded overflow-auto text-xs">
                {JSON.stringify(readState, null, 2)}
              </pre>
            </details>
          </div>
        ) : readState === null && currentState !== null ? (
          <p className="text-yellow-600">
            Click &quot;Read from LS&quot; to test getFromLS()
          </p>
        ) : (
          <p className="text-gray-500">
            Write state first, then click &quot;Read from LS&quot;
          </p>
        )}
      </section>

      {/* Summary */}
      <section className="p-6 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="text-xl font-semibold mb-2">Test Summary</h3>
        <ul className="space-y-1">
          <li>
            {currentState ? "✅" : "⏳"} setToLS() -{" "}
            {currentState ? "Written" : "Not tested"}
          </li>
          <li>
            {readState ? "✅" : "⏳"} getFromLS() -{" "}
            {readState ? "Read successfully" : "Not tested"}
          </li>
          <li>
            removeFromLS() - Click &quot;Remove from LS&quot; to test (will
            clear both displays)
          </li>
        </ul>
        {currentState && readState && (
          <div className="mt-4">
            <p className="text-green-700 font-medium mb-2">
              🎉 All persist utilities working!
            </p>
            <p className="text-sm text-gray-600">
              Open browser DevTools → Application → Local Storage to see the
              stored data
            </p>
          </div>
        )}
      </section>
    </div>
  )
}
