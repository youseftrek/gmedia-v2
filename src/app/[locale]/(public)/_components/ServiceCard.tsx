"use client";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { CalendarClock, Clock, HandCoins, SendHorizontal } from "lucide-react";
import { motion } from "framer-motion";

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
  index: number; // Add index prop for staggered animations
};

const ServiceCard = ({ service, index }: Props) => {
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

  // Card animation variants
  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.1, 0.25, 1.0], // Cubic bezier for smooth easing
        delay: index * 0.1, // Staggered delay based on card index
      },
    },
    hover: {
      y: -5,
      scale: 1.02,
      boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      transition: {
        duration: 0.3,
      },
    },
  };

  const iconVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        delay: index * 0.1 + 0.2,
        duration: 0.4,
      },
    },
    hover: {
      scale: 1.2,
      rotate: 5,
      transition: { duration: 0.2 },
    },
  };

  const badgeVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        delay: index * 0.1 + 0.3,
        duration: 0.3,
      },
    },
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      whileHover="hover"
      layout
      layoutId={`card-${service.documentTypeId}`}
      className="h-full"
    >
      <Card
        key={service.documentTypeId}
        className="flex flex-col justify-between p-5 h-full transition-all duration-300 bg-linear-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-950 border-slate-200 dark:border-slate-800 overflow-hidden relative group"
      >
        {/* Decorative elements */}
        <motion.div
          className="absolute -z-10 -top-20 -right-20 w-80 h-80 bg-primary/5 rounded-full blur-xl"
          animate={{
            scale: [1, 1.05, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
        <motion.div
          className="absolute -z-10 -bottom-20 -left-20 w-80 h-80 bg-[#00bbbe]/5 rounded-full blur-xl"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.7, 0.3],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            repeatType: "reverse",
            delay: 1,
          }}
        />

        <div className="relative z-10 flex flex-col h-full">
          <div className="flex justify-between items-start mb-4">
            <motion.div
              className="relative overflow-hidden rounded-lg w-12 h-12 flex items-center justify-center bg-primary/10 dark:bg-primary/20"
              variants={iconVariants}
              whileHover="hover"
            >
              <Image
                src={`/images/gmedia/${service.imageName}`}
                alt={service.imageName || "service"}
                width={30}
                height={30}
                className="object-contain"
              />
            </motion.div>
            <motion.div variants={badgeVariants}>
              <Badge className="bg-secondary/60 hover:bg-secondary/80 text-foreground text-xs font-medium px-2.5 py-1">
                {t(`filters.${service.group}`)}
              </Badge>
            </motion.div>
          </div>

          <motion.h2
            className="mb-2 font-semibold text-primary dark:text-white text-lg tracking-tight transition-colors"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.1 + 0.3, duration: 0.4 }}
          >
            {service.title}
          </motion.h2>

          <motion.div
            className="mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.1 + 0.4, duration: 0.4 }}
          >
            <p className="text-muted-foreground text-xs line-clamp-3 overflow-hidden">
              {service.description}
            </p>
          </motion.div>
        </div>

        <motion.div
          className="flex flex-col gap-2 mt-auto pt-3 border-t border-slate-100 dark:border-slate-800"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 + 0.6, duration: 0.4 }}
        >
          <div className="flex items-center">
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
              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
              >
                <SendHorizontal className="rtl:rotate-180" />
              </motion.div>
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
        </motion.div>
      </Card>
    </motion.div>
  );
};

export default ServiceCard;
