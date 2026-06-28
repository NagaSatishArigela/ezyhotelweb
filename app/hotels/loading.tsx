export default function HotelsLoading() {
  return (
    <div className="relative flex min-h-screen w-full flex-col bg-white">
      <div className="flex h-full grow">
        {/* Sidebar skeleton */}
        <div className="hidden lg:block w-64 bg-white border-r border-gray-100 p-6 space-y-6 animate-pulse">
          <div className="h-5 w-24 bg-gray-200 rounded" />
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-3">
              <div className="h-4 w-20 bg-gray-200 rounded" />
              <div className="h-8 w-full bg-gray-100 rounded-lg" />
            </div>
          ))}
        </div>
        {/* Cards skeleton */}
        <main className="flex-1 p-4 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
            <div className="h-12 w-full bg-gray-100 rounded-xl animate-pulse" />
            <div className="flex flex-col gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white rounded-xl border border-gray-100 shadow-sm flex h-[18rem] animate-pulse overflow-hidden">
                  <div className="w-64 bg-gray-200 shrink-0" />
                  <div className="flex-1 p-6 space-y-4">
                    <div className="flex gap-2">
                      <div className="h-5 w-20 bg-gray-200 rounded" />
                      <div className="h-5 w-16 bg-gray-100 rounded" />
                    </div>
                    <div className="h-6 w-2/3 bg-gray-200 rounded" />
                    <div className="h-4 w-1/3 bg-gray-100 rounded" />
                    <div className="flex gap-2">
                      {[1, 2, 3].map((j) => <div key={j} className="h-6 w-20 bg-gray-100 rounded-full" />)}
                    </div>
                    <div className="h-4 w-full bg-gray-100 rounded" />
                    <div className="h-4 w-5/6 bg-gray-100 rounded" />
                    <div className="mt-auto pt-4 border-t border-gray-100 flex gap-3">
                      {[1, 2, 3].map((j) => <div key={j} className="h-12 w-20 bg-gray-100 rounded-lg" />)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
