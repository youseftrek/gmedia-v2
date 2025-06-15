import { getSessionSafe } from "@/lib/auth";
import { getTranslations } from "next-intl/server";
import HomeClient from "./_components/HomeClient";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Metadata");

  return {
    title: t("home.title"),
  };
}

export default async function Home() {
  const session = await getSessionSafe();
  const t = await getTranslations("HomePage");

  // Extract all translations needed for the client component
  const translations = {
    welcome: t("welcome"),
    heroTitle: t("hero.title"),
    heroDescription: t("hero.description"),
    cta1: t("cta1"),
    cta2: t("cta2"),
    secondaryCta: t("hero.secondaryCta"),
    servicesTitle: t("services.title"),
    servicesDescription: t("services.description"),
  };

  // Render the client component with the data it needs
  return <HomeClient session={session} translations={translations} />;
}
