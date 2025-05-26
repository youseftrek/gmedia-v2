"use client";

import type React from "react";
import { useState, useEffect, useMemo } from "react";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import Image from "next/image";
import { Session } from "next-auth";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import AvatarDropdown from "./AvatarDropdown";
import { SIDEBAR_LINKS, PUBLIC_ROUTES } from "@/constants";
import { Link } from "@/i18n/routing";
import { LogIn, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getEservices } from "@/data/get-eservices";
import { createUrl } from "@/lib/utils";

interface SidebarProps {
  isOpen: boolean;
  isMobile: boolean;
  mobileOpen: boolean;
  onMobileClose: () => void;
  onOpenSidebar: () => void;
  session: Session | null;
}

export function Sidebar({
  isOpen,
  isMobile,
  mobileOpen,
  onMobileClose,
  onOpenSidebar,
  session,
}: SidebarProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const locale = useLocale();
  const isRtl = locale === "ar";
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isAuthenticated = !!session;

  // Services-specific state
  const [serviceGroups, setServiceGroups] = useState<string[]>([]);
  const [serviceSearch, setServiceSearch] = useState("");
  const [servicesLoading, setServicesLoading] = useState(false);

  // Filter sidebar links based on authentication status
  const filteredSidebarLinks = useMemo(() => {
    return SIDEBAR_LINKS.filter(
      (group) =>
        // Include if no auth is needed, or if auth is needed and user is authenticated
        !group.needAuth || (group.needAuth && isAuthenticated)
    );
  }, [isAuthenticated]);

  // Fetch service groups from API
  useEffect(() => {
    if (activeCategory === "services") {
      const fetchServiceGroups = async () => {
        setServicesLoading(true);
        try {
          const response = await getEservices(locale);
          const servicesData = response.data?.data.data || [];

          // Extract unique groups
          const uniqueGroups = [
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ...new Set(servicesData.map((service: any) => service.group)),
          ].filter(Boolean) as string[];

          setServiceGroups(uniqueGroups);
        } catch (error) {
          console.error("Error fetching service groups:", error);
        } finally {
          setServicesLoading(false);
        }
      };

      fetchServiceGroups();
    }
  }, [activeCategory, locale]);

  // Set the active category based on the current route
  useEffect(() => {
    // Special handling for dashboard routes
    if (pathname.startsWith(`/${locale}/dashboard`)) {
      // If we're on a dashboard path, we should activate either dashboard or requests category
      const isDashboardHome = pathname === `/${locale}/dashboard`;

      if (isDashboardHome) {
        setActiveCategory("dashboard");
      } else {
        // Check if it's a request-related page
        const isRequestsPage = SIDEBAR_LINKS.find(
          (group) =>
            group.id === "requests" &&
            group.links.some((link) =>
              pathname.startsWith(`/${locale}${link.href}`)
            )
        );

        if (isRequestsPage) {
          setActiveCategory("requests");
        } else {
          setActiveCategory("dashboard");
        }
      }
      return;
    }

    // Special handling for root path (services)
    if (pathname === `/${locale}` || pathname === `/${locale}/`) {
      setActiveCategory("services");
      return;
    }

    // For other paths, find which group contains the active link
    const activeGroup = filteredSidebarLinks.find((group) =>
      group.links.some((link) => {
        const linkPath = `/${locale}${link.href}`;
        return pathname.startsWith(linkPath);
      })
    );

    if (activeGroup) {
      setActiveCategory(activeGroup.id);
    } else {
      // Default to first category if no match found
      setActiveCategory(filteredSidebarLinks[0]?.id || null);
    }
  }, [pathname, locale, filteredSidebarLinks]);

  // Initialize sidebar state from URL parameters
  useEffect(() => {
    // Check for root path which contains services
    const isRootServicesPage =
      pathname === `/${locale}` || pathname === `/${locale}/`;

    if (isRootServicesPage) {
      // Set initial search from URL
      const searchParam = searchParams.get("search");
      if (searchParam) {
        setServiceSearch(searchParam);
      }

      // Check if a group is active in URL
      const groupParam = searchParams.get("group");
      if (groupParam && !activeCategory) {
        setActiveCategory("services");
      }
    }
  }, [pathname, searchParams, activeCategory, locale]);

  // Add the mounting effect
  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle icon click to select category
  const handleCategorySelect = (id: string) => {
    setActiveCategory(id);

    // Only open the sidebar, no navigation
    if (!isOpen && !isMobile) {
      onOpenSidebar();
    }
  };

  const t = useTranslations("DashboardPage.sidebar");

  // Function to check if a link is active
  const isLinkActive = (href: string): boolean => {
    const linkPath = `/${locale}${href}`;

    // Special case for root path (services)
    if (
      href === "/" &&
      (pathname === `/${locale}` || pathname === `/${locale}/`)
    ) {
      return true;
    }

    // Special case for dashboard home
    if (href === "/dashboard" && pathname === `/${locale}/dashboard`) {
      return true;
    }

    // For nested dashboard routes, they should not highlight home
    if (href === "/dashboard" && pathname.startsWith(`/${locale}/dashboard/`)) {
      return false;
    }

    // For request routes, they should highlight their specific section
    if (
      href.startsWith("/dashboard/") &&
      pathname.startsWith(`/${locale}${href}`)
    ) {
      return true;
    }

    // For other routes, check if the current path exactly matches the link path
    return pathname === linkPath;
  };

  // Handle service search
  const handleServiceSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setServiceSearch(value);

    // Debounce search
    const timer = setTimeout(() => {
      // Check for root path which contains services
      const isRootServicesPage =
        pathname === `/${locale}` || pathname === `/${locale}/`;

      if (isRootServicesPage) {
        const params = new URLSearchParams(searchParams.toString());
        if (value) {
          params.set("search", value);
        } else {
          params.delete("search");
        }
        // Reset page when search changes
        params.delete("page");
        const url = createUrl(pathname, params);
        router.push(url, { scroll: false });
      }
    }, 300);

    return () => clearTimeout(timer);
  };

  // Handle group filter for services
  const handleServiceGroupClick = (group: string) => {
    // Check for root path which contains services
    const isRootServicesPage =
      pathname === `/${locale}` || pathname === `/${locale}/`;

    if (isRootServicesPage) {
      const params = new URLSearchParams(searchParams.toString());
      params.set("group", group);
      // Reset page when group changes
      params.delete("page");
      const url = createUrl(pathname, params);
      router.push(url, { scroll: false });
    } else {
      // Navigate to root page with group filter
      router.push(`/${locale}?group=${encodeURIComponent(group)}`);
    }
  };

  // Get the active category's links
  const activeCategoryLinks =
    filteredSidebarLinks.find((group) => group.id === activeCategory)?.links ||
    [];

  // Get active category data
  const activeCategoryData = filteredSidebarLinks.find(
    (group) => group.id === activeCategory
  );

  // Check if service filters are active
  const isServiceGroupActive = (group: string): boolean => {
    return searchParams.get("group") === group;
  };

  // Render user section based on authentication status
  const renderUserSection = () => {
    if (!mounted) {
      return (
        <div className="bg-muted rounded-full w-[38px] h-[38px] animate-pulse"></div>
      );
    }

    if (session?.user) {
      return (
        <AvatarDropdown isMobile={isMobile} isOpen={false} session={session} />
      );
    }

    return (
      <Link href={`${PUBLIC_ROUTES.LOGIN}`}>
        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-white/10 rounded-full w-[38px] h-[38px] text-white hover:text-[#00bbbe]"
        >
          <LogIn className="w-5 h-5 rtl:rotate-180" />
        </Button>
      </Link>
    );
  };

  // Render service links section with search and filters
  const renderServiceLinks = () => {
    return (
      <>
        {/* Search input for services */}
        <div className="px-2 py-3">
          <div className="relative">
            <Search className="top-1/2 rtl:right-3 ltr:left-3 absolute w-4 h-4 text-muted-foreground -translate-y-1/2" />
            <Input
              value={serviceSearch}
              onChange={handleServiceSearch}
              placeholder={t("searchServices")}
              className="pr-8 pl-9"
            />
            {serviceSearch && (
              <button
                onClick={() => {
                  setServiceSearch("");
                  // Clear search from URL
                  // Check for root path which contains services
                  const isRootServicesPage =
                    pathname === `/${locale}` || pathname === `/${locale}/`;

                  if (isRootServicesPage) {
                    const params = new URLSearchParams(searchParams.toString());
                    params.delete("search");
                    params.delete("page");
                    const url = createUrl(pathname, params);
                    router.push(url, { scroll: false });
                  }
                }}
                className="top-1/2 ltr:right-3 rtl:left-3 absolute text-muted-foreground hover:text-foreground -translate-y-1/2"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Regular links */}
        <div className="mt-4">
          <nav className="flex flex-col gap-1 mt-1 px-2">
            {activeCategoryLinks.map((link) => {
              const active = isLinkActive(link.href);
              const LinkIcon = link.icon;

              return (
                <Link
                  key={link.title}
                  href={link.href}
                  className={cn(
                    "px-4 py-3 flex items-center gap-3 text-sm transition-colors rounded-md",
                    active
                      ? "text-[#00bbbe] font-medium"
                      : "text-muted-foreground hover:bg-[#25155c]/5"
                  )}
                >
                  <LinkIcon
                    className={cn(
                      "w-5 h-5",
                      active ? "text-[#00bbbe]" : "text-muted-foreground"
                    )}
                  />
                  <span>{t(link.title)}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Service filters */}
        <div className="px-2 pt-2">
          <div className="mt-3 px-3 py-1 font-medium text-primary text-xs">
            {t("serviceGroups")}
          </div>
          <div className="space-y-1 mt-1">
            {servicesLoading ? (
              <div className="flex flex-col gap-2 px-3 py-1">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-muted rounded h-5 animate-pulse" />
                ))}
              </div>
            ) : (
              serviceGroups.map((group) => (
                <button
                  key={group}
                  onClick={() => handleServiceGroupClick(group)}
                  className={cn(
                    "w-full px-3 py-1.5 text-sm ltr:text-left rtl:text-right rounded-md transition-colors",
                    isServiceGroupActive(group)
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  {t(`filters.${group}`)}
                </button>
              ))
            )}
          </div>
        </div>
      </>
    );
  };

  // Icons sidebar (always visible)
  const iconsSidebar = (
    <div
      className={cn(
        "flex flex-col bg-[#25155c] h-full text-white",
        "overflow-hidden transition-all duration-300 z-10",
        "w-[60px] min-w-[60px]"
      )}
    >
      <div className="flex justify-center items-center h-16">
        <div className="p-2 rounded-full">
          <Image
            src="/images/gmedia/logo.png"
            alt="logo"
            width={32}
            height={32}
          />
        </div>
      </div>
      <div className="flex flex-col flex-1 items-center gap-4 py-6">
        {filteredSidebarLinks.map((group) => (
          <button
            key={group.id}
            onClick={() => handleCategorySelect(group.id)}
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-md transition-colors",
              activeCategory === group.id ? "text-[#00bbbe]" : "text-white"
            )}
            title={t(group.title)}
          >
            <group.icon className="w-5 h-5" />
          </button>
        ))}
      </div>
      <div className="flex justify-center p-4">{renderUserSection()}</div>
    </div>
  );

  // Links sidebar (visible when expanded)
  const linksSidebar = isOpen && !isMobile && (
    <div
      className={cn(
        "flex flex-col h-full bg-background rtl:border-l ltr:border-r text-muted-foreground",
        "overflow-hidden transition-all duration-300 flex-1",
        "w-full"
      )}
    >
      <div className="flex justify-between items-center px-4 h-16">
        <h2 className="font-semibold text-[#25155c] dark:text-white text-lg">
          {activeCategoryData && t(activeCategoryData.title)}
        </h2>
      </div>

      <div className="flex-1 overflow-auto">
        {activeCategory === "services" ? (
          renderServiceLinks()
        ) : (
          <nav className="flex flex-col gap-1 px-2 py-2">
            {activeCategoryLinks.map((link) => {
              const active = isLinkActive(link.href);
              // Use the link's own icon component
              const LinkIcon = link.icon;

              return (
                <Link
                  key={link.title}
                  href={link.href}
                  className={cn(
                    "px-4 py-3 flex items-center gap-3 text-sm transition-colors rounded-md",
                    active
                      ? "text-[#00bbbe] font-medium"
                      : "text-muted-foreground hover:bg-[#25155c]/5"
                  )}
                >
                  <LinkIcon
                    className={cn(
                      "w-5 h-5",
                      active ? "text-[#00bbbe]" : "text-muted-foreground"
                    )}
                  />
                  <span>{t(link.title)}</span>
                </Link>
              );
            })}
          </nav>
        )}
      </div>

      {isAuthenticated && mounted && (
        <div className="mb-1.5 px-4 py-4 border-t">
          <div className="flex items-center gap-2">
            <div className="flex flex-col">
              <span className="font-medium text-foreground text-sm">
                {locale === "ar"
                  ? session?.user.fullnameAr
                  : session?.user.fullnameEn}
              </span>
              <span className="text-muted-foreground text-xs">
                {session?.user.email}
              </span>
            </div>
          </div>
        </div>
      )}

      {!isAuthenticated && mounted && (
        <div className="mb-1.5 px-4 py-3 border-t h-[70px] flex items-center">
          <Link
            href={`${PUBLIC_ROUTES.LOGIN}`}
            className="flex items-center gap-2 text-muted-foreground hover:text-[#00bbbe] text-sm transition-colors"
          >
            <LogIn className="w-4 h-4 rtl:rotate-180" />
            <span>{t("login")}</span>
          </Link>
        </div>
      )}
    </div>
  );

  // Mobile sidebar
  if (isMobile) {
    return (
      <Sheet open={mobileOpen} onOpenChange={onMobileClose}>
        <SheetContent
          showCloseButton={false}
          side={isRtl ? "right" : "left"}
          className={cn("p-0 w-[320px]", isRtl ? "rtl" : "ltr")}
        >
          <div className="flex h-full">
            {iconsSidebar}
            <div className="flex flex-col flex-1 bg-background h-full">
              <div className="flex justify-between items-center px-4 h-16">
                <h2 className="font-semibold text-[#25155c] dark:text-white text-lg">
                  {activeCategoryData && t(activeCategoryData.title)}
                </h2>
              </div>
              <div className="flex-1 overflow-auto">
                {activeCategory === "services" ? (
                  renderServiceLinks()
                ) : (
                  <nav className="flex flex-col gap-1 px-2 py-2">
                    {activeCategoryLinks.map((link) => {
                      const active = isLinkActive(link.href);
                      // Use the link's own icon component
                      const LinkIcon = link.icon;

                      return (
                        <Link
                          key={link.title}
                          href={link.href}
                          className={cn(
                            "px-4 py-3 flex items-center gap-3 text-sm transition-colors rounded-md",
                            active
                              ? "text-[#00bbbe] font-medium"
                              : "text-muted-foreground hover:bg-[#25155c]/5"
                          )}
                        >
                          <LinkIcon
                            className={cn(
                              "w-5 h-5",
                              active
                                ? "text-[#00bbbe]"
                                : "text-muted-foreground"
                            )}
                          />
                          <span>{t(link.title)}</span>
                        </Link>
                      );
                    })}
                  </nav>
                )}
              </div>
              {/* User info section in mobile sidebar */}
              {isAuthenticated && mounted && (
                <div className="mb-1.5 px-4 py-3 border-t">
                  <div className="flex items-center gap-2">
                    <div className="flex flex-col">
                      <span className="font-medium text-foreground text-sm">
                        {session?.user.name}
                      </span>
                      <span className="text-muted-foreground text-xs">
                        {session?.user.email}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {!isAuthenticated && mounted && (
                <div className="mb-1.5 px-4 py-3 border-t">
                  <Link
                    href={`${PUBLIC_ROUTES.LOGIN}`}
                    className="flex items-center gap-2 text-muted-foreground hover:text-[#00bbbe] text-sm transition-colors"
                  >
                    <LogIn className="w-4 h-4 rtl:rotate-180" />
                    <span>{t("login")}</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  // Desktop sidebar with two sections side by side
  return (
    <div
      className={cn(
        "fixed top-0 bottom-0 h-screen transition-all duration-300 z-10 flex",
        isOpen ? "w-[280px]" : "w-[60px]",
        isRtl ? "right-0" : "left-0"
      )}
    >
      {iconsSidebar}
      {linksSidebar}
    </div>
  );
}
