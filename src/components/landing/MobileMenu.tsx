"use client";

import { ChevronLeft, ChevronRight, Menu } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { Link, usePathname } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { LANDING_PAGE_NAV_LINKS } from "@/constants";
import { ModeToggle } from "../shared/ModeToggle";
import { LanguageSelect } from "../shared/LanguageSelect";

const HomePageMobileMenu = () => {
  const pathname = usePathname();
  const t = useTranslations("HomeNavbar");
  const currLocale = useLocale();
  return (
    <Sheet>
      <SheetTrigger asChild className="flex md:hidden">
        <Button size="icon" variant="outline">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent side="top" aria-description="Mobile Menu">
        <SheetHeader>
          <SheetTitle>{t("MobileMenu.mainMenu")}</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col gap-2 mt-5 w-full text-lg">
          {LANDING_PAGE_NAV_LINKS.map((link) => (
            <SheetClose key={link.name} asChild>
              <Link
                href={link.href}
                className={cn(
                  pathname === link.href &&
                    "ltr:bg-linear-to-r rtl:bg-linear-to-l from-secondary to-transparent text-primary",
                  buttonVariants({ variant: "ghost" }),
                  "flex items-center justify-between hover:bg-secondary hover:text-primary transition-all duration-200 w-full"
                )}
              >
                <div className="flex items-center gap-4">
                  <link.icon size={20} />
                  {t(`links.${link.name}`)}
                </div>
                {currLocale === "ar" ? <ChevronLeft /> : <ChevronRight />}
              </Link>
            </SheetClose>
          ))}
          <div className="flex justify-center items-center gap-2">
            <ModeToggle buttonVariant="outline" />
            <LanguageSelect buttonVariant="outline" />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default HomePageMobileMenu;
