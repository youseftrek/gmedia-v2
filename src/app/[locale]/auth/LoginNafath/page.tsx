"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { handleNafathLogin } from "@/lib/authService";

const LoginNafath = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get("code");
  const t = useTranslations("LoginPage");

  useEffect(() => {
    const processNafathLogin = async () => {
      if (!code) {
        setError(t("loginFailed"));
        setLoading(false);
        return;
      }

      try {
        // Call the Nafath login API
        const response = await handleNafathLogin(code);

        // Store the token and user in session storage
        sessionStorage.setItem("token", response.data.token);
        sessionStorage.setItem("user", JSON.stringify(response.data.user));

        // Set the default language based on user preference
        const defaultLanguage = response.data.user.language === 1 ? "ar" : "en";
        sessionStorage.setItem("defaultLanguage", defaultLanguage);

        // Redirect to dashboard
        window.location.href = "/dashboard";
      } catch (error) {
        console.error("Login error:", error);
        setError(t("loginFailed"));
      } finally {
        setLoading(false);
      }
    };

    processNafathLogin();
  }, [code, router, t]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-background">
      {loading ? (
        <div className="fixed inset-0 bg-background/90 flex flex-col justify-center items-center z-50">
          <div className="relative w-[316px] h-[316px] mb-4">
            <Image
              src="/images/gmedia/loader.svg"
              alt={t("authenticating")}
              fill
              className="object-contain"
            />
          </div>
          <p className="text-primary font-medium">{t("authenticating")}</p>
        </div>
      ) : error ? (
        <div className="p-6 bg-destructive/10 rounded-lg max-w-md text-center">
          <h2 className="text-xl font-bold text-destructive mb-2">
            {t("loginFailed")}
          </h2>
          <p className="text-muted-foreground">{error}</p>
          <button
            onClick={() => router.push("/auth/login")}
            className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            {t("returnToLogin")}
          </button>
        </div>
      ) : null}
    </div>
  );
};

export default LoginNafath;
