"use client";

import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/shared/ModeToggle";
import { LanguageSelect } from "@/components/shared/LanguageSelect";
import { useLocale } from "next-intl";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile"; // Import if available
import { Menu } from "lucide-react";

interface NavbarProps {
  onMenuClick: () => void;
  sidebarOpen: boolean;
}

export function Navbar({ onMenuClick, sidebarOpen }: NavbarProps) {
  const locale = useLocale();
  const isRtl = locale === "ar";
  const isMobile = useIsMobile?.() || false; // Use the hook if available, or default to false

  return (
    <header
      className="top-0 z-50 fixed flex items-center bg-background/70 backdrop-blur-md border-b h-16"
      style={{
        // Calculate dynamic widths and positioning based on sidebar state and direction
        left: !isRtl ? (isMobile ? 0 : sidebarOpen ? "280px" : "60px") : 0,
        right: isRtl ? (isMobile ? 0 : sidebarOpen ? "280px" : "60px") : 0,
        transition: "all 0.3s ease-in-out",
      }}
    >
      <div className="flex justify-between items-center px-4 md:px-6 rtl:pr-3 ltr:pl-3 w-full">
        <Button
          variant="secondary"
          size="icon"
          onClick={onMenuClick}
          className={cn(isMobile ? "flex" : "flex")}
        >
          <Menu className="w-5 h-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>

        <div className="flex items-center gap-2 rtl:mr-auto ltr:ml-auto">
          <ModeToggle buttonVariant="outline" />
          <LanguageSelect buttonVariant="outline" />
        </div>
      </div>
    </header>
  );
}
