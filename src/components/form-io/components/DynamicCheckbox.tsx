/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Controller } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { InfoIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface DynamicCheckboxProps {
  component: any;
  control: any;
  errors: any;
  getTranslation: (key: string, type?: string) => string;
}

const DynamicCheckbox = ({
  component,
  control,
  errors,
  getTranslation,
}: DynamicCheckboxProps) => {
  return (
    <div
      className={`mb-4 flex items-start space-x-2 ${
        component.customClass || ""
      }`}
    >
      <Controller
        name={component.key}
        control={control}
        defaultValue={component.defaultValue || false}
        render={({ field }) => (
          <div className="flex items-center gap-2 jc">
            <Checkbox
              id={field.name}
              checked={field.value}
              onCheckedChange={field.onChange}
              disabled={component.disabled}
            />
            <div>
              <Label
                htmlFor={field.name}
                className={cn(
                  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
                  component.labelPosition === "right" ? "ml-2" : ""
                )}
              >
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
                <p className="text-muted-foreground text-sm">
                  {getTranslation(component.description)}
                </p>
              )}
              {errors[component.key] && (
                <p className="mt-1 text-destructive text-sm">
                  {component.validate?.customMessage
                    ? getTranslation(component.validate.customMessage)
                    : String(errors[component.key]?.message)}
                </p>
              )}
            </div>
          </div>
        )}
      />
    </div>
  );
};

export default DynamicCheckbox;
