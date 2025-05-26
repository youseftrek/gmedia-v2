/* eslint-disable @typescript-eslint/no-explicit-any */
// components/table/Table.tsx
"use client";

import * as React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  SortingState,
  getSortedRowModel,
  ColumnFiltersState,
  getFilteredRowModel,
} from "@tanstack/react-table";

import { Input } from "@/components/ui/input";
import { useIsRtl } from "@/hooks/use-is-rtl";
import { Pagination } from "./Pagination";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchKey?: string;
  searchPlaceholder?: string;
  totalItems?: number;
  pageCount?: number;
  onPageChange?: (page: number) => void;
  currentPage?: number;
  pageSize?: number;
  onPageSizeChange?: (pageSize: number) => void;
  showSearchFilter?: boolean;
  showActions?: boolean;
  dir?: "rtl" | "ltr";
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchKey,
  searchPlaceholder = "Search...",
  totalItems,
  pageCount = 0,
  onPageChange,
  currentPage = 1,
  pageSize = 10,
  onPageSizeChange,
  showSearchFilter = false,
  showActions = false,
  dir,
}: DataTableProps<TData, TValue>) {
  const { isRtl: hookIsRtl } = useIsRtl();
  const isRtl = dir === "rtl" || (dir === undefined && hookIsRtl);
  const [isMobile, setIsMobile] = React.useState(false);

  // Check if we're on mobile
  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640); // sm breakpoint is 640px
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );

  // Controlled pagination state
  const isControlledPagination = !!onPageChange;
  const [internalCurrentPage, setInternalCurrentPage] =
    React.useState(currentPage);
  const [internalPageSize, setInternalPageSize] = React.useState(pageSize);

  // Filter out action column if showActions is false
  const filteredColumns = React.useMemo(() => {
    if (showActions) {
      return columns;
    }
    return columns.filter((col) => !("id" in col && col.id === "actions"));
  }, [columns, showActions]);

  // Calculate column widths
  const columnWidths = React.useMemo(() => {
    const totalColumns = filteredColumns.length;
    const hasActionColumn = filteredColumns.some(
      (col) => "id" in col && col.id === "actions"
    );
    const standardColumns = totalColumns - (hasActionColumn ? 1 : 0);
    const standardWidth = `${Math.floor(100 / (standardColumns || 1))}%`;

    const widthMap = new Map();
    filteredColumns.forEach((column) => {
      const columnId =
        "accessorKey" in column
          ? (column.accessorKey as string)
          : "id" in column
          ? (column.id as string)
          : "";

      if (columnId === "actions") {
        widthMap.set(columnId, "fit-content");
      } else {
        widthMap.set(columnId, standardWidth);
      }
    });

    return widthMap;
  }, [filteredColumns]);

  // Update internal pagination state when controlled props change
  React.useEffect(() => {
    if (isControlledPagination) {
      setInternalCurrentPage(currentPage);
    }
  }, [currentPage, isControlledPagination]);

  React.useEffect(() => {
    setInternalPageSize(pageSize);
  }, [pageSize]);

  const table = useReactTable({
    data,
    columns: filteredColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: isControlledPagination
      ? undefined
      : getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
      pagination: {
        pageIndex: internalCurrentPage - 1,
        pageSize: internalPageSize,
      },
    },
    manualPagination: isControlledPagination,
    pageCount: isControlledPagination ? pageCount : undefined,
  });

  // Simplified page change handler
  const handlePageChange = (newPage: number) => {
    if (isControlledPagination) {
      onPageChange?.(newPage);
    } else {
      setInternalCurrentPage(newPage);
      table.setPageIndex(newPage - 1);
    }
  };

  // Simplified page size change handler
  const handlePageSizeChange = (newSize: number) => {
    if (onPageSizeChange) {
      onPageSizeChange(newSize);
    } else {
      setInternalPageSize(newSize);
      table.setPageSize(newSize);
      // Reset to first page when changing page size
      if (!isControlledPagination) {
        setInternalCurrentPage(1);
        table.setPageIndex(0);
      }
    }
  };

  // Helper functions
  const getDirectionClass = () => (isRtl ? "text-right" : "text-left");
  const isActionCell = (cellId: string) => cellId.includes("actions");

  const getHeaderText = (column: any) => {
    if (column.columnDef.header) {
      if (typeof column.columnDef.header === "string") {
        return column.columnDef.header;
      } else {
        return column.id.charAt(0).toUpperCase() + column.id.slice(1);
      }
    }
    return column.id.charAt(0).toUpperCase() + column.id.slice(1);
  };

  // Render mobile card view
  const renderMobileCard = (row: any) => (
    <div key={row.id} className="bg-background mb-2 p-4 border rounded-md">
      {row.getVisibleCells().map((cell: any) => {
        // Skip rendering action cells at their normal position
        if (isActionCell(cell.column.id)) return null;

        const headerText = getHeaderText(cell.column);

        return (
          <div key={cell.id} className="flex flex-col py-2">
            <div className="font-medium text-muted-foreground text-sm">
              {headerText}
            </div>
            <div className={getDirectionClass()}>
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </div>
          </div>
        );
      })}

      {/* Render actions at the bottom of the card if they exist and showActions is true */}
      {showActions &&
        row
          .getVisibleCells()
          .some((cell: any) => isActionCell(cell.column.id)) && (
          <div className="flex justify-end mt-4 pt-2 border-t">
            {row
              .getVisibleCells()
              .filter((cell: any) => isActionCell(cell.column.id))
              .map((cell: any) => (
                <div key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </div>
              ))}
          </div>
        )}
    </div>
  );

  // Render desktop rows
  const renderDesktopRow = (row: any) => (
    <div
      key={row.id}
      className="flex items-center bg-background mb-2 px-4 py-4 border rounded-md"
      data-state={row.getIsSelected() && "selected"}
    >
      {row.getVisibleCells().map((cell: any) => {
        const columnId = cell.column.id;
        const isAction = isActionCell(columnId);

        return (
          <div
            key={cell.id}
            className={`px-2 ${getDirectionClass()} ${
              isAction ? "whitespace-nowrap" : ""
            }`}
            style={{
              width: isAction ? "fit-content" : columnWidths.get(columnId),
              minWidth: isAction ? "fit-content" : "100px",
            }}
          >
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </div>
        );
      })}
    </div>
  );

  // Calculate total pages for the pagination component
  const totalPageCount = isControlledPagination
    ? pageCount
    : table.getPageCount();

  return (
    <div className="space-y-4 w-full" dir={isRtl ? "rtl" : "ltr"}>
      {showSearchFilter && searchKey && (
        <div className="flex items-center py-4">
          <Input
            placeholder={searchPlaceholder}
            value={
              (table.getColumn(searchKey)?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table.getColumn(searchKey)?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
        </div>
      )}

      {/* Main content area */}
      <div className="w-full">
        {!isMobile ? (
          // Desktop View
          <div className="w-full overflow-x-auto">
            {/* Header row */}
            <div className="flex bg-muted mb-2 px-4 py-3 border rounded-md font-medium">
              {table.getHeaderGroups().map((headerGroup) => (
                <React.Fragment key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    const columnId = header.id;
                    const isAction = isActionCell(columnId);

                    return (
                      <div
                        key={columnId}
                        className={`px-2 ${getDirectionClass()} ${
                          isAction ? "whitespace-nowrap" : ""
                        }`}
                        style={{
                          width: isAction
                            ? "fit-content"
                            : columnWidths.get(columnId),
                          minWidth: isAction ? "fit-content" : "100px",
                        }}
                      >
                        {header.isPlaceholder
                          ? null
                          : isAction
                          ? "Actions"
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </div>
                    );
                  })}
                </React.Fragment>
              ))}
            </div>

            {/* Desktop rows */}
            <div className="space-y-2">
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map(renderDesktopRow)
              ) : (
                <div className="py-10 border rounded-md text-center">
                  No results.
                </div>
              )}
            </div>
          </div>
        ) : (
          // Mobile View
          <div className="space-y-4">
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map(renderMobileCard)
            ) : (
              <div className="py-10 border rounded-md text-center">
                No results.
              </div>
            )}
          </div>
        )}
      </div>

      {/* New Simplified Pagination */}
      {totalPageCount > 0 && (
        <Pagination
          currentPage={internalCurrentPage}
          totalPages={totalPageCount}
          totalItems={totalItems}
          pageSize={internalPageSize}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          dir={isRtl ? "rtl" : "ltr"}
        />
      )}
    </div>
  );
}
