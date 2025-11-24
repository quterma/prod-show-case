import { Skeleton } from "@/shared/ui"

export function ProductDetailCardSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="aspect-square relative rounded-lg overflow-hidden bg-muted">
        <Skeleton className="w-full h-full" />
      </div>
      <div className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-6 w-1/4" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-24 w-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
        <div className="pt-6 border-t border-border">
          <Skeleton className="h-10 w-32" />
        </div>
      </div>
    </div>
  )
}
