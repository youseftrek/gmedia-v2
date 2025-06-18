"use client";

import { Session } from "@/lib/auth";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import Image from "next/image";
import RequestCard from "@/components/RequestCard";
import { ChevronLeft, ChevronRight, Calendar, Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { getMyRequests } from "@/data/get-requests";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";

type Props = {
  session: Session;
  locale: string;
};

const ClientRequests = ({ session, locale }: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [drafts, setDrafts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const t = useTranslations("MyRequestsPage");
  const paginationT = useTranslations("Pagination");

  // Search and filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [date, setDate] = useState<Date | undefined>(undefined);

  useEffect(() => {
    async function fetchDrafts() {
      setIsLoading(true);
      try {
        // Use the original API call without any filtering
        const res = await getMyRequests(
          session,
          currentPage,
          itemsPerPage,
          locale
        );

        if (res.success) {
          // Keep the original data handling
          setDrafts(res.data.items);
          setTotalItems(res.data.totalItems);
          setTotalPages(Math.ceil(res.data.totalItems / itemsPerPage));
        } else {
          console.error("API returned unsuccessful response");
        }
      } catch (error) {
        console.error("Failed to fetch drafts:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchDrafts();
  }, [session, locale, currentPage, itemsPerPage]);

  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`?${params.toString()}`);
  };

  const handleSearch = () => {
    // For future implementation
    console.log("Search with:", { searchQuery, selectedStatus, date });
  };

  // Generate page numbers for pagination
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

  const handlePageSizeChange = (value: string) => {
    setItemsPerPage(Number(value));
    goToPage(1); // Reset to first page when changing page size
  };

  return (
    <div className="mx-auto p-6 max-w-7xl">
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <h1 className="font-bold text-2xl">{t("title")}</h1>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-wrap lg:flex-nowrap gap-2 mb-6 w-full">
        <div className="w-full lg:w-auto flex-1 min-w-[200px]">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-between text-muted-foreground font-normal h-10"
              >
                {date ? format(date, "PPP") : t("selectDate")}
                <Calendar className="h-4 w-4 ml-2 rtl:mr-2 rtl:ml-0" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="w-full lg:w-auto flex-1 min-w-[200px]">
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-full h-10 text-muted-foreground font-normal">
              <SelectValue placeholder={t("statusFilter")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("status.all")}</SelectItem>
              <SelectItem value="pending">{t("status.pending")}</SelectItem>
              <SelectItem value="approved">{t("status.approved")}</SelectItem>
              <SelectItem value="rejected">{t("status.rejected")}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="w-full lg:w-auto flex-1 min-w-[200px]">
          <div className="relative w-full">
            <Search className="absolute ltr:left-3 rtl:right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              className="w-full ltr:pl-10 ltr:pr-16 rtl:pr-10 rtl:pl-16 h-10"
              placeholder={t("searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <Button
              className="absolute ltr:right-0 rtl:left-0 top-0 h-full px-4 py-2 ltr:rounded-l-none rtl:rounded-r-none text-white font-bold"
              onClick={handleSearch}
            >
              {t("search")}
            </Button>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center mx-auto max-w-7xl h-[80vh]">
          <Image
            src="/images/gmedia/loader.svg"
            alt="loader"
            width={300}
            height={300}
          />
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {/* Header - only visible on medium screens and up */}
          <div className="hidden md:flex items-center justify-between px-4 py-2 bg-secondary gap-2 rounded-md font-medium text-foreground border">
            <p className="w-[300px] flex items-center gap-2">{t("Table.id")}</p>
            <p className="w-[40%]">{t("Table.documentType")}</p>
            <p className="w-[25%]">{t("Table.createdAt")}</p>
            <p className="w-[25%]">{t("Table.status")}</p>
          </div>
          {drafts.map((draft: any) => (
            <RequestCard key={draft.id} request={draft} page="my-requests" />
          ))}
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-center mt-2 gap-4 py-2">
        <div className="text-sm text-muted-foreground">
          {paginationT("showing")}{" "}
          {Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)}{" "}
          {paginationT("to")} {Math.min(currentPage * itemsPerPage, totalItems)}{" "}
          {paginationT("of")} {totalItems} {paginationT("items")}
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm">{paginationT("rows_per_page")}</span>
            <Select
              value={String(itemsPerPage)}
              onValueChange={handlePageSizeChange}
            >
              <SelectTrigger className="w-[70px] h-8">
                <SelectValue placeholder={itemsPerPage} />
              </SelectTrigger>
              <SelectContent>
                {[10, 20, 30, 40, 50].map((size) => (
                  <SelectItem key={size} value={String(size)}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center">
            <Button
              variant="ghost"
              className="h-8 w-8 p-0 rounded-full"
              disabled={currentPage <= 1}
              onClick={() => goToPage(currentPage - 1)}
            >
              <ChevronLeft className="h-4 w-4 rtl:rotate-180" />
              <span className="sr-only">{paginationT("previous_page")}</span>
            </Button>

            <div className="flex items-center">
              {getPageNumbers().map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  className="h-8 w-8 p-0 mx-1 rounded-md font-medium"
                  onClick={() => goToPage(page)}
                >
                  {page}
                </Button>
              ))}
            </div>

            <Button
              variant="ghost"
              className="h-8 w-8 p-0 rounded-full"
              disabled={currentPage >= totalPages}
              onClick={() => goToPage(currentPage + 1)}
            >
              <ChevronRight className="h-4 w-4 rtl:rotate-180" />
              <span className="sr-only">{paginationT("next_page")}</span>
            </Button>
          </div>
        </div>
      </div>

      {process.env.NODE_ENV === "development" && (
        <details className="mt-8 p-2 border rounded">
          <summary className="font-medium cursor-pointer">
            Debug Information
          </summary>
          <div className="mt-2 p-4 rounded">
            <h3 className="mb-2 font-semibold">requests Response:</h3>
            <pre className="max-h-96 overflow-auto text-xs">
              {JSON.stringify(drafts, null, 2)}
            </pre>
          </div>
        </details>
      )}
    </div>
  );
};

export default ClientRequests;
