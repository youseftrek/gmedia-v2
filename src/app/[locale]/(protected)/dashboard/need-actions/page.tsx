import { auth } from "@/auth";
import ClientNeedActions from "./_components/ClientNeedActions";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Metadata");

  return {
    title: t("needActions.title"),
  };
}

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function NeedActionsPage({ params }: Props) {
  const session = await auth();
  const { locale } = await params;
  return <ClientNeedActions session={session!} locale={locale} />;
}
