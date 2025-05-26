"use client";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const ServiceCardSkeleton = () => {
  return (
    <Card className="flex flex-col justify-between p-5 h-full">
      <div className="relative flex flex-col h-full">
        {/* Header with icon and badge */}
        <div className="flex justify-between items-start mb-4">
          <Skeleton className="rounded-lg w-12 h-12" />
          <Skeleton className="w-24 h-6 rounded-full" />
        </div>

        {/* Title skeleton */}
        <Skeleton className="mb-2 w-3/4 h-6" />

        {/* Description skeleton - 3 lines */}
        <div className="mb-4">
          <Skeleton className="mb-1.5 w-full h-3" />
          <Skeleton className="mb-1.5 w-5/6 h-3" />
          <Skeleton className="w-4/6 h-3" />
        </div>
      </div>

      {/* Footer section */}
      <div className="flex flex-col gap-2 mt-auto pt-3 border-t border-slate-100 dark:border-slate-800">
        {/* Price section */}
        <div className="flex items-center">
          <Skeleton className="w-32 h-8 rounded-lg" />
        </div>

        {/* Info badges */}
        <div className="flex items-center gap-2 flex-wrap">
          <Skeleton className="w-1/3 h-4" />
          <Skeleton className="w-1/3 h-4" />
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-2 mt-2 w-full">
          <Skeleton className="w-full h-8" />
          <Skeleton className="w-full h-8" />
        </div>
      </div>
    </Card>
  );
};

export default ServiceCardSkeleton;
