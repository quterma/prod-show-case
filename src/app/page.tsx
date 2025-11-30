import Link from "next/link"

import { Button } from "@/shared/ui"

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-16">
      {/* Hero Section */}
      <section className="text-center space-y-6 mb-16">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground">
            Product Showcase
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Modern e-commerce demo with advanced filtering, CRUD, pagination and
            responsive UI — built to demonstrate frontend architecture and
            development skills
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
          <Link href="/products">
            <Button size="lg" className="min-w-[200px]">
              Browse Products
            </Button>
          </Link>
          <a
            href="https://github.com/quterma/prod-show-case"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="outline" size="lg" className="min-w-[200px]">
              View on GitHub
            </Button>
          </a>
        </div>
      </section>

      {/* Portfolio Sections */}
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Features */}
        <section className="bg-card border border-border rounded-lg p-8">
          <h2 className="text-2xl font-semibold text-foreground mb-6">
            Key Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h3 className="font-medium text-foreground">
                Advanced Filtering
              </h3>
              <p className="text-sm text-muted-foreground">
                Search, category, price range slider, and rating filters with
                debounced input and URL state persistence
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium text-foreground">CRUD Operations</h3>
              <p className="text-sm text-muted-foreground">
                Create, edit, and delete products with React Hook Form, Zod
                validation, and optimistic UI updates
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium text-foreground">
                Favorites & Pagination
              </h3>
              <p className="text-sm text-muted-foreground">
                Mark products as favorites with localStorage persistence,
                client-side pagination with mobile-optimized controls
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium text-foreground">Theme Toggle</h3>
              <p className="text-sm text-muted-foreground">
                Light/dark mode with next-themes, semantic color tokens, and
                smooth transitions
              </p>
            </div>
          </div>
        </section>

        {/* Tech Stack */}
        <section className="bg-card border border-border rounded-lg p-8">
          <h2 className="text-2xl font-semibold text-foreground mb-6">
            Tech Stack
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <h3 className="font-medium text-foreground">Framework</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Next.js 16 (App Router)</li>
                <li>• React 19 (with Compiler)</li>
                <li>• TypeScript 5</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium text-foreground">State & Data</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Redux Toolkit 2.9</li>
                <li>• RTK Query</li>
                <li>• React Hook Form + Zod</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium text-foreground">Styling & UI</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Tailwind CSS v4</li>
                <li>• Radix UI primitives</li>
                <li>• Lucide icons</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium text-foreground">Architecture</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Feature-Sliced Design</li>
                <li>• Path aliases (@/*)</li>
                <li>• Modular structure</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium text-foreground">Testing</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Vitest + Testing Library</li>
                <li>• Playwright (E2E)</li>
                <li>• Pre-commit hooks</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium text-foreground">Quality</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• ESLint + Prettier</li>
                <li>• Husky + lint-staged</li>
                <li>• Strict TypeScript</li>
              </ul>
            </div>
          </div>
        </section>

        {/* About */}
        <section className="bg-card border border-border rounded-lg p-8">
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            About This Project
          </h2>
          <div className="space-y-4 text-muted-foreground">
            <p>
              This project is a portfolio piece showcasing modern frontend
              development practices and architectural patterns. Built with a
              focus on code quality, maintainability, and user experience.
            </p>
            <p>
              Key highlights include Feature-Sliced Design architecture for
              scalability, comprehensive testing strategy with unit and E2E
              tests, accessibility-first component design, and performance
              optimization with React 19 Compiler.
            </p>
            <div className="pt-4 border-t border-border">
              <p className="text-sm">
                <strong className="text-foreground">Note:</strong> This is a
                demonstration project using FakeStore API for data. All CRUD
                operations are client-side only.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
