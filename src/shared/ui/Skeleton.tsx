// Simple skeleton loader component

interface SkeletonProps {
  className?: string
  width?: string
  height?: string
}

export function Skeleton({ className = "", width, height }: SkeletonProps) {
  const style = {
    width,
    height,
  }

  return (
    <div
      className={`animate-pulse bg-gray-200 rounded ${className}`}
      style={style}
    />
  )
}
