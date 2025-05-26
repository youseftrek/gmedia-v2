"use client";

import React, { useState, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sidebar } from "./Sidebar";
import { Navbar } from "./Navbar";
import { useLocale } from "next-intl";
import { Session } from "next-auth";
import Footer from "@/components/Footer";

interface DashboardLayoutClientProps {
  children: React.ReactNode;
  session: Session | null;
}

export default function DashboardLayoutClient({
  children,
  session,
}: DashboardLayoutClientProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const isMobile = useIsMobile();
  const locale = useLocale();
  const isRtl = locale === "ar";

  // Close sidebar on mobile by default
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    } else {
      setSidebarOpen(false);
    }
  }, [isMobile]);

  const toggleSidebar = () => {
    if (isMobile) {
      setMobileOpen(!mobileOpen);
    } else {
      setSidebarOpen(!sidebarOpen);
    }
  };

  const openSidebar = () => {
    if (!sidebarOpen && !isMobile) {
      setSidebarOpen(true);
    }
  };

  return (
    <div className="flex bg-background min-h-screen overflow-hidden">
      <Sidebar
        session={session}
        isOpen={sidebarOpen}
        isMobile={isMobile}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
        onOpenSidebar={openSidebar}
      />

      {/* Main content with left/right margin to accommodate sidebar */}
      <div
        className="flex flex-col flex-1 w-full transition-all duration-300"
        style={{
          marginLeft:
            !isMobile && !isRtl ? (sidebarOpen ? "280px" : "60px") : "0",
          marginRight:
            !isMobile && isRtl ? (sidebarOpen ? "280px" : "60px") : "0",
        }}
      >
        <Navbar onMenuClick={toggleSidebar} sidebarOpen={sidebarOpen} />
        <main className="flex-1 bg-secondary/50 mt-[62px] md:mt-[63px]">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
}
