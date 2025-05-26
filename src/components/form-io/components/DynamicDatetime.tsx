/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Controller } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
import { CalendarIcon, InfoIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format, isValid } from "date-fns";
import { useTranslations } from "next-intl";

interface DynamicDatetimeProps {
  component: any;
  control: any;
  errors: any;
  getTranslation: (key: string, type?: string) => string;
}

const DynamicDatetime = ({
  component,
  control,
  errors,
  getTranslation,
}: DynamicDatetimeProps) => {
  const t = useTranslations("DynamicComponents.datetime");

  // Helper function to safely format dates
  const formatDate = (value: any, formatStr: string = "PPP") => {
    if (!value) return "";
    try {
      const date = new Date(value);
      return isValid(date) ? format(date, formatStr) : "";
    } catch (error) {
      console.error("Error formatting date:", error);
      return "";
    }
  };

  return (
    <div className={`mb-4 ${component.customClass || ""}`}>
      <Controller
        name={component.key}
        control={control}
        defaultValue={component.defaultValue || ""}
        render={({ field }) => (
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
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full h-9 justify-start text-left bg-transparent font-normal",
                    !field.value && "text-muted-foreground",
                    errors[component.key] ? "border-destructive" : ""
                  )}
                  disabled={component.disabled}
                >
                  <CalendarIcon className="mr-2 w-4 h-4" />
                  {field.value
                    ? formatDate(field.value, component.format || "PPP")
                    : getTranslation(component.placeholder || t("placeholder"))}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-0 w-auto">
                <Calendar
                  mode="single"
                  selected={field.value ? new Date(field.value) : undefined}
                  onSelect={field.onChange}
                  initialFocus
                  disabled={(date) => {
                    if (
                      component.datePicker?.minDate &&
                      new Date(date) < new Date(component.datePicker.minDate)
                    ) {
                      return true;
                    }
                    if (
                      component.datePicker?.maxDate &&
                      new Date(date) > new Date(component.datePicker.maxDate)
                    ) {
                      return true;
                    }
                    if (
                      component.datePicker?.disableWeekends &&
                      [0, 6].includes(date.getDay())
                    ) {
                      return true;
                    }
                    return false;
                  }}
                />
              </PopoverContent>
            </Popover>
            {errors[component.key] && (
              <p className="mt-1 text-destructive text-sm">
                {component.validate?.customMessage
                  ? getTranslation(component.validate.customMessage)
                  : String(errors[component.key]?.message || t("invalid_date"))}
              </p>
            )}
          </div>
        )}
      />
    </div>
  );
};

export default DynamicDatetime;
