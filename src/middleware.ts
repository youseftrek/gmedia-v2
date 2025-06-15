// middleware.ts
import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";
import { PROTECTED_ROUTES, PUBLIC_ROUTES } from "./constants";
import { LOCALE_CODE, LOCALES } from "./constants/locale";
import { getCurrentUserLang } from "./data/get-current-user-lang";

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 1. Figure out the "first segment" locale in the URL, if any
  //    e.g. "/en/dashboard" ⇒ "en", "/" ⇒ undefined
  const [, pathLocale] = pathname.split("/");
  const isValidLocale = LOCALES.includes(pathLocale);

  // 2. Get path without locale for redirects
  const pathWithoutLocale = isValidLocale
    ? pathname.substring(pathLocale.length + 1) // +1 for the slash
    : pathname;

  // 3. Check if current path is a public route
  const isPublicRoute = Object.values(PUBLIC_ROUTES).some((route) => {
    // Handle route patterns with parameters like "/service-details/:id"
    if (route.includes("/:")) {
      const baseRoute = route.split("/:")[0];
      return (
        pathWithoutLocale === baseRoute ||
        pathWithoutLocale.startsWith(`${baseRoute}/`)
      );
    }
    return pathWithoutLocale === route;
  });

  // Separately check for service-details pages for backward compatibility
  const isServiceDetailsPage =
    pathWithoutLocale === "service-details" ||
    pathWithoutLocale.startsWith("service-details/");

  // Consider empty path (just the locale like /en or /ar) as public
  const isRootPath = pathWithoutLocale === "" || pathWithoutLocale === "/";

  // Set all non-protected routes as accessible without authentication
  const isProtectedRoute = Object.values(PROTECTED_ROUTES).some((route) =>
    pathWithoutLocale.startsWith(route)
  );

  // 4. Redirect root path (/) to default locale
  if (pathname === "/") {
    return NextResponse.redirect(new URL(`/ar`, req.nextUrl.origin));
  }

  // 5. Redirect any non-localized path to a localized path
  if (!isValidLocale && pathname !== "/") {
    // For non-localized paths, we'll still check auth to determine default locale
    const token = req.cookies.get("auth-token")?.value;
    const isAuthenticated = !!token;

    // Default to Arabic, but use user locale for authenticated users
    let redirectLocale = "ar";

    // Only attempt to get user's language if authenticated AND on a protected route
    if (isAuthenticated && isProtectedRoute) {
      try {
        const { success, data } = await getCurrentUserLang(token);
        if (success && data?.data) {
          redirectLocale =
            Object.entries(LOCALE_CODE).find(
              ([_, code]) => code === data.data
            )?.[0] || "ar";
        }
      } catch (error) {
        console.error("Failed to get user language:", error);
      }
    }

    return NextResponse.redirect(
      new URL(`/${redirectLocale}${pathname}`, req.nextUrl.origin)
    );
  }

  // 6. For protected routes: if user is authenticated and their locale in URL doesn't match preference
  //    redirect them to their preferred locale
  if (isValidLocale && isProtectedRoute) {
    const token = req.cookies.get("auth-token")?.value;
    const isAuthenticated = !!token;

    if (isAuthenticated) {
      let userLocale = "ar";
      try {
        const { success, data } = await getCurrentUserLang(token);
        if (success && data?.data) {
          userLocale =
            Object.entries(LOCALE_CODE).find(
              ([_, code]) => code === data.data
            )?.[0] || "ar";
        }
      } catch (error) {
        console.error("Failed to get user language:", error);
      }

      // Only redirect if user's locale doesn't match URL locale
      if (pathLocale !== userLocale) {
        return NextResponse.redirect(
          new URL(`/${userLocale}${pathWithoutLocale}`, req.nextUrl.origin)
        );
      }
    }
  }

  // 7. Standard protection: if they hit a protected path but aren't authed, send them to login
  if (isProtectedRoute) {
    const token = req.cookies.get("auth-token")?.value;
    const isAuthenticated = !!token;

    if (!isAuthenticated) {
      return NextResponse.redirect(
        new URL(
          `/${pathLocale || "ar"}${PUBLIC_ROUTES.LOGIN}`,
          req.nextUrl.origin
        )
      );
    }
  }

  // 8. If they go to the "/auth" pages but ARE authenticated, send them to their locale dashboard
  if (pathname.includes("/auth")) {
    const token = req.cookies.get("auth-token")?.value;
    const isAuthenticated = !!token;

    if (isAuthenticated) {
      let userLocale = "ar";
      try {
        const { success, data } = await getCurrentUserLang(token);
        if (success && data?.data) {
          userLocale =
            Object.entries(LOCALE_CODE).find(
              ([_, code]) => code === data.data
            )?.[0] || "ar";
        }
      } catch (error) {
        console.error("Failed to get user language:", error);
      }

      return NextResponse.redirect(
        new URL(
          `/${userLocale}${PROTECTED_ROUTES.DASHBOARD}`,
          req.nextUrl.origin
        )
      );
    }
  }

  // 9. Finally, hand off to next‑intl for locale file loading
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
