"use client";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { useTranslations, useLocale } from "next-intl";
import Image from "next/image";
import { CalendarClock, Clock, HandCoins, SendHorizontal } from "lucide-react";

type Props = {
  service: {
    documentTypeId?: number;
    imageName?: string;
    fees?: string;
    title?: string;
    description?: string;
    licensePeriod?: string;
    invoiceExpiryDays?: string;
    monthlyFees?: string;
    detailsUrl?: string;
    group?: string;
  };
};

const ServiceCard = ({ service }: Props) => {
  const t = useTranslations("ServicesPage");
  const hasFees =
    service.fees && parseFloat(service.fees.replace(/,/g, "")) > 0;

  // Format currency based on locale
  const formatCurrency = (amount: string | undefined) => {
    if (!amount) return "0";

    // Remove commas and parse as float
    const num = parseFloat(amount.replace(/,/g, ""));
    if (isNaN(num)) return amount;

    const isWhole = Number.isInteger(num);

    return num.toLocaleString("en-US", {
      minimumFractionDigits: isWhole ? 0 : 2,
      maximumFractionDigits: 2,
    });
  };

  return (
    <Card
      key={service.documentTypeId}
      className="flex flex-col justify-between p-6 min-h-[300px] hover:scale-[102%] transition-all duration-300 bg-linear-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-950 border-slate-200 dark:border-slate-800 overflow-hidden relative group"
    >
      {/* Decorative elements */}
      {/* <div className="absolute -z-10 -top-10 -right-10 w-60 h-60 bg-primary/10 rounded-full blur-xl group-hover:bg-primary/15 transition-all duration-500"></div>
      <div className="absolute -z-10 -bottom-8 -left-8 w-60 h-60 bg-[#00bbbe]/5 rounded-full blur-lg group-hover:bg-[#00bbbe]/10 transition-all duration-500"></div> */}

      <div className="relative z-10 flex flex-col h-full">
        <div className="flex justify-between items-start mb-4">
          <div className="relative overflow-hidden rounded-lg w-12 h-12 flex items-center justify-center bg-primary/10 dark:bg-primary/20">
            <Image
              src={`/images/gmedia/${service.imageName}`}
              alt={service.imageName || "service"}
              width={30}
              height={30}
              className="object-contain transition-transform duration-300 group-hover:scale-110"
            />
          </div>
          <Badge className="bg-secondary/60 hover:bg-secondary/80 text-foreground text-xs font-medium px-2.5 py-1">
            {t(`filters.${service.group}`)}
          </Badge>
        </div>

        <h2 className="mb-2 font-semibold text-primary dark:text-white text-lg tracking-tight transition-colors">
          {service.title}
        </h2>

        <div className="grow mb-4">
          <p className="text-muted-foreground text-xs line-clamp-3">
            {service.description}
          </p>
        </div>

        {/* Price section - always in the same position */}
        <div className="mb-4 h-[36px] flex items-center">
          {hasFees ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 rtl:flex-row-reverse px-3 py-1.5 bg-primary/5 dark:bg-primary/10 rounded-lg">
                <Image
                  src="/images/gmedia/Saudi_Riyal.svg"
                  alt="SAR"
                  width={16}
                  height={16}
                  className="mr-1.5 filter dark:invert light:invert-0"
                />
                <span className="font-medium text-primary dark:text-primary-foreground">
                  {formatCurrency(service.fees)}
                </span>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 rtl:flex-row-reverse px-3 py-1.5 bg-primary/5 dark:bg-primary/10 rounded-lg">
                <HandCoins size={20} />
                <span className="font-medium text-primary dark:text-primary-foreground">
                  {t("ServiceCard.free")}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-3 mt-auto pt-3 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center text-xs text-muted-foreground">
            <CalendarClock className="w-3.5 h-3.5 mr-1 text-primary/70" />
            <span>{t("ServiceCard.licensePeriod")}: </span>
            <span className="font-medium ml-1">{service.licensePeriod}</span>
          </div>
          <div className="flex items-center text-xs text-muted-foreground">
            <Clock className="w-3.5 h-3.5 mr-1 text-primary/70" />
            <span>{t("ServiceCard.invoiceExpiryDays")}: </span>
            <span className="font-medium ml-1">
              {service.invoiceExpiryDays}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-2 w-full">
          <Link
            href={`/dashboard/${service.documentTypeId}`}
            className={cn(
              buttonVariants({
                size: "sm",
                variant: "default",
                className:
                  "flex items-center w-1/2 justify-center gap-2 text-xs group-hover:bg-primary/90 transition-all duration-300",
              })
            )}
          >
            {t("ServiceCard.submitRequest")}
            <SendHorizontal className="rtl:rotate-180" />
          </Link>
          <Link
            href={`/service-details/${service.documentTypeId}`}
            className={cn(
              buttonVariants({
                variant: "outline",
                size: "sm",
                className:
                  "text-xs border-slate-200 w-1/2 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800",
              })
            )}
          >
            {t("ServiceCard.serviceDetails")}
          </Link>
        </div>
      </div>
    </Card>
  );
};

export default ServiceCard;
