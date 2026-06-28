import {
  Clock, Wallet, Hotel, Shield, FileCheck, Heart, Zap,
  Plane, Briefcase, Coffee, Search, List, CreditCard, Smile, HandHeart, GraduationCap,
} from "lucide-react";

export function WhyChooseSection() {
  const features = [
    { icon: Clock, title: "Hourly Hotel Bookings", desc: "Pay only for the hours you need" },
    { icon: Wallet, title: "Save Money", desc: "Cheaper than full-day hotel stays" },
    { icon: Hotel, title: "Verified Partner Hotels", desc: "Clean, safe, and trusted stays" },
    { icon: Shield, title: "Privacy & Safety First", desc: "Secure and hassle-free check-ins" },
    { icon: FileCheck, title: "Local ID Accepted", desc: "Easy booking even in your own city" },
    { icon: Heart, title: "Couple-Friendly Options", desc: "Available for couples" },
    { icon: Zap, title: "Instant Booking", desc: "Immediate confirmation" },
  ];

  return (
    <section className="py-20 px-4 bg-white below-fold">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-extrabold text-center text-brand-black mb-12">
          Why Choose <span className="text-brand-orange">Payperhour?</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, idx) => (
            <div key={idx} className="flex flex-col items-center text-center p-6 border border-gray-100 rounded-2xl hover:shadow-xl hover:-translate-y-1 transition-all bg-white group">
              <div className="w-16 h-16 bg-brand-orange rounded-full flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
                <feature.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-brand-black mb-2">{feature.title}</h3>
              <p className="text-brand-gray font-medium">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function PerfectForSection() {
  const audiences = [
    { icon: Plane, title: "Travelers", desc: "With layovers or short breaks" },
    { icon: Briefcase, title: "Business Professionals", desc: "Needing rest or meeting space" },
    { icon: Heart, title: "Couples", desc: "Looking for a private and comfortable stay" },
    { icon: Coffee, title: "Quick Rest", desc: "Anyone needing a quick nap or refresh" },
    { icon: HandHeart, title: "Devotees", desc: "Visiting nearby temples or spiritual centers" },
    { icon: GraduationCap, title: "Students", desc: "Looking for affordable rest or study-friendly stays" },
  ];

  return (
    <section className="py-20 px-4 bg-brand-pale">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-extrabold text-center text-brand-black mb-12">
          Perfect <span className="text-brand-orange">For</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {audiences.map((item, idx) => (
            <div key={idx} className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center text-center hover:border-brand-orange/30 transition-colors">
              <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center mb-4">
                <item.icon className="w-6 h-6 text-brand-orange" />
              </div>
              <h3 className="text-lg font-bold text-brand-black mb-2">{item.title}</h3>
              <p className="text-sm text-brand-gray">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function HowItWorksSection() {
  const steps = [
    { icon: Search, title: "Search Hotels", desc: "By city & location" },
    { icon: Clock, title: "Choose Time Slot", desc: "Pick your preferred hours" },
    { icon: List, title: "Compare", desc: "Prices & amenities" },
    { icon: CreditCard, title: "Book Instantly", desc: "Secure payment" },
    { icon: Smile, title: "Check In", desc: "Enjoy your stay" },
  ];

  return (
    <section className="py-20 px-4 bg-white below-fold">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-extrabold text-brand-black mb-16">
          How It <span className="text-brand-orange">Works</span>
        </h2>
        <div className="relative flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-4">
          <div className="hidden lg:block absolute top-[28px] left-0 w-full h-1 bg-gray-100 -z-10" />
          {steps.map((step, idx) => (
            <div key={idx} className="flex flex-col items-center relative bg-white p-4">
              <div className="w-14 h-14 bg-brand-black text-white rounded-full flex items-center justify-center mb-6 text-lg font-bold border-4 border-white shadow-lg z-10">
                {idx + 1}
              </div>
              <h3 className="text-lg font-bold text-brand-black mb-1">{step.title}</h3>
              <p className="text-sm text-brand-gray">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
