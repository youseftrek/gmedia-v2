/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { FC } from "react";
import { Controller } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { InfoIcon } from "lucide-react";

interface DynamicNumberProps {
  component: any;
  control: any;
  errors: any;
  getTranslation: (key: string, type?: string) => string;
  disabled?: boolean;
}

const DynamicNumber: FC<DynamicNumberProps> = ({
  component,
  control,
  errors,
  getTranslation,
  disabled,
}) => {
  // Safely process the default value to ensure it's a number or null
  const getDefaultValue = () => {
    // If it's already a number, return it
    if (typeof component.defaultValue === "number") {
      return component.defaultValue;
    }

    // If it's a string that can be converted to a number, convert it
    if (
      typeof component.defaultValue === "string" &&
      component.defaultValue.trim() !== ""
    ) {
      const parsed = parseFloat(component.defaultValue);
      if (!isNaN(parsed)) {
        return parsed;
      }
    }

    // Otherwise return null (empty field)
    return null;
  };

  return (
    <div key={component.key} className={`mb-4 ${component.customClass || ""}`}>
      <Controller
        name={component.key}
        control={control}
        defaultValue={getDefaultValue()}
        // Transform the value to ensure we always pass a number to the form validation
        render={({ field }) => {
          // Handle value changes - convert string input to number
          const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const value = e.target.value;
            // Convert empty string to null
            if (value === "") {
              field.onChange(null);
              return;
            }

            // Otherwise parse as number
            const parsed = parseFloat(value);
            field.onChange(isNaN(parsed) ? null : parsed);
          };

          // Value to display in the input
          // Convert null/undefined to empty string for the input, otherwise use the original value
          const displayValue =
            field.value === null || field.value === undefined
              ? ""
              : field.value.toString();

          // Add better debugging for development
          if (process.env.NODE_ENV === "development") {
            // Check if there are validation errors
            if (errors[component.key]) {
              console.log(
                `Validation error for ${component.key}:`,
                errors[component.key]
              );
              console.log(
                `Current value: ${field.value} (${typeof field.value})`
              );
              console.log(`Component validation:`, component.validate);
            }
          }

          return (
            <div>
              <div className="flex items-center gap-2 mb-2">
                {component.tooltip && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="inline-flex cursor-help">
                          <InfoIcon className="w-4 h-4 text-muted-foreground" />
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{getTranslation(component.tooltip)}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
                <Label
                  htmlFor={field.name}
                  className={
                    component.labelPosition === "top"
                      ? "block"
                      : "inline-block mr-2"
                  }
                >
                  {getTranslation(component.label)}
                  {component.validate?.required && (
                    <span className="ml-1 text-destructive">*</span>
                  )}
                </Label>
              </div>
              <Input
                id={field.name}
                name={field.name}
                placeholder={getTranslation(component.placeholder || "")}
                disabled={disabled || component.disabled}
                className={errors[component.key] ? "border-destructive" : ""}
                tabIndex={component.tabindex}
                type="number"
                value={displayValue}
                onChange={handleChange}
                onBlur={field.onBlur}
                step={
                  component.validate?.step !== undefined
                    ? component.validate.step
                    : "any"
                }
                min={component.validate?.min}
                max={component.validate?.max}
              />
              {component.description && (
                <p className="mb-2 text-muted-foreground text-sm">
                  {getTranslation(component.description)}
                </p>
              )}
              {errors[component.key] && (
                <p className="mt-1 text-destructive text-sm">
                  {errors[component.key]?.message ||
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

export default DynamicNumber;
