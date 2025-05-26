"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ChangeEvent,
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArchiveX, ArrowDownUp, X } from "lucide-react";
import ColumnVisibilityDropdown from "./ColumnVisibilityDropdown";
import PaginationControls from "./PaginationControls";
import { cn } from "@/lib/utils";
import ActionsDropdown from "./ActionsDropdown";
import TooltipChildren from "../ui/TooltipChildren";
import ImageWithFallback from "../shared/ImageWithFallback";

// Improved type definition with more specific types
type DataItem = Record<string, any>;

type DataTableProps = {
  data: DataItem[];
  pageSize?: number;
  showActions?: boolean;
  defaultHide?: string[];
  sortableCols?: string[];
  ImgCols?: string[];
  enableSearch?: boolean;
  colStyle?: Record<string, Record<string, string>>;
  priority?: Record<string, number>;
  hiddenCols?: string[];
  onView?: (item: DataItem) => void;
  onEdit?: (item: DataItem) => void;
  onDelete?: (item: DataItem) => void;
};

const DataTable = ({
  data,
  pageSize = 15,
  showActions = false,
  defaultHide = [],
  sortableCols = [],
  ImgCols = [],
  enableSearch = false,
  colStyle = {},
  priority = {},
  hiddenCols = [],
  onView,
  onEdit,
  onDelete,
}: DataTableProps) => {
  // Move this calculation to useMemo to prevent unnecessary recalculations
  const allKeys = useMemo(
    () => Object.keys(data[0] || {}).filter((key) => !hiddenCols.includes(key)),
    [data, hiddenCols]
  );

  const initialVisibilityState = useMemo(
    () =>
      allKeys.reduce<Record<string, boolean>>((acc, key) => {
        acc[key] = !defaultHide.includes(key);
        return acc;
      }, {}),
    [allKeys, defaultHide]
  );

  const [visibleColumns, setVisibleColumns] = useState(initialVisibilityState);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageS, setPageS] = useState(pageSize);
  const [isSearchFocused, setIsSearchFocused] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState({ key: "", value: "" });
  const [filteredData, setFilteredData] = useState<DataItem[]>(data);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);
  const [isSelectOpen, setIsSelectOpen] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const selectTriggerRef = useRef<HTMLButtonElement>(null);
  const selectContentRef = useRef<HTMLDivElement>(null);

  // Update filtered data when source data changes
  useEffect(() => {
    setFilteredData(data);
  }, [data]);

  // Memoize toggle column handler
  const handleToggleColumn = useCallback((key: string) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  }, []);

  // Memoize search handler
  const handleSearch = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value.toLowerCase();
      setSearchValue((prev) => ({ ...prev, value }));

      if (value) {
        const searchKey = searchValue.key;
        const filteredResults = data.filter((item) => {
          if (searchKey) {
            if (typeof item[searchKey] === "string") {
              return item[searchKey]?.toString().toLowerCase().includes(value);
            } else {
              return item[searchKey] === Number(value);
            }
          }
          return Object.values(item).some((val) =>
            val?.toString().toLowerCase().includes(value)
          );
        });

        setFilteredData(filteredResults);
        setCurrentPage(1);
      } else {
        setFilteredData(data);
      }
    },
    [data, searchValue.key]
  );

  // Memoize select key handler
  const handleSelectKey = useCallback(
    (val: string) => {
      setSearchValue((prev) => ({ ...prev, key: val }));

      // Determine the type of the key for filtering
      const keyType = typeof data[0]?.[val]; // Get the type of the first item's key

      if (searchValue.value.trim()) {
        const filteredResults = data.filter((item) => {
          const keyValue = item[val];

          if (keyType === "string") {
            // Case-insensitive substring search for strings
            return keyValue
              ?.toLowerCase()
              .includes(searchValue.value.toLowerCase());
          } else if (keyType === "number") {
            // Exact match for numbers
            return keyValue === Number(searchValue.value);
          }
          // Handle other data types as needed
          return false;
        });

        setFilteredData(filteredResults);
        setCurrentPage(1); // Reset to the first page
      } else {
        // If input is empty, reset to the full dataset
        setFilteredData(data);
      }

      // Focus the input after selecting the key
      if (inputRef.current) {
        inputRef.current.focus();
      }
    },
    [data, searchValue.value]
  );

  // Handle clicks outside to manage focus and select dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const isClickInsideRefs =
        (inputRef.current && inputRef.current.contains(event.target as Node)) ||
        (selectTriggerRef.current &&
          selectTriggerRef.current.contains(event.target as Node)) ||
        (selectContentRef.current &&
          selectContentRef.current.contains(event.target as Node));

      if (!isClickInsideRefs) {
        setIsSearchFocused(false);
        setIsSelectOpen(false); // Ensure the select dialog closes
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Memoize sort handler
  const handleSort = useCallback((key: string) => {
    setSortConfig((prev) => {
      const direction =
        prev?.key === key && prev.direction === "asc" ? "desc" : "asc";

      // Use a functional update that doesn't depend on filteredData in the closure
      setFilteredData((currentData) => {
        return [...currentData].sort((a, b) => {
          if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
          if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
          return 0;
        });
      });

      return { key, direction };
    });
  }, []);

  // Memoize pagination calculations
  const { paginatedData, totalPages } = useMemo(() => {
    const paginatedData = filteredData.slice(
      (currentPage - 1) * pageS,
      currentPage * pageS
    );
    const totalPages = Math.ceil(filteredData.length / pageS);
    return { paginatedData, totalPages };
  }, [filteredData, currentPage, pageS]);

  // Memoize sorted keys
  const sortedKeys = useMemo(() => {
    return allKeys.sort((a, b) => {
      const priorityA = priority[a] || Infinity;
      const priorityB = priority[b] || Infinity;
      return priorityA - priorityB;
    });
  }, [allKeys, priority]);

  // Memoize pagination handlers
  const handlePrevPage = useCallback(() => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  }, []);

  const handleNextPage = useCallback(() => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  }, [totalPages]);

  // Memoize clear search handler
  const handleClearSearch = useCallback(() => {
    setSearchValue({ key: "", value: "" });
    setFilteredData(data);
    setIsSearchFocused(false);
    setIsSelectOpen(false);
  }, [data]);

  // Memoize page size handler
  const handlePageSizeChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setPageS(e.target.value === "" ? pageSize : Number(e.target.value));
      setCurrentPage(1);
    },
    [pageSize]
  );

  return (
    <div className="w-full">
      <div className="flex justify-between items-center w-full">
        {enableSearch && (
          <div className="relative w-1/3 min-w-[200px]">
            <Input
              ref={inputRef}
              placeholder="Search by key"
              className={cn(
                "w-full min-w-[200px]",
                isSearchFocused &&
                  "ltr:pl-[78px] ltr:md:pl-[88px] rtl:pr-[78px] rtl:md:pr-[88px]"
              )}
              value={searchValue.value}
              onChange={handleSearch}
              onFocus={() => setIsSearchFocused(true)}
            />
            {searchValue.value && (
              <Button
                onClick={handleClearSearch}
                variant="softDestructive"
                size="icon"
                className="top-1/2 ltr:right-1 rtl:left-1 absolute flex justify-center items-center rounded-full w-7 h-7 -translate-y-1/2"
              >
                <X />
              </Button>
            )}

            {isSearchFocused && (
              <Select
                open={isSelectOpen}
                onOpenChange={setIsSelectOpen}
                onValueChange={handleSelectKey}
              >
                <SelectTrigger
                  ref={selectTriggerRef}
                  className="top-1/2 rtl:right-0.5 ltr:left-0.5 absolute bg-muted rounded-sm w-[70px] md:w-[80px] h-8 -translate-y-1/2"
                >
                  <SelectValue placeholder={searchValue.key || "all"} />
                </SelectTrigger>
                <SelectContent ref={selectContentRef}>
                  {allKeys.map((key) => (
                    <SelectItem key={key} value={key}>
                      {key}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        )}
        <div className="flex items-center gap-1">
          <Input
            type="number"
            min={1}
            className="w-[70px]"
            placeholder={String(pageSize)}
            onChange={handlePageSizeChange}
          />

          <ColumnVisibilityDropdown
            tooltipMessage="Toggle Columns"
            columns={allKeys}
            visibleColumns={visibleColumns}
            onToggleColumn={handleToggleColumn}
          />
        </div>
      </div>

      <div className="mt-2 border rounded-md w-full overflow-hidden overflow-x-auto">
        <table className="w-full min-w-[550px] overflow-x-auto">
          <thead className="bg-secondary/80 text-muted-foreground capitalize">
            <tr className="text-xs md:text-sm xl:text-base text-center">
              {sortedKeys.map(
                (key) =>
                  visibleColumns[key] && (
                    <th key={key} className="px-2 h-10 whitespace-nowrap">
                      {sortableCols.includes(key) ? (
                        <div className="flex rtl:flex-row-reverse justify-center items-center gap-1">
                          <span>{key}</span>
                          <TooltipChildren message="Sort">
                            <Button
                              onClick={() => handleSort(key)}
                              size="icon"
                              variant="link"
                              className={`text-primary/50 hover:text-primary`}
                            >
                              <ArrowDownUp />
                            </Button>
                          </TooltipChildren>
                        </div>
                      ) : (
                        key
                      )}
                    </th>
                  )
              )}
              {showActions && <th className="px-2 h-auto min-h-10">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map((item, index) => (
                <tr
                  key={index}
                  className="hover:bg-secondary/50 border-b last:border-none h-auto min-h-10 text-xs md:text-sm xl:text-base text-center transition-all"
                >
                  {sortedKeys.map((key: string) =>
                    visibleColumns[key] ? (
                      ImgCols.includes(key) ? (
                        <td key={key} className="px-2 py-2 whitespace-nowrap">
                          <div className="relative mx-auto border rounded-sm w-[60px] h-[60px] overflow-hidden">
                            <ImageWithFallback
                              src={item[key] || "/images/noImage.png"}
                              alt="product image"
                              className="hover:scale-110 transition-all"
                            />
                          </div>
                        </td>
                      ) : (
                        <td
                          key={key}
                          className="px-2 w-max max-w-[80px] truncate whitespace-nowrap"
                        >
                          <span
                            className={cn(
                              colStyle[key]?.[
                                item[key]?.toString().toLowerCase()
                              ],
                              ""
                            )}
                          >
                            {item[key] || "--"}
                          </span>
                        </td>
                      )
                    ) : null
                  )}
                  {showActions && (
                    <td
                      className={cn(
                        "flex justify-center items-center h-full min-h-10 text-center",
                        ImgCols.length ? "mt-[18px]" : ""
                      )}
                    >
                      <ActionsDropdown
                        item={item}
                        onView={onView}
                        onEdit={onEdit}
                        onDelete={onDelete}
                      />
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={allKeys.length + (showActions ? 1 : 0)}
                  className="py-4 text-muted-foreground text-center"
                >
                  <ArchiveX className="mx-auto" size={32} />
                  No Data Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        onPrevPage={handlePrevPage}
        onNextPage={handleNextPage}
        dataLength={data.length}
      />
    </div>
  );
};

export default DataTable;
