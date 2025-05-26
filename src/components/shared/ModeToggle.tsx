"use client";

type Props = {
  className?: string;
  buttonVariant?:
    | "link"
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | null
    | undefined;
};

import * as React from "react";
import { MonitorCog, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTranslations } from "next-intl";
import TooltipChildren from "../ui/TooltipChildren";

export function ModeToggle({ className, buttonVariant }: Props) {
  const t = useTranslations("modeToggle");

  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <TooltipChildren message={t("tooltip")}>
        <DropdownMenuTrigger asChild className={className}>
          <Button variant={buttonVariant} size="icon" id="theme-toggle">
            <Sun className="w-[1.2rem] h-[1.2rem] transition-all dark:-rotate-90 dark:scale-0 rotate-0 scale-100" />
            <Moon className="absolute w-[1.2rem] h-[1.2rem] transition-all dark:rotate-0 dark:scale-100 rotate-90 scale-0" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </DropdownMenuTrigger>
      </TooltipChildren>
      <DropdownMenuContent align="center">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          <Sun />
          {t("light")}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          <Moon />
          {t("dark")}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          <MonitorCog />
          {t("system")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
