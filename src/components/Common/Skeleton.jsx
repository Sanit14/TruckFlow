/** Shimmer skeleton building block */
function Bone({ className = '' }) {
  return (
    <div
      className={`relative overflow-hidden rounded-lg bg-white/5 ${className}`}
    >
      <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/8 to-transparent" />
    </div>
  );
}

/** Four stat cards skeleton */
export function StatCardsSkeleton() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="glass rounded-2xl p-4">
          <Bone className="h-3 w-20 mb-3" />
          <Bone className="h-8 w-12" />
        </div>
      ))}
    </div>
  );
}

/** List row skeleton */
export function ListRowSkeleton({ rows = 5 }) {
  return (
    <div className="space-y-3">
      {[...Array(rows)].map((_, i) => (
        <div key={i} className="glass rounded-xl p-4 flex items-center gap-4">
          <Bone className="h-10 w-10 rounded-full shrink-0" />
          <div className="flex-1 space-y-2">
            <Bone className="h-3 w-32" />
            <Bone className="h-2.5 w-24 opacity-60" />
          </div>
          <Bone className="h-6 w-16 rounded-full" />
        </div>
      ))}
    </div>
  );
}

/** Full dashboard skeleton */
export function DashboardSkeleton() {
  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <Bone className="h-7 w-48" />
          <Bone className="h-4 w-64 opacity-60" />
        </div>
        <Bone className="h-8 w-28 rounded-xl" />
      </div>
      <StatCardsSkeleton />
      {/* Tab bar */}
      <div className="flex gap-2">
        {[...Array(5)].map((_, i) => (
          <Bone key={i} className="h-8 w-20 rounded-lg" />
        ))}
      </div>
      {/* Main content area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Bone className="lg:col-span-2 h-[380px] rounded-2xl" />
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <Bone key={i} className="h-16 rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
}
