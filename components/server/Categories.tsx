import Link from "next/link";
import { Heart, Briefcase, PlaneTakeoff, Diamond } from "lucide-react";

const categoryData = [
  { id: 1, name: "Couple Friendly", icon: Heart, href: "/hotels?amenities=Couples+Allowed" },
  { id: 2, name: "Business Stay", href: "/hotels?amenities=Business+Center", icon: Briefcase },
  { id: 3, name: "Transit Stay", href: "/hotels?q=transit", icon: PlaneTakeoff },
  { id: 4, name: "Luxury Rooms", href: "/hotels?minPrice=150", icon: Diamond },
];

export function Categories() {
  return (
    <section className="py-16 sm:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold tracking-tight text-secondary sm:text-4xl text-center mb-10">
          Find Your Perfect Stay
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {categoryData.map((category) => (
            <Link key={category.id} href={category.href} className="group text-center">
              <div className="relative w-28 h-28 mx-auto bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <category.icon className="h-12 w-12 text-primary" />
              </div>
              <p className="mt-4 font-bold text-slate-800">{category.name}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
