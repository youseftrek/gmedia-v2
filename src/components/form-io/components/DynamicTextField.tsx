/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

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

interface DynamicTextFieldProps {
  component: any;
  control: any;
  errors: any;
  getTranslation: (key: string, type?: string) => string;
  disabled?: boolean;
}

const DynamicTextField = ({
  component,
  control,
  errors,
  getTranslation,
  disabled,
}: DynamicTextFieldProps) => {
  return (
    <div key={component.key} className={`mb-4 ${component.customClass || ""}`}>
      <Controller
        name={component.key}
        control={control}
        defaultValue={component.defaultValue || ""}
        render={({ field }) => (
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
              {...field}
              id={field.name}
              placeholder={getTranslation(component.placeholder || "")}
              disabled={disabled || component.disabled}
              className={errors[component.key] ? "border-destructive" : ""}
              tabIndex={component.tabindex}
              type={component.inputType || "text"}
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
        )}
      />
    </div>
  );
};

export default DynamicTextField;
