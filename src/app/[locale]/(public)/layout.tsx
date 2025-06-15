import { getSessionSafe } from "@/lib/auth";
import PublicLayoutClient from "./_components/PublicLayoutClient";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Get session data on the server without redirecting
  const session = await getSessionSafe();

  // Pass session to client component
  return <PublicLayoutClient session={session}>{children}</PublicLayoutClient>;
}
