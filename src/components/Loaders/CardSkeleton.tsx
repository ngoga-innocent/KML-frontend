export default function CardSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-white p-4 rounded-xl border shadow-sm animate-pulse"
        >
          <div className="flex justify-between">
            <div className="space-y-2 w-2/3">
              <div className="h-3 bg-gray-200 rounded"></div>
              <div className="h-2 bg-gray-200 rounded w-1/2"></div>
            </div>

            <div className="w-6 h-6 bg-gray-200 rounded"></div>
          </div>

          <div className="mt-3 space-y-2">
            <div className="h-3 bg-gray-200 rounded"></div>
            <div className="h-3 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
      ))}
    </div>
  )
}