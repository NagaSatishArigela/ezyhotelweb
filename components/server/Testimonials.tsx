import Image from "next/image";

const testimonialsData = [
  { id: 1, name: "Sarah M.", role: "Anniversary Getaway", text: "EzyHotels made our anniversary getaway so easy and affordable! Booking a room for just a few hours was exactly what we needed.", imageUrl: "https://i.pravatar.cc/150?u=sarah" },
  { id: 2, name: "David L.", role: "Business Traveler", text: "Perfect for my business trips. I often need a room for a day-use to freshen up before a meeting. Quick and convenient.", imageUrl: "https://i.pravatar.cc/150?u=david" },
  { id: 3, name: "Emily R.", role: "Transit Passenger", text: "I needed a place to rest during my long layover, and EzyHotels was an absolute lifesaver! Much better than the airport lounge.", imageUrl: "https://i.pravatar.cc/150?u=emily" },
];

export function Testimonials() {
  return (
    <section className="py-16 sm:py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold tracking-tight text-center text-slate-900 sm:text-4xl mb-12">
          Loved by Travelers
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonialsData.map((testimonial) => (
            <div key={testimonial.id} className="bg-white p-8 rounded-2xl hover:bg-primary/10 hover:shadow-primary/20 border border-slate-200 relative overflow-hidden shadow-md">
              <div className="absolute inset-0 bg-gradient-to-br from-slate-50/50 to-transparent rounded-2xl" />
              <p className="text-slate-600 relative z-10 text-base leading-relaxed mb-8">{testimonial.text}</p>
              <div className="mt-6 flex items-center gap-4 relative z-10">
                <Image src={testimonial.imageUrl} alt={testimonial.name} width={48} height={48} className="rounded-full object-cover flex-shrink-0" />
                <div className="text-left">
                  <p className="font-semibold text-slate-900 text-sm">{testimonial.name}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
