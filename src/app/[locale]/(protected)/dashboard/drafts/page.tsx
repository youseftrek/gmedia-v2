import { auth } from "@/lib/auth";
import ClientDrafts from "./_components/ClientDrafts";
import { getTranslations } from "next-intl/server";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Metadata");

  return {
    title: t("drafts.title"),
  };
}

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function DraftsPage({ params }: Props) {
  const session = await auth();
  const { locale } = await params;
  return <ClientDrafts session={session!} locale={locale} />;
}
