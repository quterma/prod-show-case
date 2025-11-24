export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center space-y-8">
        <header>
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Product Showcase
          </h1>
          <p className="text-lg text-muted-foreground">
            Production ready foundation with Next.js, Redux Toolkit, and modern
            tooling
          </p>
        </header>

        <div className="max-w-2xl mx-auto">
          <div className="bg-card border border-border rounded-lg p-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              🚧 Product app will be here
            </h2>
            <p className="text-muted-foreground mb-6">
              This is a clean foundation ready for Feature-Sliced Design (FSD)
              architecture. All providers and core infrastructure are set up and
              working.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="bg-background p-4 rounded border border-border">
                <div className="font-medium text-success mb-2">✅ Ready</div>
                <ul className="text-muted-foreground space-y-1">
                  <li>• Next.js App Router</li>
                  <li>• Redux Toolkit Store</li>
                  <li>• RTK Query Base API</li>
                  <li>• TypeScript Setup</li>
                </ul>
              </div>

              <div className="bg-background p-4 rounded border border-border">
                <div className="font-medium text-success mb-2">✅ Tooling</div>
                <ul className="text-muted-foreground space-y-1">
                  <li>• ESLint + Prettier</li>
                  <li>• Vitest + RTL</li>
                  <li>• Playwright E2E</li>
                  <li>• Pre-commit Hooks</li>
                </ul>
              </div>

              <div className="bg-background p-4 rounded border border-border">
                <div className="font-medium text-primary mb-2">
                  🏗️ Structure
                </div>
                <ul className="text-muted-foreground space-y-1">
                  <li>• FSD Architecture</li>
                  <li>• Feature Folders</li>
                  <li>• Component Library</li>
                  <li>• State Management</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
