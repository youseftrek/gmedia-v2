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
import { useSession } from "next-auth/react";
import { changeLang } from "@/data/change-lang";
import { LOCALE_CODE } from "@/constants/locale";
import { toast } from "sonner";
import { PUBLIC_ROUTES } from "@/constants";

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
  const { data: session } = useSession();
  const currentLocale = useLocale();

  const handleLanguageChange = async (newLocale: string) => {
    if (newLocale === currentLocale) return;

    // Get the path without the locale prefix to maintain the same path
    const pathWithoutLocale = currentPathname || "";

    // Check if current path is a public route
    const isPublicRoute =
      Object.values(PUBLIC_ROUTES).some(
        (route) => pathWithoutLocale === route
      ) || pathWithoutLocale.startsWith("service-details/");

    if (session && !isPublicRoute) {
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
    router.push(`/${newLocale}${pathWithoutLocale}`);
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
