/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Controller } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { InfoIcon, X, Loader2, ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTranslations } from "next-intl";

interface DynamicMultiSelectProps {
  component: any;
  control: any;
  errors: any;
  getTranslation: (key: string, type?: string) => string;
  dynamicSelectOptions: Record<string, any[]>;
  isLoading?: Record<string, boolean>;
  handleLogicTrigger?: (componentKey: string, value: any) => void;
  authToken?: string;
}

const DynamicMultiSelect = ({
  component,
  control,
  errors,
  getTranslation,
  dynamicSelectOptions,
  isLoading = {},
  handleLogicTrigger,
  authToken,
}: DynamicMultiSelectProps) => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [hasFetched, setHasFetched] = useState(false);
  const t = useTranslations("DynamicComponents.select");

  // Memoize the component's data properties to prevent unnecessary effect triggers
  const componentData = useMemo(
    () => ({
      key: component.key,
      type: component.type,
      dataSrc: component.dataSrc,
      url: component.data?.url,
      values: component.data?.values,
      headers: component.data?.headers,
    }),
    [component]
  );

  // Get value from option - memoized to prevent recreation
  const getValue = useCallback((option: any): string => {
    if (!option) return "";

    // Try standard properties first
    if (option.value !== undefined) return String(option.value);
    if (option.id !== undefined) return String(option.id);
    if (option.code !== undefined) return String(option.code);

    // For primitive values
    if (typeof option !== "object") return String(option);

    // For objects without standard properties, look for other identifiable fields
    const potentialValueKeys = ["key", "name", "identifier", "text"];
    for (const key of potentialValueKeys) {
      if (option[key] !== undefined) return String(option[key]);
    }

    // Last resort - use a hash of the object
    try {
      return JSON.stringify(option);
    } catch {
      return String(option);
    }
  }, []);

  // Get label from option with fallbacks - memoized
  const getDisplayLabel = useCallback(
    (option: any): string => {
      if (!option) {
        return "Unknown";
      }

      // If we have a template, use it
      if (component.template && typeof option === "object") {
        try {
          // Extract the key from template
          const keyMatch = component.template.match(
            /\{\{\s*item\.([^}]+)\s*\}\}/
          );
          const key = keyMatch ? keyMatch[1] : null;

          if (key && option[key] !== undefined) {
            return String(option[key]);
          }
        } catch (error) {
          console.error("Error processing template:", error);
        }
      }

      // Try common properties
      if (option.text !== undefined) return String(option.text);
      if (option.label !== undefined) return String(option.label);
      if (option.name !== undefined) return String(option.name);

      // For primitive values
      if (typeof option !== "object") return String(option);

      // Last resort
      return String(option.id || option.value || "Unknown");
    },
    [component.template]
  );

  // Determine the current options - memoized to prevent recalculation
  const currentOptions = useMemo(() => {
    // Use dynamic options if available
    if (dynamicSelectOptions[componentData.key]) {
      return dynamicSelectOptions[componentData.key];
    }

    // Use component's static values if available
    if (componentData.values) {
      return componentData.values;
    }

    return [];
  }, [dynamicSelectOptions, componentData.key, componentData.values]);

  // Fetch options from URL if configured - runs only once
  useEffect(() => {
    const fetchOptionsFromUrl = async () => {
      if (
        componentData.type === "select" &&
        componentData.dataSrc === "url" &&
        componentData.url &&
        !hasFetched
      ) {
        try {
          // Validate URL before fetching
          try {
            new URL(componentData.url);
          } catch {
            console.warn(
              `Invalid URL for ${componentData.key}: ${componentData.url}. Skipping fetch.`
            );
            return;
          }

          // Extract headers from component configuration
          const headers: Record<string, string> = {};
          if (componentData.headers && Array.isArray(componentData.headers)) {
            componentData.headers.forEach((header: any) => {
              if (header.key && typeof header.key === "string") {
                if (header.key === "Authorization" && authToken) {
                  headers[header.key] = `Bearer ${authToken}`;
                } else {
                  headers[header.key] = header.value || "";
                }
              }
            });
          }

          // If no Authorization header is set but we have a token, add it
          if (!headers["Authorization"] && authToken) {
            headers["Authorization"] = `Bearer ${authToken}`;
          }

          const response = await fetch(componentData.url, {
            method: "GET",
            headers,
          });

          if (!response.ok) {
            throw new Error(
              `Failed to fetch options for ${componentData.key}: ${response.statusText}`
            );
          }

          const data = await response.json();
          setHasFetched(true);
        } catch (error) {
          console.error(
            `Error fetching options for ${componentData.key}:`,
            error
          );
        }
      }
    };

    fetchOptionsFromUrl();
  }, [componentData, authToken, hasFetched]);

  // Filter options based on search query - memoized
  const filteredOptions = useMemo(() => {
    return searchQuery
      ? currentOptions.filter((option: any) => {
          const label = option.label || option.text || "";
          return getTranslation(label)
            .toLowerCase()
            .includes(searchQuery.toLowerCase());
        })
      : currentOptions;
  }, [searchQuery, currentOptions, getTranslation]);

  // Toggle option selection - memoized callback
  const toggleOption = useCallback(
    (field: any, optionValue: string) => {
      const selectedValues = Array.isArray(field.value) ? field.value : [];

      // Check if this value is already selected
      const isSelected = selectedValues.some(
        (v: any) =>
          (typeof v === "object" &&
            v !== null &&
            (v.id === optionValue || v.value === optionValue)) ||
          v === optionValue
      );

      let newValues;
      if (isSelected) {
        // Remove if already selected
        newValues = selectedValues.filter(
          (v: any) =>
            !(
              typeof v === "object" &&
              v !== null &&
              (v.id === optionValue || v.value === optionValue)
            ) && v !== optionValue
        );
      } else {
        // Add if not selected
        const selectedOption = currentOptions.find(
          (opt: any) => opt.value === optionValue || opt.id === optionValue
        );

        newValues = [
          ...selectedValues,
          {
            id: selectedOption?.id || selectedOption?.value || optionValue,
            text: selectedOption?.label || selectedOption?.text || "Unknown",
          },
        ];
      }

      field.onChange(newValues);

      if (handleLogicTrigger) {
        handleLogicTrigger(componentData.key, newValues);
      }
    },
    [currentOptions, handleLogicTrigger, componentData.key]
  );

  // Clear all selections - memoized callback
  const clearAll = useCallback(
    (field: any) => {
      field.onChange([]);
      if (handleLogicTrigger) {
        handleLogicTrigger(componentData.key, []);
      }
    },
    [handleLogicTrigger, componentData.key]
  );

  // Remove single selection - memoized callback
  const removeOption = useCallback(
    (field: any, valueToRemove: any) => {
      const newValue = field.value.filter((v: any) => v !== valueToRemove);
      field.onChange(newValue);
      if (handleLogicTrigger) {
        handleLogicTrigger(componentData.key, newValue);
      }
    },
    [handleLogicTrigger, componentData.key]
  );

  return (
    <div className={`mb-4 ${component.customClass || ""}`}>
      <Controller
        name={componentData.key}
        control={control}
        defaultValue={component.defaultValue || []}
        render={({ field }) => {
          const selectedValues = Array.isArray(field.value) ? field.value : [];

          // Get selected items labels - memoized per render
          const selectedLabels = useMemo(
            () =>
              selectedValues.map((value) => {
                if (typeof value === "object" && value !== null) {
                  return value.text || getTranslation(value.label || "Option");
                }
                const option = currentOptions.find(
                  (opt: any) => opt.value === value || opt.id === value
                );
                return option
                  ? getTranslation(option.label || option.text || "Option")
                  : value;
              }),
            [selectedValues, currentOptions, getTranslation]
          );

          return (
            <div>
              <Label htmlFor={field.name} className="block mb-2">
                {getTranslation(component.label)}
                {component.validate?.required && (
                  <span className="ml-1 text-destructive">*</span>
                )}
              </Label>
              {component.tooltip && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="inline-flex ml-1 cursor-help">
                        <InfoIcon className="w-4 h-4 text-muted-foreground" />
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{getTranslation(component.tooltip)}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
              {component.description && (
                <p className="mb-2 text-muted-foreground text-sm">
                  {getTranslation(component.description)}
                </p>
              )}

              <div className="relative">
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={open}
                      className={cn(
                        "w-full h-9 justify-between",
                        errors[componentData.key] ? "border-destructive" : "",
                        !selectedValues.length && "text-muted-foreground"
                      )}
                      disabled={
                        component.disabled || isLoading[componentData.key]
                      }
                    >
                      {isLoading[componentData.key] ? (
                        <div className="flex items-center">
                          <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                          <span>{t("loading")}</span>
                        </div>
                      ) : selectedValues.length > 0 ? (
                        <span className="truncate">
                          {selectedLabels.length === 1
                            ? selectedLabels[0]
                            : `${selectedLabels.length} ${t("itemsSelected")}`}
                        </span>
                      ) : (
                        <span>
                          {getTranslation(
                            component.placeholder || t("placeholder")
                          )}
                        </span>
                      )}
                      <ChevronDown className="opacity-50 ml-2 w-4 h-4 shrink-0" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="p-0 w-(--radix-popover-trigger-width) min-w-[220px]">
                    {/* Search input */}
                    <div className="px-3 py-2 border-b">
                      <input
                        type="text"
                        className="px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-primary/20 w-full text-sm"
                        placeholder={t("searchPlaceholder")}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>

                    <ScrollArea className="h-[220px]">
                      <div className="p-1">
                        {filteredOptions.length > 0 ? (
                          filteredOptions.map((option: any, idx: number) => {
                            const optionValue =
                              option.value ||
                              option.id ||
                              `option-${idx}-fallback`;
                            if (optionValue === "") {
                              return null;
                            }

                            const isSelected = selectedValues.some(
                              (v) =>
                                (typeof v === "object" &&
                                  v !== null &&
                                  (v.id === optionValue ||
                                    v.value === optionValue)) ||
                                v === optionValue
                            );

                            return (
                              <div
                                key={`option-${idx}`}
                                className={cn(
                                  "flex items-center justify-between px-3 py-2 cursor-pointer rounded-sm text-sm",
                                  isSelected
                                    ? "bg-primary/10 text-primary"
                                    : "hover:bg-muted"
                                )}
                                onClick={() => toggleOption(field, optionValue)}
                              >
                                <span>
                                  {getTranslation(
                                    option.label || option.text || "Option"
                                  )}
                                </span>
                                {isSelected && (
                                  <div className="flex justify-center items-center bg-primary rounded-sm w-4 h-4">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="16"
                                      height="16"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="3"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      className="text-white"
                                    >
                                      <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                  </div>
                                )}
                              </div>
                            );
                          })
                        ) : (
                          <div className="p-3 text-muted-foreground text-sm text-center">
                            {t("noOptionsAvailable")}
                          </div>
                        )}
                      </div>
                    </ScrollArea>

                    {selectedValues.length > 0 && (
                      <div className="flex justify-between items-center bg-muted/40 p-2 border-t">
                        <span className="text-muted-foreground text-xs">
                          {selectedValues.length} {t("selected")}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => clearAll(field)}
                          className="h-7 text-xs"
                        >
                          {t("clearAll")}
                        </Button>
                      </div>
                    )}
                  </PopoverContent>
                </Popover>

                {/* Show selected values as tags */}
                <div className="flex items-center gap-1 flex-wrap mt-1">
                  {Array.isArray(field.value) && field.value.length > 0 ? (
                    field.value.map((val: any, idx: number) => {
                      let label;
                      const valueToRemove = val;

                      if (typeof val === "object" && val !== null) {
                        label = val.text || val.label || "Unknown";
                      } else {
                        const option = currentOptions.find(
                          (opt: any) => getValue(opt) === String(val)
                        );
                        label = option ? getDisplayLabel(option) : String(val);
                      }

                      return (
                        <Badge
                          variant="secondary"
                          key={`selected-${idx}`}
                          className="flex items-center gap-2 px-1"
                        >
                          <span>{label}</span>
                          {!component.disabled && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeOption(field, valueToRemove);
                              }}
                              className="rounded-full outline-none focus:ring-2 focus:ring-ring ring-offset-background focus:ring-offset-2"
                            >
                              <X className="w-3 h-3 text-red-500 bg-red-500/10 hover:bg-red-500/20 rounded-full duration-200 transition-colors" />
                              <span className="sr-only">Remove</span>
                            </button>
                          )}
                        </Badge>
                      );
                    })
                  ) : (
                    <span className="text-muted-foreground">
                      {getTranslation(
                        component.placeholder || "Select options"
                      )}
                    </span>
                  )}
                </div>
              </div>

              {errors[componentData.key] && (
                <p className="mt-1 text-destructive text-sm">
                  {errors[componentData.key]?.message ||
                    getTranslation(component.label, "required")}
                </p>
              )}
            </div>
          );
        }}
      />
    </div>
  );
};

export default React.memo(DynamicMultiSelect);
