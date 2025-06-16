import "../globals.css";
import { LocaleType } from "@/i18n/request";
import { DIRECTIONS } from "../../constants/locale";
import { IBM_Plex_Sans_Arabic, Outfit } from "next/font/google";
import NextTopLoader from "nextjs-toploader";
import { NextIntlClientProvider } from "next-intl";
import { routing } from "@/i18n/routing";
import { notFound } from "next/navigation";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/providers/theme-provider";
import { getMessages } from "next-intl/server";
import { AuthProvider } from "@/providers/AuthProvider";

const FONT_EN = Outfit({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  preload: true,
});

const FONT_AR = IBM_Plex_Sans_Arabic({
  weight: ["100", "200", "300", "400", "500", "600", "700"],
  subsets: ["latin"],
  preload: true,
});

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: LocaleType }>;
}) {
  const messages = await getMessages();
  const { locale } = await params;

  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as LocaleType)) {
    notFound();
  }

  return (
    <html
      className="overflow-x-hidden"
      suppressHydrationWarning
      lang={locale}
      dir={DIRECTIONS[locale] || "ltr"}
    >
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
        />
      </head>
      <body
        suppressHydrationWarning
        className={`${
          locale === "ar" ? FONT_AR.className : FONT_EN.className
        } antialiased w-full h-full overflow-y-auto`}
      >
        <NextTopLoader
          color="#7a3996"
          initialPosition={0.08}
          height={3}
          showSpinner={false}
          easing="ease"
          shadow="0 0 10px #7a3996,0 0 5px #7a3996"
        />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NextIntlClientProvider messages={messages}>
            <AuthProvider>{children}</AuthProvider>
            <Toaster
              invert={true}
              richColors
              position={locale === "ar" ? "bottom-left" : "bottom-right"}
            />
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
