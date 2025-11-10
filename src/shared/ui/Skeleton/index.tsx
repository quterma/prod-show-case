type SkeletonProps = {
  lines?: number
}

export function Skeleton({ lines = 3 }: SkeletonProps) {
  return (
    <div>
      {Array.from({ length: lines }).map((_, index) => (
        <div key={index}>Loading line {index + 1}</div>
      ))}
    </div>
  )
}
