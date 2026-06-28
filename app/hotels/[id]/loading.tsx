export default function HotelDetailLoading() {
  return (
    <div className="bg-[#F8F9FA] min-h-screen animate-pulse">
      <div className="h-1 bg-orange-200 w-full" />
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="h-4 w-48 bg-gray-200 rounded" />
      </div>
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">
          {/* Gallery */}
          <div className="rounded-2xl overflow-hidden bg-white border border-gray-100">
            <div className="h-[300px] md:h-[450px] bg-gray-200" />
            <div className="flex gap-3 p-3">
              {[1, 2, 3, 4, 5].map((i) => <div key={i} className="w-32 h-20 bg-gray-200 rounded-xl shrink-0" />)}
            </div>
          </div>
          {/* Header card */}
          <div className="bg-white p-6 rounded-xl border border-gray-100 space-y-3">
            <div className="h-8 w-2/3 bg-gray-200 rounded" />
            <div className="flex gap-2">
              {[1, 2, 3].map((i) => <div key={i} className="h-5 w-16 bg-gray-100 rounded" />)}
            </div>
          </div>
          {/* Rating */}
          <div className="bg-white p-8 rounded-xl border border-gray-100 space-y-4">
            <div className="flex gap-4">
              <div className="h-12 w-16 bg-gray-200 rounded" />
              <div className="space-y-2">
                <div className="h-3 w-32 bg-gray-200 rounded" />
                <div className="h-4 w-24 bg-gray-200 rounded" />
              </div>
            </div>
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between">
                  <div className="h-3 w-16 bg-gray-200 rounded" />
                  <div className="h-3 w-8 bg-gray-200 rounded" />
                </div>
                <div className="h-1.5 w-full bg-gray-100 rounded-full" />
              </div>
            ))}
          </div>
          {/* Amenities */}
          <div className="bg-white p-8 rounded-xl border border-gray-100 space-y-4">
            <div className="h-6 w-24 bg-gray-200 rounded" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => <div key={i} className="h-14 bg-gray-100 rounded-xl" />)}
            </div>
          </div>
        </div>
        {/* Booking panel */}
        <div className="lg:col-span-4 hidden lg:block">
          <div className="bg-white rounded-[2rem] border border-gray-100 overflow-hidden">
            <div className="h-12 bg-orange-200" />
            <div className="p-5 space-y-4">
              <div className="h-6 w-40 bg-gray-200 rounded" />
              <div className="h-12 bg-gray-100 rounded-2xl" />
              <div className="grid grid-cols-2 gap-2">
                {[1, 2, 3, 4].map((i) => <div key={i} className="h-20 bg-gray-100 rounded-xl" />)}
              </div>
              <div className="h-10 bg-gray-100 rounded-xl" />
              <div className="h-14 bg-orange-200 rounded-2xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
