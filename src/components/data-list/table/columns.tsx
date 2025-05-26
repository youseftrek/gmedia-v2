"use client";

import type React from "react";

import type { ColumnDef } from "@tanstack/react-table";

// This is a helper function to create column definitions
export function createColumn<TData, TValue = unknown>(
  accessorKey: string,
  header: any,
  cell?: (props: { row: any }) => React.ReactNode,
  enableSorting = true,
  enableHiding = true
): ColumnDef<TData, TValue> {
  return {
    accessorKey,
    header,
    cell: cell ? cell : ({ row }) => row.getValue(accessorKey),
    enableSorting,
    enableHiding,
  };
}
