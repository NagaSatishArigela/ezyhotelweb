"use client";

import dynamic from "next/dynamic";

const ExclusiveDeals = dynamic(
  () => import("@/components/client/ExclusiveDeals").then((m) => ({ default: m.ExclusiveDeals })),
  { ssr: false }
);

export default function ExclusiveDealsLoader() {
  return <ExclusiveDeals />;
}
