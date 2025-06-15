"use client";

import UserNotifications from "./UserNotifications";
import StatisticsSection from "./StatisticsSection";
import CalendarSection from "./CalendarSection";
import RequestsTable from "./RequestsTable";
import { Session } from "@/lib/auth";
import AnimateInView from "@/components/ui/animate-in-view";
import { PageTransition, SlideIn } from "@/components/ui/layout-animations";
import ClientNeedActions from "../need-actions/_components/ClientNeedActions";
import { useLocale } from "next-intl";

// Define counters type
interface Counters {
  actionRequests: number;
  myBills: number;
  draftRequests: number;
  closedRequests: number;
}

// Create a type for calendar data
interface CalendarData {
  success: boolean;
  data: Record<string, unknown>;
  message: string | null;
  [key: string]: unknown;
}

interface DashboardContentProps {
  counters: Counters;
  calendar: CalendarData;
  session: Session;
}

export default function DashboardContent({
  counters,
  calendar,
  session,
}: DashboardContentProps) {
  const locale = useLocale();
  return (
    <PageTransition>
      <div className="mx-auto p-3 max-w-7xl">
        {/* User Card and Notifications with slide-in animation */}
        <SlideIn direction="down" delay={0.1}>
          <UserNotifications session={session} />
        </SlideIn>

        {/* Statistics and Calendar Section - animate on scroll */}
        <div className="flex md:flex-row flex-col-reverse gap-6 mt-6">
          <AnimateInView direction="left" className="w-full flex-1" delay={0.1}>
            <StatisticsSection counters={counters} />
          </AnimateInView>

          <AnimateInView
            direction="right"
            className="w-full md:w-fit"
            delay={0.2}
          >
            <CalendarSection calendar={calendar} />
          </AnimateInView>
        </div>

        {/* Requests Table Section - animate on scroll */}
        <AnimateInView direction="up" className="mt-6" delay={0.3}>
          <ClientNeedActions session={session} locale={locale} />
        </AnimateInView>
      </div>
    </PageTransition>
  );
}
