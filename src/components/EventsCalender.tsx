"use client";

import { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useLocale, useTranslations } from "next-intl";
import { Particles } from "./magicui/particles";

// Event interface
interface Event {
  id: string;
  title: string;
  time: string;
  type: string;
  color: string;
  description?: string;
  location?: string;
}

// Events by date
interface EventsByDate {
  [date: string]: Event[];
}

// Map Tailwind color names to their hex values
const tailwindColorMap: Record<string, string> = {
  red: "#ef4444",
  blue: "#3b82f6",
  green: "#10b981",
  yellow: "#f59e0b",
  purple: "#8b5cf6",
  pink: "#ec4899",
  indigo: "#6366f1",
  gray: "#6b7280",
  black: "#000000",
  white: "#ffffff",
  orange: "#f97316",
  teal: "#14b8a6",
  cyan: "#06b6d4",
  lime: "#84cc16",
  emerald: "#059669",
  amber: "#d97706",
  violet: "#7c3aed",
  fuchsia: "#d946ef",
  rose: "#f43f5e",
};

// Function to resolve color name to hex
const resolveColor = (colorName: string): string => {
  // If it's already a hex color, return it
  if (colorName.startsWith("#")) {
    return colorName;
  }

  // Check if it's a Tailwind color
  return tailwindColorMap[colorName.toLowerCase()] || "#6b7280"; // Default to gray
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function EventsCalender({ calendar }: { calendar: any }) {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [eventData, setEventData] = useState<EventsByDate>({});
  const locale = useLocale();
  const t = useTranslations("DashboardPage.Calendar");

  // Fetch events from API
  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        // Simulate API call
        setTimeout(() => {
          setEventData(calendar.data);
          setLoading(false);
        }, 800);
      } catch (error) {
        console.error("Failed to fetch events:", error);
        setLoading(false);
      }
    };

    fetchEvents();
  }, [calendar]);

  // Get events for a specific date
  const getEventsForDate = (date: Date | null) => {
    if (!date) return [];

    const dateString = date.toISOString().split("T")[0];
    return eventData[dateString] || [];
  };

  // Handle day click
  const handleDayClick = (day: Date) => {
    setSelectedDate(day);
    setDialogOpen(true);
  };

  // Get event badge color
  const getEventBadgeClass = (type: string) => {
    switch (type) {
      case "Meeting":
        return "bg-blue-500 hover:bg-blue-600";
      case "Birthday":
        return "bg-pink-500 hover:bg-pink-600";
      case "Deadline":
        return "bg-red-500 hover:bg-red-600";
      case "Holiday":
        return "bg-green-500 hover:bg-green-600";
      case "Conference":
        return "bg-purple-500 hover:bg-purple-600";
      default:
        return "bg-gray-500 hover:bg-gray-600";
    }
  };

  // Render day with event indicators
  const RenderDay = (day: Date) => {
    const dateString = day.toISOString().split("T")[0];
    const dayEvents = eventData[dateString] || [];
    const isToday = day.toDateString() === new Date().toDateString();

    return (
      <div
        className={`relative w-8 h-8 flex flex-col items-center justify-center 
        ${
          dayEvents.length > 0
            ? "cursor-pointer rounded-md border-2 border-secondary"
            : ""
        }
        ${isToday ? "font-bold text-primary" : ""}`}
        onClick={() => handleDayClick(day)}
      >
        {dayEvents.length > 0 && (
          <div className="top-0.5 right-0 left-0 absolute flex justify-center">
            <div className="flex gap-0.5">
              {dayEvents.slice(0, 3).map((event, i) => (
                <div
                  key={i}
                  className="rounded-full w-1.5 h-1.5"
                  style={{
                    backgroundColor: resolveColor(event.color),
                  }}
                />
              ))}
              {dayEvents.length > 3 && (
                <div className="bg-gray-400 rounded-full w-1.5 h-1.5" />
              )}
            </div>
          </div>
        )}
        <div className="mt-2">{day.getDate()}</div>
      </div>
    );
  };

  return (
    <div className="w-full">
      <Card className="relative w-full bg-background">
        <Particles
          className="absolute inset-0 -z-10 h-full"
          quantity={20}
          ease={80}
          color="#7a3996"
          refresh
        />
        <Particles
          className="absolute inset-0 -z-10 h-full"
          quantity={10}
          ease={80}
          color="#00bbbe"
          refresh
        />
        <CardHeader>
          <CardTitle>{t("title")}</CardTitle>
          <CardDescription>
            {loading ? t("loading") : t("info")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-background mx-auto w-fit z-30">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="border rounded-md z-20"
              components={{
                Day: ({ date: dayDate, ...props }) => {
                  // Create an interface for the props we expect from the DayPicker component
                  interface DayProps
                    extends React.HTMLAttributes<HTMLDivElement> {
                    displayMonth?: Date;
                    // Add other non-DOM props here if needed
                  }

                  // Ignore the displayMonth prop by not passing it to the DOM
                  // eslint-disable-next-line @typescript-eslint/no-unused-vars
                  const { displayMonth, ...domSafeProps } = props as DayProps;

                  return <div {...domSafeProps}>{RenderDay(dayDate)}</div>;
                },
              }}
            />
          </div>

          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {selectedDate?.toLocaleDateString(
                    locale === "ar" ? "ar-EG" : "en-US",
                    {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                    }
                  )}
                </DialogTitle>
                <DialogDescription>
                  {getEventsForDate(selectedDate).length
                    ? `${t("events")} ${getEventsForDate(selectedDate).length}`
                    : t("noEvents")}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 mt-2 pr-2 max-h-[60vh] overflow-y-auto">
                {getEventsForDate(selectedDate).length > 0 ? (
                  getEventsForDate(selectedDate).map((event) => (
                    <div
                      key={event.id}
                      className="bg-muted p-2 pl-3 border-l-4 rounded-sm"
                      style={{
                        borderLeftColor: resolveColor(event.color),
                      }}
                    >
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium">{event.title}</h4>
                        <Badge className={getEventBadgeClass(event.type)}>
                          {event.type}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground text-sm">
                        {event.time}
                      </p>
                      {event.location && (
                        <p className="text-muted-foreground text-sm">
                          📍 {event.location}
                        </p>
                      )}
                      {event.description && (
                        <p className="mt-1 text-sm">{event.description}</p>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="py-8 text-slate-500 text-center">
                    <p>{t("noEvents")}</p>
                  </div>
                )}
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  {t("close")}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  );
}

// Mock events data
// const mockEvents: EventsByDate = {
//   "2025-04-15": [
//     {
//       id: "evt-1",
//       title: "Team Meeting",
//       time: "10:00 - 12:00",
//       type: "Meeting",
//       color: "#3b82f6",
//       description: "Weekly team sync meeting",
//       location: "Conference Room A",
//     },
//     {
//       id: "evt-2",
//       title: "Project Deadline",
//       time: "17:00",
//       type: "Deadline",
//       color: "#ef4444",
//       description: "Final submission for the client dashboard project",
//     },
//   ],
//   "2025-04-16": [
//     {
//       id: "evt-3",
//       title: "Alex's Birthday",
//       time: "All day",
//       type: "Birthday",
//       color: "#ec4899",
//       description: "Don't forget to send a card!",
//     },
//   ],
//   "2025-04-18": [
//     {
//       id: "evt-4",
//       title: "Team Lunch",
//       time: "12:30 - 14:00",
//       type: "Meeting",
//       color: "#3b82f6",
//       description: "Monthly team bonding lunch",
//       location: "Downtown Grill",
//     },
//   ],
//   "2025-04-21": [
//     {
//       id: "evt-5",
//       title: "Conference",
//       time: "09:00 - 16:00",
//       type: "Conference",
//       color: "#8b5cf6",
//       description: "Annual industry conference",
//       location: "Convention Center",
//     },
//   ],
//   "2025-04-25": [
//     {
//       id: "evt-6",
//       title: "Client Meeting",
//       time: "11:00 - 12:30",
//       type: "Meeting",
//       color: "#3b82f6",
//       description: "Presentation of new marketing strategy",
//       location: "Client HQ",
//     },
//   ],
//   "2025-04-28": [
//     {
//       id: "evt-7",
//       title: "Travel Booking Deadline",
//       time: "12:00",
//       type: "Deadline",
//       color: "#ef4444",
//       description: "Book flights and hotel for next month's business trip",
//     },
//   ],
//   "2025-05-01": [
//     {
//       id: "evt-8",
//       title: "Holiday",
//       time: "All day",
//       type: "Holiday",
//       color: "#10b981",
//       description: "Public holiday - office closed",
//     },
//   ],
//   "2025-05-05": [
//     {
//       id: "evt-9",
//       title: "Product Launch",
//       time: "09:00 - 11:00",
//       type: "Meeting",
//       color: "#3b82f6",
//       description: "New product launch meeting",
//       location: "Main Conference Room",
//     },
//   ],
// };
