import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export function useIsRtl() {
  const params = useParams();
  const [isRtl, setIsRtl] = useState(false);

  useEffect(() => {
    // Check for locale parameter, document direction, or other logic to determine RTL
    const locale = params?.locale as string;
    const rtlLocales = ["ar", "he", "fa", "ur"];

    // Check if document exists (for server-side rendering compatibility)
    const documentDir =
      typeof document !== "undefined" ? document.documentElement.dir : null;

    const isRtlLocale = locale && rtlLocales.includes(locale);
    const isRtlDocument = documentDir === "rtl";

    setIsRtl(isRtlLocale || isRtlDocument);
  }, [params]);

  return { isRtl };
}
