// components/ui/data-table/DocumentTypeFilter.tsx
"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Filter } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";

interface DocumentTypeFilterProps {
  types: string[] | undefined | null;
  selectedType: string | null;
  onSelect: (type: string | null) => void;
}

export function DocumentTypeFilter({
  types = [], // Provide a default empty array
  selectedType,
  onSelect,
}: DocumentTypeFilterProps) {
  const [open, setOpen] = React.useState(false);

  // Ensure types is always a valid array
  const safeTypes = React.useMemo(() => {
    if (!types) return [];
    if (!Array.isArray(types)) {
      console.warn("DocumentTypeFilter: 'types' prop is not an array:", types);
      return [];
    }
    return types;
  }, [types]);

  return (
    <div className="flex items-center gap-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="flex justify-between items-center gap-2"
          >
            <Filter className="w-4 h-4" />
            <span>Filter by Type</span>
            {selectedType && (
              <Badge variant="secondary" className="mx-2">
                1
              </Badge>
            )}
            <ChevronsUpDown className="opacity-50 w-4 h-4 shrink-0" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0 w-[300px]">
          <Command>
            <CommandInput placeholder="Search document types..." />
            <CommandList>
              <CommandEmpty>No document type found.</CommandEmpty>
              <CommandGroup>
                <CommandItem
                  onSelect={() => {
                    onSelect(null);
                    setOpen(false);
                  }}
                  className="flex justify-between items-center"
                >
                  <span>All Types</span>
                  {selectedType === null && (
                    <Check className="w-4 h-4 text-primary" />
                  )}
                </CommandItem>
                {safeTypes.map((type) => (
                  <CommandItem
                    key={type}
                    onSelect={() => {
                      onSelect(selectedType === type ? null : type);
                      setOpen(false);
                    }}
                    className="flex justify-between items-center"
                  >
                    <span className="truncate">{type}</span>
                    {selectedType === type && (
                      <Check className="w-4 h-4 text-primary" />
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {selectedType && (
        <Badge
          variant="secondary"
          className="gap-1 cursor-pointer"
          onClick={() => onSelect(null)}
        >
          {selectedType.length > 25
            ? selectedType.slice(0, 25) + "..."
            : selectedType}
          <span className="font-bold">×</span>
        </Badge>
      )}
    </div>
  );
}
