"use client";

import ModularDynamicFormRenderer from "@/components/form-io/ModularDynamicFormRenderer";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { toast } from "sonner";
import axios from "axios";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface FormSchema {
  formDesigner:
    | {
        components: unknown[];
        display: string;
      }
    | string;
  translations?:
    | Array<{
        Keyword: string;
        En: string;
        Ar: string;
        Fr: string;
        Type?: string;
      }>
    | string;
  formData?: Record<string, unknown>;
  documentTypesBase?: string;
  formDesignerTranslation?: any;
}

type Props = {
  formData: FormSchema;
};

export default function SignUpClient({ formData }: Props) {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("SignUpPage");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [currentFormData, setCurrentFormData] = useState<any>(null);

  // Parse the formDesigner if it's a string
  const formDesigner =
    typeof formData?.formDesigner === "string"
      ? (() => {
          try {
            return JSON.parse(formData.formDesigner);
          } catch (e) {
            console.error("Error parsing formDesigner:", e);
            return { components: [], display: "form" };
          }
        })()
      : formData?.formDesigner;

  // Parse the translations if available
  const translations = formData?.formDesignerTranslation
    ? typeof formData.formDesignerTranslation === "string"
      ? (() => {
          try {
            return JSON.parse(formData.formDesignerTranslation);
          } catch (e) {
            console.error("Error parsing formDesignerTranslation:", e);
            return [];
          }
        })()
      : formData.formDesignerTranslation
    : formData?.translations || [];

  // Create the properly formatted schema
  const formattedSchema = {
    formDesigner,
    translations,
    formData: formData?.formData || {},
  };

  const handleSubmit = async (data: unknown) => {
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);

      const response = await axios.post("https://e-stg.sa/api/sign-up", data, {
        headers: {
          "Content-Type": "application/json",
          "Accept-Language": locale === "ar" ? "ar" : "en",
        },
      });

      console.log("Registration response:", response.data);

      if (response.data.success) {
        toast.success(t("success"));
        router.push(`/${locale}/auth/login`);
      } else {
        toast.error(response.data.message || t("error"));
      }
    } catch (error: any) {
      console.error("Registration error:", error);

      if (error.response) {
        // Server responded with an error
        toast.error(error.response.data.message || t("error"));
      } else if (error.request) {
        // Network error
        toast.error(t("networkError"));
      } else {
        // Other error
        toast.error(t("error"));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFormSubmit = async (data: any) => {
    console.log("Form submitted with data:", data);
    setCurrentFormData(data);
    setShowSubmitDialog(true);
  };

  const confirmSubmit = async () => {
    if (currentFormData) {
      setShowSubmitDialog(false);
      await handleSubmit(currentFormData);
    }
  };

  // Check if we have valid form data before rendering
  if (!formDesigner?.components || !Array.isArray(formDesigner.components)) {
    return (
      <div className="p-4 bg-red-50 border border-red-300 rounded-md">
        <h3 className="text-red-700 font-semibold">{t("formLoadingError")}</h3>
        <p>{t("formLoadingError")}</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto w-full">
      <div className="bg-card rounded-lg shadow-sm border p-6 mb-6">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold">
            {formData.documentTypesBase || t("title")}
          </h2>
          <p className="text-muted-foreground mt-1">{t("description")}</p>
        </div>

        <ModularDynamicFormRenderer
          schema={formattedSchema}
          onSubmit={handleFormSubmit}
          language={locale === "ar" ? "Ar" : "En"}
          session={null}
        />

        <div className="mt-6 flex flex-col items-center gap-4">
          <Button
            onClick={() => {
              document
                .querySelector("form")
                ?.dispatchEvent(new Event("submit", { bubbles: true }));
            }}
            className="w-full sm:w-auto"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t("submitting")}
              </>
            ) : (
              t("submit")
            )}
          </Button>

          <p className="text-sm text-muted-foreground">
            {t("alreadyHaveAccount")}{" "}
            <Link
              href={`/${locale}/auth/login`}
              className={cn(
                buttonVariants({ variant: "link" }),
                "px-0 font-semibold"
              )}
            >
              {t("signIn")}
            </Link>
          </p>
        </div>
      </div>

      {/* Submit Confirmation Dialog */}
      <Dialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("confirmSubmitTitle")}</DialogTitle>
            <DialogDescription>{t("confirmSubmitMessage")}</DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 sm:justify-end">
            <Button
              variant="outline"
              onClick={() => setShowSubmitDialog(false)}
              disabled={isSubmitting}
            >
              {t("cancel")}
            </Button>
            <Button onClick={confirmSubmit} loading={isSubmitting}>
              {t("confirm")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
