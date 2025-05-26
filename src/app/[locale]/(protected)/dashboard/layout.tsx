import { auth } from "@/auth";
import DashboardLayoutClient from "./_components/DashboardLayoutClient";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Get session data on the server
  const session = await auth();

  // Pass session to client component
  return (
    <DashboardLayoutClient session={session}>{children}</DashboardLayoutClient>
  );
}
