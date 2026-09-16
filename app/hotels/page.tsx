import { Suspense } from "react";
import type { Metadata } from "next";
import { buildHotelsPageViewModel } from "@/modules/hotels/controller";
import HotelsPageClient from "@/components/client/HotelsPageClient";
import HotelsLoading from "./loading";
import { normalizeFilters } from "@/modules/hotels/filters";

interface HotelsPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export async function generateMetadata({ searchParams }: HotelsPageProps): Promise<Metadata> {
  const { city, q } = normalizeFilters(await searchParams);
  const title = city ? `Hotels in ${city}` : q ? `Search: ${q}` : "Find Hotels by the Hour";
  return {
    title,
    description: city
      ? `Book hourly hotels in ${city}. Best prices, flexible check-in. Pay only for hours you use.`
      : "Browse 50+ hotels across India. Book by the hour — 3h, 6h, 12h or 24h stays.",
  };
}

export default async function HotelsPage({ searchParams }: HotelsPageProps) {
  const params = normalizeFilters(await searchParams);
  const { viewModels, totalCount, activeFilters } = await buildHotelsPageViewModel(params);
  return (
    <Suspense fallback={<HotelsLoading />}>
      <HotelsPageClient viewModels={viewModels} totalCount={totalCount} activeFilters={activeFilters} />
    </Suspense>
  );
}
