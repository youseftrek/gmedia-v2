"use client";
import { LANDING_PAGE_NAV_LINKS } from "@/constants";
import { Link, usePathname } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

const NavItems = () => {
  const t = useTranslations("HomeNavbar");

  const pathname = usePathname();

  return (
    <>
      {LANDING_PAGE_NAV_LINKS.map((link) => (
        <Link
          key={link.name}
          href={link.href}
          className={cn(
            "opacity-75 hover:opacity-100 transition-all duration-200",
            pathname === link.href && "text-primary"
          )}
        >
          {t(`links.${link.name}`)}
        </Link>
      ))}
    </>
  );
};

export default NavItems;
