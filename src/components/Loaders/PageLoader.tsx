export default function PageLoader() {
  return (
    <div className="flex items-center justify-center h-[60vh]">
      <div className="flex flex-col items-center gap-4">

        {/* Animated Logo Circle */}
        <div className="relative">
          <div className="w-12 h-12 rounded-full border-4 border-gray-200"></div>
          <div className="absolute inset-0 w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
        </div>

        {/* Text */}
        <p className="text-sm text-gray-500 animate-pulse">
          Loading data...
        </p>
      </div>
    </div>
  )
}