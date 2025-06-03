"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { PROTECTED_ROUTES } from "@/constants";
import { Link } from "@/i18n/routing";
import { getInitials } from "@/lib/utils";
import { HelpCircle, LogOut, UserRoundPen } from "lucide-react";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

type Props = {
  isOpen: boolean;
  isMobile: boolean;
  session: Session;
};

const AvatarDropdown = ({ isOpen, isMobile, session }: Props) => {
  const [currSession, setCurrSession] = useState(session);
  const t = useTranslations("AvatarDropdown");
  const locale = useLocale();
  const router = useRouter();

  useEffect(() => {
    setCurrSession(session);
  }, [session]);

  const handleLogout = async () => {
    try {
      await signOut({ redirect: false });
      toast.success("Logged out successfully");
      // Use window.location to ensure a full page reload after logout
      window.location.href = process.env.NEXT_PUBLIC_LOGOUT_REDIRECT_URL || "/";
    } catch (error) {
      toast.error("Failed to logout");
    }
  };

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="relative rounded-full w-[38px] h-[38px]"
          >
            <Avatar className="w-9 h-9">
              <AvatarFallback className="bg-violet-100 text-primary">
                {getInitials(
                  locale === "ar"
                    ? currSession?.user?.fullnameAr || ""
                    : currSession?.user?.fullnameEn || ""
                )}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end">
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="font-medium text-sm leading-none">
                {locale === "ar"
                  ? currSession?.user?.fullnameAr
                  : currSession?.user?.fullnameEn}
              </p>
              <p className="text-muted-foreground text-xs leading-none">
                {currSession?.user?.email || "user@email.com"}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />

          <DropdownMenuItem>
            <Link
              href={`${PROTECTED_ROUTES.DASHBOARD}/profile`}
              className="flex items-center rtl:flex-row-reverse gap-2 w-full cursor-pointer"
            >
              <UserRoundPen size={18} />
              <span>{t("links.profile")}</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link
              href={"#"}
              className="flex items-center rtl:flex-row-reverse gap-2 w-full cursor-pointer"
            >
              <HelpCircle size={18} />
              <span>{t("links.help")}</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="bg-red-500/10 focus:bg-red-500/20 text-red-500 focus:text-red-600 cursor-pointer"
            asChild
          >
            <button
              type="submit"
              onClick={handleLogout}
              className="flex items-center rtl:flex-row-reverse gap-2 w-full"
            >
              <LogOut size={18} className="text-red-500" />
              <span>{t("links.logout")}</span>
            </button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {isOpen && isMobile && (
        <div className="flex flex-col transition-all duration-300 ease-in-out">
          <span className="font-medium text-sm">{currSession?.user.name}</span>
          <span className="text-muted-foreground text-xs">
            {currSession?.user.email}
          </span>
        </div>
      )}
    </div>
  );
};

export default AvatarDropdown;
