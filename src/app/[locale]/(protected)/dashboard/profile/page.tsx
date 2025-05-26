import { auth } from "@/auth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getInitials } from "@/lib/utils";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Metadata");

  return {
    title: t("profile.title"),
  };
}

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function ProfilePage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations("ProfilePage");
  const session = await auth();

  if (!session?.user) {
    return <div>Not authenticated</div>;
  }

  return (
    <div className="mx-auto py-8 container">
      <Card className="mx-auto max-w-2xl">
        <CardHeader>
          <CardTitle className="font-bold text-2xl">{t("title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center space-y-6">
            <div className="relative">
              <Avatar className="w-32 h-32">
                <AvatarFallback className="text-4xl text-primary bg-violet-100">
                  {locale === "ar"
                    ? getInitials(session.user.fullnameAr)
                    : getInitials(session.user.fullnameEn)}
                </AvatarFallback>
              </Avatar>
            </div>

            <div className="space-y-4 w-full">
              <div className="space-y-2">
                <label className="font-medium text-muted-foreground text-sm">
                  {t("form.nameAr")}
                </label>
                <Input
                  value={session.user.fullnameAr || ""}
                  disabled
                  className="text-lg"
                />
              </div>
              <div className="space-y-2">
                <label className="font-medium text-muted-foreground text-sm">
                  {t("form.nameEn")}
                </label>
                <Input
                  value={session.user.fullnameEn || ""}
                  disabled
                  className="text-lg"
                />
              </div>
              <div className="space-y-2">
                <label className="font-medium text-muted-foreground text-sm">
                  {t("form.email")}
                </label>
                <Input
                  value={session.user.email || ""}
                  disabled
                  className="text-lg"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
