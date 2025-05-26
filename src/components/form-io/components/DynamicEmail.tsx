/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type DynamicEmailProps = {
  component: any;
  control: any;
  errors: any;
  getTranslation: (keyword: string, type?: string) => string;
};

const DynamicEmail = ({
  component,
  control,
  errors,
  getTranslation,
}: DynamicEmailProps) => {
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
            <Input
              {...field}
              id={field.name}
              type="email"
              placeholder={getTranslation(component.placeholder || "")}
              disabled={component.disabled}
              className={errors[component.key] ? "border-destructive" : ""}
            />
            {errors[component.key] && (
              <p className="mt-1 text-destructive text-sm">
                {String(errors[component.key]?.message)}
              </p>
            )}
          </div>
        )}
      />
    </div>
  );
};

export default DynamicEmail;
