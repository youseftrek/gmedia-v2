"use client";
import { Particles } from "@/components/magicui/particles";
import { Card } from "@/components/ui/card";
import { Link } from "@/i18n/routing";
import { getInitials } from "@/lib/utils";
import { BadgeCheck } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const UserCard = (user: any) => {
  const haveLicence = false;
  const locale = useLocale();
  const t = useTranslations("DashboardPage.UserCard");
  return (
    <div className="relative flex h-fit w-full flex-col items-center justify-center overflow-hidden rounded-lg border bg-background">
      <div className="flex lg:flex-row flex-col justify-between items-center gap-4 mt-4 mb-6 p-8 dark:text-white w-full z-10">
        <div className="flex lg:flex-row flex-col items-center gap-8">
          <div className="flex justify-center items-center bg-[#25155c] rounded-full w-24 lg:w-32 h-24 lg:h-32 text-white text-4xl lg:text-6xl">
            {locale === "ar"
              ? getInitials(user.user.fullnameAr)
              : getInitials(user.user.fullnameEn)}
          </div>
          <div className="flex flex-col gap-3 text-[#25155c] dark:text-white lg:ltr:text-left text-center lg:rtl:text-right">
            <h2 className="font-bold text-3xl">{t("hello")}</h2>
            <p className="text-xl lg:text-2xl">
              {t("user")},{" "}
              {locale === "ar" ? user.user.fullnameAr : user.user.fullnameEn}
            </p>
            <p className="text-muted-foreground text-base lg:text-xl">
              {t("info")}
            </p>
            <Link
              href="/dashboard/profile"
              className="font-medium text-[18px] text-primary underline"
            >
              {t("viewProfile")}
            </Link>
          </div>
        </div>
        {haveLicence && (
          <Card className="relative bg-linear-to-bl from-primary to-[#25155c] min-w-[340px] min-h-[180px] text-white">
            <div className="top-6 left-6 absolute">
              <BadgeCheck size={42} />
            </div>
            <div className="right-6 bottom-6 absolute">
              <h1 className="mb-2 text-lg">{t("licence")}</h1>
              <p className="font-thin text-sm">2026-06-06</p>
            </div>
          </Card>
        )}
      </div>
      <Particles
        className="absolute inset-0 z-0"
        quantity={50}
        ease={80}
        color="#7a3996"
        refresh
      />
      <Particles
        className="absolute inset-0 z-0"
        quantity={30}
        ease={100}
        color="#00bbbe"
        refresh
      />
    </div>
  );
};

export default UserCard;
