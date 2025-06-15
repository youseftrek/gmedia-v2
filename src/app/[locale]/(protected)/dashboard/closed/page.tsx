import { auth } from "@/lib/auth";
import ClientClosed from "./_components/ClientClosed";
import { getTranslations } from "next-intl/server";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Metadata");

  return {
    title: t("closed.title"),
  };
}

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function DraftsPage({ params }: Props) {
  const session = await auth();
  const { locale } = await params;
  return <ClientClosed session={session!} locale={locale} />;
}
