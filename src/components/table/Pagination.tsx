"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems?: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  dir?: "rtl" | "ltr";
}

export function Pagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange,
  dir = "ltr",
}: PaginationProps) {
  const t = useTranslations("Pagination");
  const isRtl = dir === "rtl";

  // Calculate displayed page range (max 5 pages)
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      // Show all pages if total pages is less than maxPagesToShow
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Calculate starting page
      let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));

      // Adjust startPage if it would make the range exceed totalPages
      if (startPage + maxPagesToShow - 1 > totalPages) {
        startPage = Math.max(1, totalPages - maxPagesToShow + 1);
      }

      // Add page numbers to array
      for (let i = 0; i < maxPagesToShow; i++) {
        if (startPage + i <= totalPages) {
          pages.push(startPage + i);
        }
      }
    }

    return pages;
  };

  return (
    <div className="flex sm:flex-row flex-col sm:justify-between sm:items-center gap-4 mt-4">
      {/* Item counts */}
      {totalItems !== undefined && (
        <div className="order-2 sm:order-1 text-muted-foreground text-sm">
          {t("showing")} {Math.min((currentPage - 1) * pageSize + 1, totalItems || 0)}{" "}
          {t("to")} {Math.min(currentPage * pageSize, totalItems || 0)} {t("of")} {totalItems}{" "}
          {t("items")}
        </div>
      )}

      {/* Pagination controls */}
      <div
        className={`flex items-center gap-1 order-1 sm:order-2 ${
          isRtl ? "flex-row-reverse" : ""
        }`}
      >
        {/* Page size selector */}
        <div className="flex items-center gap-2 mr-4">
          <span className="text-sm">{t("rows_per_page")}</span>
          <Select
            value={String(pageSize)}
            onValueChange={(value) => onPageSizeChange(Number(value))}
          >
            <SelectTrigger className="w-[70px] h-8">
              <SelectValue placeholder={pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[5, 10, 20, 30, 50].map((size) => (
                <SelectItem key={size} value={String(size)}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Previous button */}
        <Button
          variant="outline"
          size="icon"
          className="w-8 h-8"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ChevronLeft className={`h-4 w-4 ${isRtl ? "" : "rotate-180"}`} />
          <span className="sr-only">{t("previous_page")}</span>
        </Button>

        {/* Page numbers */}
        {getPageNumbers().map((page) => (
          <Button
            key={page}
            variant={currentPage === page ? "default" : "outline"}
            className="px-3 rounded-md min-w-8 h-8"
            onClick={() => onPageChange(page)}
          >
            {page}
          </Button>
        ))}

        {/* Next button */}
        <Button
          variant="outline"
          size="icon"
          className="w-8 h-8"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || totalPages === 0}
        >
          <ChevronRight className={`h-4 w-4 ${isRtl ? "" : "rotate-180"}`} />
          <span className="sr-only">{t("next_page")}</span>
        </Button>
      </div>
    </div>
  );
}
