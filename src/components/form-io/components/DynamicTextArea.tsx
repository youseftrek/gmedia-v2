/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Controller } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { InfoIcon } from "lucide-react";

interface DynamicTextAreaProps {
  component: any;
  control: any;
  errors: any;
  getTranslation: (key: string, type?: string) => string;
}

const DynamicTextArea = ({
  component,
  control,
  errors,
  getTranslation,
}: DynamicTextAreaProps) => {
  return (
    <div key={component.key} className="mb-4">
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
            <Textarea
              {...field}
              id={field.name}
              placeholder={getTranslation(component.placeholder || "")}
              disabled={component.disabled}
              rows={component.rows || 3}
              className={errors[component.key] ? "border-destructive" : ""}
            />
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

export default DynamicTextArea;
