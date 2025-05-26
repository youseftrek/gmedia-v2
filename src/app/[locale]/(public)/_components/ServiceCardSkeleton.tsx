"use client";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const ServiceCardSkeleton = () => {
  return (
    <Card className="flex flex-col justify-between p-4 min-h-[260px]">
      <div>
        {/* Image skeleton */}
        <Skeleton className="mb-1 rounded w-[50px] h-[50px]" />

        {/* Title skeleton */}
        <Skeleton className="mb-1 w-3/4 h-6" />

        {/* Description skeleton */}
        <Skeleton className="mb-1 w-full h-4" />
        <Skeleton className="mb-1 w-5/6 h-4" />
        <Skeleton className="w-4/6 h-4" />
      </div>
      <div className="flex flex-col gap-2">
        {/* Badges skeleton */}
        <div className="flex items-center gap-1">
          <Skeleton className="w-1/4 h-5" />
          <Skeleton className="w-1/4 h-5" />
        </div>

        {/* Buttons skeleton */}
        <div className="flex items-center gap-2 mt-auto w-full">
          <Skeleton className="w-full h-8" />
          <Skeleton className="w-full h-8" />
        </div>
      </div>
    </Card>
  );
};

export default ServiceCardSkeleton;
