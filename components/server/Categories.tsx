import Link from "next/link";
import styles from "@/components/brand/NavigationPill.module.css";
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
        <nav aria-label="Stay categories" className="flex gap-4 overflow-x-auto px-1 py-4 lg:justify-center">
          {categoryData.map((category) => (
            <Link key={category.id} href={category.href} className={styles.pill}>
              <category.icon className="h-6 w-6 text-orange-600" aria-hidden />
              <span>{category.name}</span>
            </Link>
          ))}
        </nav>
      </div>
    </section>
  );
}
