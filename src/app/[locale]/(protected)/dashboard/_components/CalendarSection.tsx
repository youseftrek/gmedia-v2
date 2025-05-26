"use client";

import EventsCalender from "@/components/EventsCalender";

// Create a type for calendar data
interface CalendarData {
  success: boolean;
  data: Record<string, unknown>;
  message: string | null;
  [key: string]: unknown;
}

interface CalendarSectionProps {
  calendar: CalendarData;
}

export default function CalendarSection({ calendar }: CalendarSectionProps) {
  return (
    <div className="w-full md:w-fit">
      <EventsCalender calendar={calendar} />
    </div>
  );
}
