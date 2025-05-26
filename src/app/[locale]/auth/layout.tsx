import { LanguageSelect } from "@/components/shared/LanguageSelect";
import LogoLink from "@/components/shared/LogoLink";
import { ModeToggle } from "@/components/shared/ModeToggle";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Metadata");

  return {
    title: t("auth.title"),
  };
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col w-full justify-center items-center gap-5 bg-linear-to-br from-background/80 to-background px-4 md:px-6 py-8 min-h-screen overflow-hidden">
      <div className="z-10 flex flex-col justify-center items-center gap-6 w-full max-w-7xl mx-auto">
        <LogoLink size={150} className="mb-2" />
        {children}
      </div>

      <div className="top-3 rtl:right-3 left-3 z-20 absolute flex items-center gap-2">
        <ModeToggle buttonVariant="secondary" />
        <LanguageSelect buttonVariant="secondary" />
      </div>
    </section>
  );
}
