"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";

// Dynamically import the service cards component
const ServicesWithFilters = dynamic(
  () => import("./_components/ServicesCardaWithFilters"),
  {
    loading: () => (
      <div className="gap-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-8">
        {Array(6)
          .fill(0)
          .map((_, i) => (
            <div
              key={i}
              className="bg-card shadow-sm p-6 border border-border rounded-xl animate-pulse"
            >
              <div className="bg-muted mb-4 rounded w-3/4 h-6"></div>
              <div className="bg-muted mb-4 rounded w-full h-20"></div>
              <div className="bg-muted rounded w-1/2 h-10"></div>
            </div>
          ))}
      </div>
    ),
    ssr: false,
  }
);

export function ClientServicesWrapper() {
  return (
    <Suspense>
      <ServicesWithFilters />
    </Suspense>
  );
}
