/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import type React from "react";
import { useEffect } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Trash2Icon, PlusCircle } from "lucide-react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useLocale, useTranslations } from "next-intl";

type DynamicDataGridProps = {
  component: any;
  control: any;
  errors: any;
  getTranslation: (keyword: string, type?: string) => string;
  renderComponents: (
    components: any[],
    parentKey?: string,
    rowData?: any,
    rowIndex?: number
  ) => React.ReactNode;
  parentKey: string;
};

export default function DynamicDataGrid({
  component,
  control,
  errors,
  getTranslation,
  renderComponents,
  parentKey,
}: DynamicDataGridProps) {
  const locale = useLocale();
  const t = useTranslations("DynamicComponents.gridTable");
  const { setValue, getValues, watch } = useFormContext();

  // Function to create a new row with the correct structure
  const createNewRow = () => {
    const newRow: Record<string, any> = {};
    // Initialize all component fields with empty values
    component.components?.forEach((col: any) => {
      newRow[col.key] = col.multiple ? [] : "";
    });
    return newRow;
  };

  // Watch for changes in grid rows
  const watchGrid = watch(component.key);

  // Fix row structure if needed
  useEffect(() => {
    if (Array.isArray(watchGrid)) {
      // Check if we have any non-object rows that need fixing
      const needsFix = watchGrid.some(
        (row) => typeof row !== "object" || row === null
      );

      if (needsFix) {
        // We need to restructure the grid data
        const fixedRows: any[] = [];

        // Get all videoUrl values if they exist outside the grid
        const videoUrls = getValues("videoUrl");
        const consoleSources = getValues("console");

        // Restructure data to proper format, preserving existing data
        if (Array.isArray(videoUrls) && videoUrls.length > 0) {
          videoUrls.forEach((url, index) => {
            const newRow = createNewRow();
            newRow.videoUrl = url;

            // If there's a console value for this row, include it
            if (
              Array.isArray(consoleSources) &&
              index < consoleSources.length
            ) {
              newRow.console = consoleSources[index];
            }

            fixedRows.push(newRow);
          });

          // Update the form value with the fixed structure
          setValue(component.key, fixedRows);

          // Clean up the individual fields that were moved into the grid
          if (videoUrls.length > 0) setValue("videoUrl", undefined);
          if (Array.isArray(consoleSources)) setValue("console", undefined);
        }
      }
    }
  }, [watchGrid, component.key, setValue, getValues]);

  // Check if the grid has any validation errors
  const hasGridError = errors[component.key];

  return (
    <div className="mb-6 space-y-2">
      <Controller
        name={component.key}
        control={control}
        defaultValue={component.defaultValue || []}
        render={({ field }) => {
          // Ensure field.value is always an array
          const rows = Array.isArray(field.value) ? field.value : [];

          return (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  {!component.hideLabel && (
                    <Label
                      htmlFor={field.name}
                      className="text-base font-medium"
                    >
                      {getTranslation(component.label)}
                      {component.validate?.required && (
                        <span className="ml-1 text-destructive">*</span>
                      )}
                    </Label>
                  )}

                  {component.description && (
                    <p className="text-sm text-muted-foreground">
                      {getTranslation(component.description)}
                    </p>
                  )}
                </div>
              </div>

              <div
                className={cn(
                  "rounded-md border",
                  hasGridError ? "border-destructive" : "border-input"
                )}
              >
                {rows.length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/50">
                          {component.components &&
                            component.components.map((col: any) => (
                              <TableHead
                                key={`header-${col.key}`}
                                className="font-medium rtl:text-right"
                              >
                                {getTranslation(col.label)}
                                {col.validate?.required && (
                                  <span className="ml-1 text-destructive">
                                    *
                                  </span>
                                )}
                              </TableHead>
                            ))}
                          <TableHead className="w-[80px] text-right">
                            {locale === "ar" ? "الإجراءات" : "Actions"}
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {rows.map((row: any, rowIndex: number) => {
                          // Ensure row is an object
                          const rowData =
                            typeof row === "object" && row !== null
                              ? row
                              : { videoUrl: row };

                          return (
                            <TableRow key={`row-${rowIndex}`}>
                              {component.components &&
                                component.components.map((col: any) => {
                                  // Create unique field name for this cell
                                  const fieldName = `${component.key}[${rowIndex}].${col.key}`;

                                  // Create a deep copy of the component for this cell
                                  const componentCopy = JSON.parse(
                                    JSON.stringify(col)
                                  );

                                  // Modify the key to include row index, but keep the original key for accessing row data
                                  componentCopy.key = fieldName;
                                  componentCopy.originalKey = col.key;

                                  // Add an onChange handler to update the parent grid value
                                  const originalOnChange =
                                    componentCopy.onChange;
                                  componentCopy.onChange = (value: any) => {
                                    // Call original onChange if it exists
                                    if (originalOnChange) {
                                      originalOnChange(value);
                                    }

                                    // Update the grid value
                                    const updatedRows = [...rows];
                                    if (!updatedRows[rowIndex]) {
                                      updatedRows[rowIndex] = createNewRow();
                                    }

                                    // Ensure we're working with an object
                                    if (
                                      typeof updatedRows[rowIndex] !==
                                        "object" ||
                                      updatedRows[rowIndex] === null
                                    ) {
                                      updatedRows[rowIndex] = {
                                        [col.key]: updatedRows[rowIndex],
                                      };
                                    }

                                    // Update the specific field
                                    updatedRows[rowIndex][col.key] = value;
                                    field.onChange(updatedRows);
                                  };

                                  return (
                                    <TableCell
                                      key={`cell-${rowIndex}-${col.key}`}
                                      className="align-top"
                                    >
                                      {renderComponents(
                                        [componentCopy],
                                        `${parentKey}-${rowIndex}`,
                                        rowData,
                                        rowIndex
                                      )}
                                    </TableCell>
                                  );
                                })}
                              <TableCell className="text-right align-top">
                                <Button
                                  type="button"
                                  variant="softDestructive"
                                  size="icon"
                                  className="mt-[19px]"
                                  onClick={() => {
                                    const newRows = [...rows];
                                    newRows.splice(rowIndex, 1);
                                    field.onChange(newRows);
                                  }}
                                >
                                  <Trash2Icon className="h-4 w-4" />
                                  <span className="sr-only">
                                    {getTranslation("Delete row")}
                                  </span>
                                </Button>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
                    <div className="mb-3 rounded-full bg-muted p-3">
                      <PlusCircle className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <p className="mb-1 text-sm font-medium">{t("empty")}</p>
                    <p className="text-sm text-muted-foreground max-w-sm">
                      {t("emptyDes")}
                    </p>
                  </div>
                )}
              </div>

              {hasGridError && (
                <p className="text-sm font-medium text-destructive">
                  {errors[component.key]?.message}
                </p>
              )}

              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => {
                  const newRow = createNewRow();
                  field.onChange([...rows, newRow]);
                }}
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                {getTranslation(component.addAnother || "Add Item")}
              </Button>
            </div>
          );
        }}
      />
    </div>
  );
}
