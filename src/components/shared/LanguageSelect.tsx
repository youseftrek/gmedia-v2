"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import TooltipChildren from "@/components/ui/TooltipChildren";
import { usePathname } from "@/i18n/routing";
import { Languages, Check } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { changeLang } from "@/data/change-lang";
import { LOCALE_CODE } from "@/constants/locale";
import { toast } from "sonner";
import { PUBLIC_ROUTES } from "@/constants";
import { useAuth } from "@/providers/AuthProvider";

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

export function LanguageSelect({ className, buttonVariant }: Props) {
  const t = useTranslations("languagesToggle");
  const currentPathname = usePathname();
  const router = useRouter();
  const { session } = useAuth();
  const currentLocale = useLocale();

  const handleLanguageChange = async (newLocale: string) => {
    if (newLocale === currentLocale) return;

    // Get the path without the locale prefix to maintain the same path
    const pathWithoutLocale = currentPathname || "";

    // Check if current path is a public route using the same logic as middleware
    const isPublicRoute = Object.values(PUBLIC_ROUTES).some((route) => {
      // Handle route patterns with parameters like "/service-details/:id"
      if (route.includes("/:")) {
        const baseRoute = route.split("/:")[0];
        return (
          pathWithoutLocale === baseRoute ||
          pathWithoutLocale.startsWith(`${baseRoute}/`)
        );
      }
      return pathWithoutLocale === route;
    });

    // Separately check for service-details pages
    const isServiceDetailsPage =
      pathWithoutLocale === "service-details" ||
      pathWithoutLocale.startsWith("service-details/");

    // Combined check for any public page
    const isPublicPage = isPublicRoute || isServiceDetailsPage;

    // Only make API call if user is logged in AND NOT on a public route
    if (session && !isPublicPage) {
      const newLangCode = LOCALE_CODE[newLocale as keyof typeof LOCALE_CODE];

      await toast.promise(
        (async () => {
          const { success, error } = await changeLang(session, newLangCode);
          if (!success) {
            throw new Error(t("messages.changeFailed"));
          }
          await new Promise((resolve) => setTimeout(resolve, 1000));
        })(),
        {
          loading: t("messages.changingLanguage"),
          success: t("messages.languageChanged"),
          error: t("messages.changeFailed"),
        }
      );
    }

    // Navigate to the same path but with the new locale
    // Force refresh the page to ensure middleware processes the new URL
    try {
      // Use a more reliable way to construct the URL
      const newUrl = `/${newLocale}${pathWithoutLocale}`;
      console.log(`Language change: navigating to ${newUrl}`);

      // Use direct window.location for a full page reload
      window.location.href = newUrl;
    } catch (error) {
      console.error("Error during language change navigation:", error);
    }
  };

  return (
    <DropdownMenu>
      <TooltipChildren message={t("tooltip")}>
        <DropdownMenuTrigger asChild className={className}>
          <Button
            variant={buttonVariant}
            size="icon"
            name="Toggle Language"
            id="language-toggle"
          >
            <Languages />
          </Button>
        </DropdownMenuTrigger>
      </TooltipChildren>
      <DropdownMenuContent align="center">
        <DropdownMenuItem asChild>
          <button
            className="w-full"
            onClick={() => handleLanguageChange("ar")}
            disabled={currentLocale === "ar"}
          >
            <div className="flex items-center gap-3 w-full font-bold disabled:opacity-50">
              <Image
                src="/SVGs/ar.png"
                className="rounded-xs"
                alt="arabic language flag"
                height={25}
                width={25}
              />
              {t("arabic")}
              {currentLocale === "ar" && (
                <span className="bg-emerald-500/10 rounded-full p-1">
                  <Check className="ml-auto text-emerald-500 h-3 w-3" />
                </span>
              )}
            </div>
          </button>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <button
            className="w-full"
            onClick={() => handleLanguageChange("en")}
            disabled={currentLocale === "en"}
          >
            <div className="flex items-center gap-3 w-full font-bold disabled:opacity-50">
              <Image
                src="/SVGs/en.svg"
                alt="english language flag"
                height={25}
                width={25}
              />
              {t("english")}
              {currentLocale === "en" && (
                <span className="bg-emerald-500/10 rounded-full p-1">
                  <Check className="ml-auto text-emerald-500 h-3 w-3" />
                </span>
              )}
            </div>
          </button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
