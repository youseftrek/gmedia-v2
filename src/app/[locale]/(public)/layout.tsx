import { auth } from "@/auth";
import PublicLayoutClient from "./_components/PublicLayoutClient";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Get session data on the server
  const session = await auth();

  // Pass session to client component
  return <PublicLayoutClient session={session}>{children}</PublicLayoutClient>;
}
