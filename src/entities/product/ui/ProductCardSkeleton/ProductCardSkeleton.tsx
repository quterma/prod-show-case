import { Card, Skeleton } from "@/shared/ui"

export function ProductCardSkeleton() {
  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <div className="aspect-square bg-muted relative">
        <Skeleton className="w-full h-full" />
      </div>
      <div className="p-4 space-y-3 flex-1">
        <div className="space-y-2">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
        <div className="pt-2 mt-auto">
          <Skeleton className="h-6 w-20" />
        </div>
      </div>
    </Card>
  )
}
