"use client";

import { Card } from "@/components/ui/card";
import OrdersCard from "./wedgits/OrdersCard";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Particles } from "@/components/magicui/particles";
import { FileEdit, Receipt, SquareCheckBig } from "lucide-react";

interface StatisticsSectionProps {
  counters: {
    actionRequests: number;
    myBills: number;
    draftRequests: number;
    closedRequests: number;
  };
}

// Animation variants for the cards
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { y: 20, opacity: 0 },
  show: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 24,
    },
  },
};

export default function StatisticsSection({
  counters,
}: StatisticsSectionProps) {
  const t = useTranslations("DashboardPage");
  console.log("COUNTERS: ", counters);

  return (
    <Card className="relative bg-background p-6 w-full h-full">
      <motion.h2
        className="mb-4 font-medium text-[#25155c] dark:text-white text-2xl"
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        {t("Statistics.title")}
      </motion.h2>

      <motion.div
        className="gap-4 grid grid-cols-2 w-full"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={item}>
          <OrdersCard
            number={counters.actionRequests}
            title={t("Statistics.actionRequests")}
          />
        </motion.div>
        <motion.div variants={item}>
          <OrdersCard
            number={counters.myBills}
            title={t("Statistics.myBills")}
            icon={<Receipt />}
          />
        </motion.div>
        <motion.div variants={item}>
          <OrdersCard
            number={counters.draftRequests}
            title={t("Statistics.draftRequests")}
            icon={<FileEdit />}
          />
        </motion.div>
        <motion.div variants={item}>
          <OrdersCard
            number={counters.closedRequests}
            title={t("Statistics.closedRequests")}
            icon={<SquareCheckBig />}
          />
        </motion.div>
      </motion.div>
      <Particles
        className="absolute inset-0 z-0 h-full"
        quantity={40}
        ease={80}
        color="#7a3996"
        refresh
      />
      <Particles
        className="absolute inset-0 z-0 h-full"
        quantity={30}
        ease={80}
        color="#00bbbe"
        refresh
      />
    </Card>
  );
}
