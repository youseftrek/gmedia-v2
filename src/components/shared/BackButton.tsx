"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import TooltipChildren from "../ui/TooltipChildren";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

interface BackButtonProps {
  fallbackPath?: string;
  variant?:
    | "default"
    | "secondary"
    | "outline"
    | "ghost"
    | "link"
    | "destructive";
  className?: string;
  label?: string;
  size?: "default" | "sm" | "lg" | "icon";
}

export function BackButton({
  fallbackPath = "/en/dashboard",
  variant = "outline",
  className = "",
  label,
  size = "default",
}: BackButtonProps) {
  const router = useRouter();
  const t = useTranslations("BackButton");

  const handleGoBack = () => {
    // Try to go back to previous page in history
    // If there's no history (e.g., opened directly), go to fallback
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push(fallbackPath);
    }
  };

  if (size === "icon") {
    return (
      <TooltipChildren message={label || t("back")}>
        <Button
          variant={variant}
          size={size}
          className={cn(className, "cursor-pointer")}
          onClick={handleGoBack}
        >
          <ChevronLeft className="w-4 h-4 ltr:rotate-180" />
        </Button>
      </TooltipChildren>
    );
  } else {
    return (
      <Button
        variant={variant}
        size={size}
        className={className}
        onClick={handleGoBack}
      >
        {label || "Back"}
        <ChevronLeft className="w-4 h-4 ltr:rotate-180" />
      </Button>
    );
  }
}
