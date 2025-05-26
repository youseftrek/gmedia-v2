// middleware.ts
import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";
import { auth } from "./auth";
import { PROTECTED_ROUTES, PUBLIC_ROUTES } from "./constants";
import { LOCALE_CODE, LOCALES } from "./constants/locale";
import { getCurrentUserLang } from "./data/get-current-user-lang";

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 1. Run authentication check early
  const authResponse = await auth();
  const isAuthenticated =
    !!authResponse && new Date() <= new Date(authResponse.expires);

  // 2. Figure out the "first segment" locale in the URL, if any
  //    e.g. "/en/dashboard" ⇒ "en", "/" ⇒ undefined
  const [, pathLocale] = pathname.split("/");
  const isValidLocale = LOCALES.includes(pathLocale);

  // 3. Determine the user's own locale (fallback to "en")
  let userLocale = "en";
  if (isAuthenticated) {
    try {
      const { success, data } = await getCurrentUserLang(authResponse);

      if (success && data?.data) {
        // Find the locale that matches the numeric code
        userLocale =
          Object.entries(LOCALE_CODE).find(
            ([_, code]) => code === data.data
          )?.[0] || "en";
      }
    } catch (error) {
      console.error("Failed to get user language:", error);
    }
  }

  // 4. Get path without locale for redirects
  const pathWithoutLocale = isValidLocale
    ? pathname.substring(pathLocale.length + 1) // +1 for the slash
    : pathname;

  // 5. Redirect root path (/) to default locale
  if (pathname === "/") {
    return NextResponse.redirect(new URL(`/en`, req.nextUrl.origin));
  }

  // 6. Redirect any non-localized path to user locale or default locale
  if (!isValidLocale && pathname !== "/") {
    const redirectLocale = isAuthenticated ? userLocale : "en";
    return NextResponse.redirect(
      new URL(`/${redirectLocale}${pathname}`, req.nextUrl.origin)
    );
  }

  // 7. If user is authenticated but their locale in URL doesn't match their preference...
  //    redirect them to the same path but with their preferred locale
  if (isAuthenticated && isValidLocale && pathLocale !== userLocale) {
    // Skip redirecting for public routes and service-details pages
    const isPublicRoute = Object.values(PUBLIC_ROUTES).some(
      (route) => pathWithoutLocale === route
    );
    const isServiceDetailsPage =
      pathWithoutLocale.startsWith("service-details/");

    if (!isPublicRoute && !isServiceDetailsPage) {
      return NextResponse.redirect(
        new URL(`/${userLocale}${pathWithoutLocale}`, req.nextUrl.origin)
      );
    }
  }

  // 8. Standard protection: if they hit a protected path but aren't authed, send them to login
  if (pathname.includes(PROTECTED_ROUTES.DASHBOARD) && !isAuthenticated) {
    return NextResponse.redirect(
      new URL(
        `/${pathLocale || "en"}${PUBLIC_ROUTES.LOGIN}`,
        req.nextUrl.origin
      )
    );
  }

  // 9. If they go to the "/auth" pages but ARE authenticated, send them to their locale dashboard
  if (pathname.includes("/auth") && isAuthenticated) {
    return NextResponse.redirect(
      new URL(`/${userLocale}${PROTECTED_ROUTES.DASHBOARD}`, req.nextUrl.origin)
    );
  }

  // 10. Finally, hand off to next‑intl for locale file loading
  return createMiddleware(routing)(req);
}

// Skip _next, api, static files, and favicon in middleware altogether
export const config = {
  matcher: [
    "/",
    "/(ar|en)/:path*",
    "/((?!_next|api|images|SVGs|favicon\\.ico).*)",
  ],
};
