import * as React from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface TableSkeletonProps {
  rowCount?: number;
  columnCount?: number;
  showActions?: boolean;
}

export function TableSkeleton({
  rowCount = 5,
  columnCount = 4,
  showActions = false,
}: TableSkeletonProps) {
  // If showActions is true, add an extra column for actions
  const totalColumns = showActions ? columnCount + 1 : columnCount;

  // Generate skeleton header
  const headerSkeleton = (
    <div className="flex bg-muted mb-2 px-4 py-3 border rounded-md font-medium">
      {Array.from({ length: totalColumns }).map((_, index) => (
        <div
          key={`header-${index}`}
          className="px-2"
          style={{
            width:
              index === totalColumns - 1 && showActions
                ? "fit-content"
                : `${100 / columnCount}%`,
            minWidth:
              index === totalColumns - 1 && showActions
                ? "fit-content"
                : "100px",
          }}
        >
          <Skeleton className="w-[80%] h-6" />
        </div>
      ))}
    </div>
  );

  // Generate skeleton rows
  const rowSkeletons = Array.from({ length: rowCount }).map((_, rowIndex) => (
    <div
      key={`row-${rowIndex}`}
      className="flex items-center bg-background mb-2 px-4 py-4 border rounded-md"
    >
      {Array.from({ length: totalColumns }).map((_, colIndex) => (
        <div
          key={`cell-${rowIndex}-${colIndex}`}
          className="px-2"
          style={{
            width:
              colIndex === totalColumns - 1 && showActions
                ? "fit-content"
                : `${100 / columnCount}%`,
            minWidth:
              colIndex === totalColumns - 1 && showActions
                ? "fit-content"
                : "100px",
          }}
        >
          {colIndex === totalColumns - 1 && showActions ? (
            <div className="flex gap-1">
              <Skeleton className="rounded-full w-8 h-8" />
            </div>
          ) : (
            <Skeleton className="w-[90%] h-6" />
          )}
        </div>
      ))}
    </div>
  ));

  return (
    <div className="space-y-4 w-full">
      {headerSkeleton}
      <div className="space-y-2">{rowSkeletons}</div>
    </div>
  );
}
