export default function TableSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
      <div className="animate-pulse">

        {/* HEADER */}
        <div className="grid grid-cols-5 gap-4 p-4 bg-gray-50">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-3 bg-gray-200 rounded w-3/4"></div>
          ))}
        </div>

        {/* ROWS */}
        {Array.from({ length: rows }).map((_, i) => (
          <div
            key={i}
            className="grid grid-cols-5 gap-4 p-4 border-t"
          >
            {Array.from({ length: 5 }).map((_, j) => (
              <div
                key={j}
                className="h-3 bg-gray-200 rounded"
              ></div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}