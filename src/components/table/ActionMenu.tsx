// components/ui/data-table/ActionMenu.tsx
"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { useEffect, useState } from "react";

export interface ActionItem {
  label: string;
  onClick: () => void;
  icon?: React.ReactNode;
  variant?: "default" | "destructive";
  disabled?: boolean;
}

interface ActionMenuProps {
  actions: ActionItem[];
  label?: string;
  align?: "start" | "center" | "end";
  sideOffset?: number;
  direction?: "ltr" | "rtl";
}

export function ActionMenu({
  actions,
  align = "end",
  sideOffset = 4,
  direction,
}: ActionMenuProps) {
  const [isRtl, setIsRtl] = useState(false);

  // Detect RTL direction
  useEffect(() => {
    // Check for explicitly provided direction prop
    if (direction) {
      setIsRtl(direction === "rtl");
      return;
    }

    // Otherwise, check the document or parent element direction
    const docDir = document.documentElement.dir || document.dir || "ltr";
    setIsRtl(docDir === "rtl");

    // We could also set up a mutation observer to detect changes in dir attribute,
    // but that might be overkill for most use cases
  }, [direction]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="data-[state=open]:bg-muted p-0 w-8 h-8"
        >
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align={align}
        sideOffset={sideOffset}
        className={isRtl ? "rtl" : ""}
      >
        {actions.map((action, index) => (
          <DropdownMenuItem
            key={index}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              action.onClick();
            }}
            disabled={action.disabled}
            className={`${
              action.variant === "destructive"
                ? "text-destructive focus:text-destructive focus:bg-destructive/10"
                : ""
            }
                       ${isRtl ? "flex-row-reverse text-right" : ""}`}
          >
            {action.icon && (
              <span className={isRtl ? "ml-2" : "mr-2"}>{action.icon}</span>
            )}
            {action.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
