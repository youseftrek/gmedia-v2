"use client";

import { cn } from "@/lib/utils";
import { CheckIcon } from "lucide-react";
import { useTranslations } from "next-intl";

export interface Step {
  id: string;
  label: string;
  status: "completed" | "current" | "upcoming";
}

interface StepTrackerProps {
  steps: Step[];
  className?: string;
}

export const StepTracker = ({ steps, className }: StepTrackerProps) => {
  const t = useTranslations();

  return (
    <div className={cn("w-full", className)}>
      <ol className="flex items-center w-full">
        {steps.map((step, index) => (
          <li
            key={step.id}
            className={cn(
              "flex items-center relative w-full",
              index === steps.length - 1 && "grow-0"
            )}
          >
            {/* Step circle */}
            <div
              className={cn(
                "flex items-center justify-center w-8 h-8 rounded-full shrink-0 z-10",
                step.status === "completed" && "bg-primary",
                step.status === "current" && "bg-primary/80",
                step.status === "upcoming" && "bg-muted",
                step.status !== "upcoming" && "text-white",
                step.status === "upcoming" && "text-muted-foreground"
              )}
            >
              {step.status === "completed" ? (
                <CheckIcon className="w-4 h-4" />
              ) : (
                <span>{index + 1}</span>
              )}
            </div>

            {/* Step label */}
            <span
              className={cn(
                "absolute top-10 text-xs font-medium w-max -translate-x-1/3 text-center",
                step.status === "completed" && "text-primary",
                step.status === "current" && "text-primary/80 font-semibold",
                step.status === "upcoming" && "text-muted-foreground"
              )}
            >
              {t(step.label)}
            </span>

            {/* Connector line (not needed for the last step) */}
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "w-full h-0.5 mx-2",
                  step.status === "completed" ? "bg-primary" : "bg-muted"
                )}
              />
            )}
          </li>
        ))}
      </ol>
    </div>
  );
};
