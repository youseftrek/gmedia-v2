import { auth } from "@/lib/auth";
import ClientRequests from "./_components/ClientRequests";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Metadata");

  return {
    title: t("myRequests.title"),
  };
}

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function MyRequestsPage({ params }: Props) {
  const session = await auth();
  const { locale } = await params;
  return <ClientRequests session={session!} locale={locale} />;
}
