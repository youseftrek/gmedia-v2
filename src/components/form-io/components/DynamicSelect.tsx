import React, { useState, useCallback, useMemo, useEffect } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useFormContext as useCustomFormContext } from "../context/FormContext";
import { useFormContext as useRHFormContext } from "react-hook-form";

interface DynamicSelectProps {
  component: any;
  control: any;
  errors: any;
  getTranslation: (key: string, type?: string) => string;
  dynamicOptions?: any[];
  watch?: any;
  sessionToken?: any;
  setValue?: any;
  handleLogicTrigger?: (componentKey: string, value: any) => void;
}

export default function DynamicSelect({
  component,
  control,
  errors,
  getTranslation,
  dynamicOptions,
  setValue,
  handleLogicTrigger,
}: DynamicSelectProps) {
  const [open, setOpen] = useState(false);
  const { setFormValue, formData } = useCustomFormContext();
  const { getFieldState } = useRHFormContext();

  // Get options from either dynamic options (API) or static values
  const options = useMemo(
    () =>
      dynamicOptions || (component.data?.values ? component.data.values : []),
    [dynamicOptions, component.data?.values]
  );

  // Add debugging
  useEffect(() => {
    if (
      component.key === "saudiAgeClassification" ||
      component.key === "gameConsolesEn"
    ) {
      console.log(
        `[DynamicSelect] Component ${component.key} has options:`,
        options
      );
    }
  }, [component.key, options]);

  // Determine if options are simple values or objects
  const isSimpleValue = useMemo(() => {
    if (!options.length) return true;
    const firstOption = options[0];
    return (
      typeof firstOption !== "object" ||
      (typeof firstOption === "object" &&
        !("id" in firstOption) &&
        !("text" in firstOption) &&
        !("value" in firstOption) &&
        !("label" in firstOption))
    );
  }, [options]);

  // Extract display text for UI presentation with normalized property access
  const getDisplayText = useCallback(
    (option: any): string => {
      if (option === null || option === undefined) return "";

      if (isSimpleValue) {
        return String(option);
      }

      // For objects, check template first
      if (component.template) {
        const match = component.template.match(/{{[\s]*item\.([\w]+)[\s]*}}/i);
        if (match && match[1] && option[match[1]] !== undefined) {
          return String(option[match[1]]);
        }
      }

      // Map of all possible property names to check for display values
      const displayProps = [
        "text",
        "label",
        "name",
        "title",
        "display",
        "gameNameAr",
        "gameNameEn",
        "description",
        "value",
        "id",
      ];

      // Check each possible display property
      for (const prop of displayProps) {
        if (option[prop] !== undefined && option[prop] !== null) {
          return String(option[prop]);
        }
      }

      // Last resort - try to stringify
      try {
        return JSON.stringify(option);
      } catch (e) {
        return String(option);
      }
    },
    [component.template, isSimpleValue]
  );

  // Process selected value - maintain original object structure with intelligent mapping
  const processValue = useCallback(
    (option: any) => {
      // For primitive values, return as-is
      if (isSimpleValue || typeof option !== "object" || option === null) {
        return option;
      }

      // Copy all the potentially useful properties from the original object
      const processedValue: Record<string, any> = {};

      // Core identifiers always included
      if ("id" in option) processedValue.id = option.id;
      if ("value" in option) processedValue.value = option.value;

      // Text/label representation
      if ("text" in option) processedValue.text = option.text;
      if ("label" in option && !("text" in processedValue)) {
        processedValue.text = option.label;
      }
      if ("name" in option && !("text" in processedValue)) {
        processedValue.text = option.name;
      }

      // For game console platforms with specific data structure
      if (
        component.key === "gameConsolesEn" ||
        component.key.includes("Platform")
      ) {
        if (typeof option === "object") {
          // Ensure we have the minimum required properties
          if (
            !("id" in processedValue) &&
            ("text" in option || "value" in option)
          ) {
            processedValue.id = option.text || option.value;
          }
          if (
            !("text" in processedValue) &&
            ("text" in option || "label" in option)
          ) {
            processedValue.text = option.text || option.label;
          }
        }
      }

      // Add any additional properties that might be needed for API calls
      const importantProps = ["code", "type", "key", "console", "platform"];
      importantProps.forEach((prop) => {
        if (prop in option) processedValue[prop] = option[prop];
      });

      // If we couldn't extract core properties, return the original
      if (Object.keys(processedValue).length < 2) {
        return option;
      }

      return processedValue;
    },
    [isSimpleValue, component.key]
  );

  // Find selected option index
  const findSelectedOptionIndex = useCallback(
    (value: any): number => {
      if (value === null || value === undefined) return -1;

      if (isSimpleValue) {
        return options.findIndex((opt: any) => String(opt) === String(value));
      }

      return options.findIndex((opt: any) => {
        if (typeof opt !== "object") return false;
        if (typeof value !== "object") return false;

        // Match by id if available
        if ("id" in opt && "id" in value) {
          return opt.id === value.id;
        }

        // Match by value if available
        if ("value" in opt && "value" in value) {
          return opt.value === value.value;
        }

        // Match by text if available
        if ("text" in opt && "text" in value) {
          return opt.text === value.text;
        }

        // Fall back to text comparison
        return getDisplayText(opt) === getDisplayText(value);
      });
    },
    [options, isSimpleValue, getDisplayText]
  );

  // Generate unique IDs for each option
  const optionsWithUniqueIds = useMemo(() => {
    return options.map((option: any, index: number) => ({
      ...option,
      _uniqueId: `${component.key}-${index}-${
        typeof option === "object" ? option.id || "" : ""
      }`,
    }));
  }, [options, component.key]);

  return (
    <FormField
      control={control}
      name={component.key}
      render={({ field }) => {
        const selectedIndex = findSelectedOptionIndex(field.value);
        const selectedOption =
          selectedIndex >= 0 ? options[selectedIndex] : field.value;

        return (
          <FormItem className="mb-4">
            {!component.hideLabel && (
              <FormLabel
                className={
                  component.labelPosition === "top" ? "block" : "inline-block"
                }
              >
                {getTranslation(component.label)}
                {component.validate?.required && (
                  <span className="text-red-500 ml-1">*</span>
                )}
              </FormLabel>
            )}

            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={cn(
                      "w-full justify-between",
                      "flex h-9 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background",
                      "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                      "disabled:cursor-not-allowed disabled:opacity-50",
                      !field.value && "text-muted-foreground",
                      component.customClass
                    )}
                    disabled={component.disabled}
                    onClick={() => setOpen(!open)}
                  >
                    <span className="grow ltr:text-left rtl:text-right truncate">
                      {field.value
                        ? getTranslation(getDisplayText(selectedOption))
                        : getTranslation(
                            component.placeholder || `Select ${component.label}`
                          )}
                    </span>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  {component.searchEnabled && (
                    <CommandInput
                      placeholder={getTranslation("Type to search")}
                      className="h-9 mx-0.5"
                    />
                  )}
                  <CommandList>
                    <CommandEmpty>
                      {getTranslation("No results found")}
                    </CommandEmpty>
                    <CommandGroup className="max-h-64 overflow-auto">
                      {optionsWithUniqueIds.map(
                        (option: any, index: number) => {
                          const displayText = getDisplayText(option);
                          const isSelected = index === selectedIndex;

                          return (
                            <CommandItem
                              key={option._uniqueId}
                              value={option._uniqueId}
                              onSelect={() => {
                                // Remove the internal _uniqueId property before storing
                                const { _uniqueId, ...cleanOption } = option;
                                const processedValue =
                                  processValue(cleanOption);

                                // Log the selection for specific components
                                if (
                                  component.key === "saudiAgeClassification" ||
                                  component.key.includes("game")
                                ) {
                                  console.log(`Selected ${component.key}:`, {
                                    original: cleanOption,
                                    processed: processedValue,
                                  });
                                }

                                // For nested fields (like age classifications), we need to handle them differently
                                if (component.key.includes(".")) {
                                  const [parentKey, childKey] =
                                    component.key.split(".");
                                  const currentParent =
                                    formData[parentKey] || {};

                                  field.onChange({
                                    ...currentParent,
                                    [childKey]: processedValue,
                                  });

                                  setFormValue(parentKey, {
                                    ...currentParent,
                                    [childKey]: processedValue,
                                  });
                                } else {
                                  field.onChange(processedValue);
                                  setFormValue(component.key, processedValue);
                                }

                                if (handleLogicTrigger) {
                                  // Log before triggering logic
                                  if (
                                    component.key === "saudiAgeClassification"
                                  ) {
                                    console.log(
                                      "Triggering logic with value:",
                                      processedValue
                                    );
                                  }

                                  handleLogicTrigger(
                                    component.key,
                                    processedValue
                                  );
                                }

                                setOpen(false);
                              }}
                            >
                              <span>{getTranslation(displayText)}</span>
                              <Check
                                className={cn(
                                  "ml-auto h-4 w-4",
                                  isSelected ? "opacity-100" : "opacity-0"
                                )}
                              />
                            </CommandItem>
                          );
                        }
                      )}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>

            {component.description && (
              <FormDescription>
                {getTranslation(component.description)}
              </FormDescription>
            )}
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
