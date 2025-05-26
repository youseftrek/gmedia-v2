import { auth } from "@/auth";
import DashboardContent from "./_components/DashboardContent";
import { redirect } from "next/navigation";
import { ErrorUI } from "@/components/ui/error-ui";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getCounters } from "@/data/get-counters";
import { getCalendar } from "@/data/get-calendar";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Metadata");

  return {
    title: t("dashboard.title"),
  };
}

// Server component that fetches data and passes it to client components
export default async function DashboardPage() {
  // Server-side data fetching
  const session = await auth();

  if (!session) {
    // Redirect to login page if user is not authenticated
    redirect(`/auth/login?callbackUrl=/dashboard`);
  }

  try {
    // Use the server action to fetch dashboard data
    const { data: counters } = await getCounters(session);
    const calendar = await getCalendar(session);

    // Pass the data and session to the client component
    return (
      <DashboardContent
        counters={counters}
        calendar={calendar}
        session={session}
      />
    );
  } catch (error) {
    // Handle error state
    console.error("Error loading dashboard data:", error);
    return (
      <ErrorUI
        title="Error Loading Dashboard"
        message="There was a problem loading your dashboard data. Please try again later."
        actionText="Retry"
        actionHref="/dashboard"
      />
    );
  }
}
