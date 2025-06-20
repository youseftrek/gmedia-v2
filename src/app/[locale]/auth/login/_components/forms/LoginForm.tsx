"use client";

import { useLocale, useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useRouter } from "@/i18n/routing";
import { useEffect, useState, useCallback } from "react";
import Image from "next/image";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import PasswordInput from "@/components/ui/password-input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import z from "zod";
import { UserLoginSchema } from "@/validations/user-login";
import { getCaptcha } from "@/data/get-captcha";
import { PROTECTED_ROUTES } from "@/constants";
import { AtSign, Lock, RefreshCw } from "lucide-react";
import axios from "axios";
import { useAuth } from "@/providers/AuthProvider";

const LoginForm = ({ callbackUrl }: { callbackUrl?: string }) => {
  const router = useRouter();
  const { setSession, setIsAuthenticated } = useAuth();
  const t = useTranslations("LoginPage.form");
  const [isCaptchaLoading, setIsCaptchaLoading] = useState(true);
  const [captchaData, setCaptchaData] = useState({
    image: "",
    guid: "",
  });

  const form = useForm({
    resolver: zodResolver(UserLoginSchema),
    defaultValues: {
      username: "mat",
      password: "P@$$w0rd2024",
      captchaToken: "",
      guid: "",
    },
  });

  const fetchCaptcha = useCallback(async () => {
    setIsCaptchaLoading(true);
    try {
      const res = await getCaptcha();

      if (res.success && res.data?.data) {
        const { captchaImage, guidId } = res.data.data;
        console.log("guid", guidId);
        setCaptchaData({ image: captchaImage, guid: guidId });
        form.setValue("guid", guidId);
      } else {
        toast.error(res.error || "Failed to load captcha");
      }
    } catch (error) {
      toast.error("Failed to load captcha");
      console.error(error);
    } finally {
      setIsCaptchaLoading(false);
    }
  }, [form]);

  useEffect(() => {
    fetchCaptcha();
  }, [fetchCaptcha]);

  const onSubmit = async (values: z.infer<typeof UserLoginSchema>) => {
    try {
      const res = await axios.post("/api/auth/login", values);
      if (res.data.success) {
        toast.success(t("success-login"));
        router.push(PROTECTED_ROUTES.DASHBOARD);
        setSession(res.data.session);
        setIsAuthenticated(true);
      } else {
        toast.error(res.data.error);
        form.setValue("captchaToken", "");
      }
    } catch (error) {
      console.error(error);
      toast.error("An unexpected error occurred.");
      form.setValue("captchaToken", "");
      fetchCaptcha();
    }
  };

  const refreshCaptcha = () => {
    fetchCaptcha();
    form.setValue("captchaToken", "");
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <AtSign className="opacity-70 w-4 h-4" />
                {t("username")}
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="JohnDoe"
                  disabled={form.formState.isSubmitting}
                  className="bg-card/50 backdrop-blur-sm border-muted"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <Lock className="opacity-70 w-4 h-4" />
                {t("password")}
              </FormLabel>
              <FormControl>
                <PasswordInput
                  field={field}
                  disabled={form.formState.isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="captchaToken"
          render={({ field }) => (
            <FormItem className="mb-2">
              <div className="flex justify-between items-center mb-1">
                <FormLabel>{t("captchaToken")}</FormLabel>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={refreshCaptcha}
                  disabled={form.formState.isSubmitting || isCaptchaLoading}
                  className="px-2 h-8 text-xs"
                >
                  <RefreshCw
                    className={`mr-1 w-3 h-3 ${
                      isCaptchaLoading ? "animate-spin" : ""
                    }`}
                  />
                  {t("refreshCaptcha")}
                </Button>
              </div>

              <div className="bg-white mb-2 border rounded-md overflow-hidden h-[70px]">
                {isCaptchaLoading ? (
                  <div className="flex items-center justify-center h-full w-full">
                    <Skeleton className="h-full w-full" />
                  </div>
                ) : captchaData.image ? (
                  <Image
                    src={`data:image/png;base64,${captchaData.image}`}
                    alt="captcha"
                    width={900}
                    height={100}
                    className="w-full object-contain"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full w-full text-muted-foreground text-sm">
                    Failed to load captcha
                  </div>
                )}
              </div>

              <FormControl>
                <Input
                  placeholder="######"
                  disabled={form.formState.isSubmitting || isCaptchaLoading}
                  className="bg-card/50 backdrop-blur-sm border-muted font-mono tracking-widest"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          loading={form.formState.isSubmitting}
          spinnerColor="text-white"
          className="mt-2 w-full font-semibold"
          size="lg"
          disabled={form.formState.isSubmitting || isCaptchaLoading}
        >
          {t("submit")}
        </Button>
      </form>
    </Form>
  );
};

export default LoginForm;
