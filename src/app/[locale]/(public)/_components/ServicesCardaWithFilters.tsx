"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useEffect, useCallback } from "react";
import { getEservices } from "@/data/get-eservices";
import ServiceCard from "./ServiceCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLocale, useTranslations } from "next-intl";
import ServiceCardSkeleton from "./ServiceCardSkeleton";
import { Filter, X, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { usePathname } from "next/navigation";
import { createUrl } from "@/lib/utils";

export default function ServicesCardsWithFilters() {
  const t = useTranslations("ServicesPage");
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [displayedServices, setDisplayedServices] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeGroup, setActiveGroup] = useState("All");
  const [groups, setGroups] = useState<string[] | any>(["All"]);
  const [loading, setLoading] = useState(true);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [showFilters, setShowFilters] = useState(false);
  const [filterCount, setFilterCount] = useState(0);
  const [filterKey, setFilterKey] = useState(0); // New state for triggering animations
  const locale = useLocale();

  // Pagination state
  const ITEMS_PER_PAGE = 9;
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Read URL params on mount and when searchParams change
  useEffect(() => {
    const pageParam = searchParams.get("page");
    const searchParam = searchParams.get("search");
    const groupParam = searchParams.get("group");

    // Set initial page, search, and group from URL
    const initialPage = pageParam ? Number.parseInt(pageParam, 10) : 1;
    setCurrentPage(initialPage || 1); // Ensure valid page number

    // Set search term from URL
    if (searchParam) {
      setSearchTerm(searchParam);
    }

    // Set active group from URL
    if (groupParam) {
      setActiveGroup(groupParam);
    }
  }, [searchParams]);

  // Fetch services data
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await getEservices(locale);
        const servicesData = response.data?.data.data || [];
        setServices(servicesData);
        setFilteredServices(servicesData);

        // Extract unique groups
        const uniqueGroups = [
          "All",
          ...new Set(servicesData.map((service: any) => service.group)),
        ];
        setGroups(uniqueGroups);
      } catch (error) {
        console.error("Error fetching services:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [locale]);

  // Filter services when filter conditions change
  useEffect(() => {
    // Filter services based on active group and search term
    let filtered = services;

    // Filter by group
    if (activeGroup !== "All") {
      filtered = filtered.filter(
        (service: any) => service.group === activeGroup
      );
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter((service: any) =>
        service.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Increment filter key to trigger animation
    setFilterKey((prev) => prev + 1);

    setFilteredServices(filtered);
    const newTotalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
    setTotalPages(newTotalPages);

    // If current page is out of range for the new filtered results, reset to page 1
    if (currentPage > newTotalPages && newTotalPages > 0) {
      setCurrentPage(1);
      updatePageInUrl(1);
    }

    // Update filter count
    let count = 0;
    if (activeGroup !== "All") count++;
    if (searchTerm) count++;
    setFilterCount(count);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeGroup, searchTerm, services]);

  // Update displayed services when the current page or filtered results change
  useEffect(() => {
    // Calculate pagination
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    setDisplayedServices(filteredServices.slice(startIndex, endIndex));
  }, [filteredServices, currentPage]);

  // Helper functions
  const updatePageInUrl = useCallback(
    (page: number) => {
      // Clone the current params
      const params = new URLSearchParams(searchParams.toString());

      // Update the page parameter
      if (page === 1) {
        params.delete("page");
      } else {
        params.set("page", page.toString());
      }

      // Create the new URL with the updated search parameters
      const url = createUrl(pathname, params);

      // Update the URL without a full page reload
      router.push(url, { scroll: false });
    },
    [pathname, router, searchParams]
  );

  const updateUrlParams = useCallback(
    (updates: { [key: string]: string | null }) => {
      const params = new URLSearchParams(searchParams.toString());

      // Apply all updates
      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === "") {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      });

      // Always reset to page 1 when filters change
      params.delete("page");

      const url = createUrl(pathname, params);
      router.push(url, { scroll: false });
    },
    [pathname, router, searchParams]
  );

  const handleGroupChange = (group: any) => {
    if (group !== activeGroup) {
      setActiveGroup(group);
      setShowFilters(false);
      setCurrentPage(1);

      // Update URL with group parameter
      updateUrlParams({
        group: group === "All" ? null : group,
      });
    }
  };

  const handleSearch = (e: any) => {
    const newSearchTerm = e.target.value;
    setSearchTerm(newSearchTerm);
    setCurrentPage(1);

    // Debounce search in URL - only update after 300ms of no typing
    const timer = setTimeout(() => {
      updateUrlParams({
        search: newSearchTerm || null,
      });
    }, 300);

    return () => clearTimeout(timer);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setActiveGroup("All");
    setCurrentPage(1);

    // Clear all filter params in URL
    updateUrlParams({
      search: null,
      group: null,
      page: null,
    });
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      updatePageInUrl(newPage);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const filterButtonVariants = {
    hover: { scale: 1.05, transition: { duration: 0.2 } },
    tap: { scale: 0.95 },
  };

  return (
    <div className="mx-auto px-4 py-6 max-w-(--breakpoint-xl)">
      {/* Filtering controls */}
      <div className="mb-8">
        {/* Search and clear filters */}
        <div className="flex md:flex-row flex-col justify-between items-center gap-3 mb-4">
          <motion.div
            className="relative w-full max-w-md"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Search className="top-1/2 rtl:right-3 ltr:left-3 absolute w-4 h-4 text-muted-foreground -translate-y-1/2" />
            <Input
              placeholder={t("searchPlaceholder")}
              value={searchTerm}
              onChange={handleSearch}
              className="rtl:pr-9 ltr:pl-9 w-full"
            />
            <AnimatePresence>
              {searchTerm && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  whileHover={{ scale: 1.2 }}
                  onClick={() => {
                    setSearchTerm("");
                    updateUrlParams({ search: null });
                  }}
                  className="top-1/2 ltr:right-3 rtl:left-3 absolute text-muted-foreground hover:text-foreground -translate-y-1/2"
                >
                  <X className="w-4 h-4" />
                </motion.button>
              )}
            </AnimatePresence>
          </motion.div>

          <AnimatePresence>
            {filterCount > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="px-2 text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4" />
                  {t("clearFilters")}
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Group filter tabs */}
        <motion.div
          className="w-full overflow-x-auto pb-2 mb-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex items-center gap-2 min-w-max">
            {groups.map((group: any, index: number) => (
              <motion.div
                key={group}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 + 0.3 }}
                whileHover="hover"
                whileTap="tap"
                variants={filterButtonVariants}
              >
                <Button
                  variant={activeGroup === group ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleGroupChange(group)}
                  className="whitespace-nowrap"
                >
                  {t(`filters.${group}`)}
                </Button>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Active filters display */}
        <AnimatePresence>
          {filterCount > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-wrap items-center gap-2 mb-4"
            >
              {activeGroup !== "All" && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3 }}
                >
                  <Badge
                    variant="outline"
                    className="flex items-center gap-1 px-3 py-1.5"
                  >
                    <span>
                      {t(`filters.group`)}: {t(`filters.${activeGroup}`)}
                    </span>
                    <motion.button
                      whileHover={{ scale: 1.2, rotate: 90 }}
                      transition={{ duration: 0.2 }}
                      onClick={() => {
                        setActiveGroup("All");
                        updateUrlParams({ group: null });
                      }}
                      className="hover:bg-secondary mx-1 px-0.5 rounded-full"
                    >
                      <X className="w-3 h-3" />
                    </motion.button>
                  </Badge>
                </motion.div>
              )}

              {searchTerm && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  <Badge
                    variant="outline"
                    className="flex items-center gap-1 py-1.5 pr-2 pl-3"
                  >
                    <span>
                      {t("search")}: {searchTerm}
                    </span>
                    <motion.button
                      whileHover={{ scale: 1.2, rotate: 90 }}
                      transition={{ duration: 0.2 }}
                      onClick={() => {
                        setSearchTerm("");
                        updateUrlParams({ search: null });
                      }}
                      className="hover:bg-secondary ml-1 p-0.5 rounded-full"
                    >
                      <X className="w-3 h-3" />
                    </motion.button>
                  </Badge>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Results count */}
      <motion.div
        className="mb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <p className="text-muted-foreground">
          {t("numServices")}
          <motion.span
            key={filteredServices.length}
            initial={{ opacity: 0, scale: 1.2 }}
            animate={{ opacity: 1, scale: 1 }}
            className="ml-1 font-medium"
          >
            {filteredServices.length}
          </motion.span>
        </p>
      </motion.div>

      {/* Services grid */}
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            className="gap-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 auto-rows-fr"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {Array.from({ length: ITEMS_PER_PAGE }).map((_, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  transition: { delay: index * 0.05 },
                }}
                className="h-full"
              >
                <ServiceCardSkeleton />
              </motion.div>
            ))}
          </motion.div>
        ) : filteredServices.length > 0 ? (
          <motion.div
            key={`filtered-${filterKey}-page-${currentPage}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="gap-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 auto-rows-fr"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <AnimatePresence>
                {displayedServices.map((service: any, index) => (
                  <ServiceCard
                    key={service.documentTypeId}
                    service={service}
                    index={index}
                  />
                ))}
              </AnimatePresence>
            </motion.div>

            {/* Pagination controls */}
            {totalPages > 1 && (
              <motion.div
                className="flex justify-center items-center gap-1 mt-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="w-4 h-4 rtl:rotate-180" />
                  </Button>
                </motion.div>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => {
                    // Show limited page numbers for better UI when many pages exist
                    if (
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1)
                    ) {
                      return (
                        <motion.div
                          key={page}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Button
                            variant={
                              currentPage === page ? "default" : "outline"
                            }
                            size="icon"
                            onClick={() => handlePageChange(page)}
                            className="w-8 h-8"
                          >
                            {page}
                          </Button>
                        </motion.div>
                      );
                    } else if (
                      page === currentPage - 2 ||
                      page === currentPage + 2
                    ) {
                      return (
                        <Button
                          key={page}
                          variant="outline"
                          size="icon"
                          disabled
                          className="w-8 h-8"
                        >
                          ...
                        </Button>
                      );
                    }
                    return null;
                  }
                )}

                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="w-4 h-4 rtl:rotate-180" />
                  </Button>
                </motion.div>
              </motion.div>
            )}
          </motion.div>
        ) : (
          <motion.div
            className="py-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="inline-flex justify-center items-center bg-gray-50 dark:bg-gray-800 mb-4 p-8 rounded-full"
              initial={{ scale: 0.8, rotate: -5 }}
              animate={{
                scale: 1,
                rotate: 0,
                transition: {
                  type: "spring",
                  stiffness: 200,
                  damping: 20,
                },
              }}
            >
              <Filter className="w-10 h-10 text-muted-foreground" />
            </motion.div>
            <motion.p
              className="text-gray-600 dark:text-gray-300 text-xl"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {t("noData")}
            </motion.p>
            <motion.p
              className="mt-2 text-gray-500 dark:text-gray-400"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {t("tryAdjusting")}
            </motion.p>
            {filterCount > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={clearFilters}
                >
                  {t("clearAllFilters")}
                </Button>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
