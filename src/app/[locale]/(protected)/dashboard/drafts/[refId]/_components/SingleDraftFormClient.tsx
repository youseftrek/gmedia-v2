/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
// app/drafts/[refId]/client.tsx

import { useEffect, useState } from "react";
import { CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Save, Send } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import ModularDynamicFormRenderer from "@/components/form-io/ModularDynamicFormRenderer";
import { useRouter } from "@/i18n/routing";
import { AnimatedMultiStepper } from "@/components/MultiStep";
import { useLocale, useTranslations } from "next-intl";
import axios from "axios";
import { toast } from "sonner";
import { BackButton } from "@/components/shared/BackButton";

// Add Common utility helper
const Common = {
  objectToFormData(formData: FormData, obj: any, namespace = "") {
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const formKey = namespace ? `${namespace}[${key}]` : key;

        if (obj[key] instanceof File) {
          formData.append(formKey, obj[key]);
        } else if (
          Array.isArray(obj[key]) &&
          obj[key].length > 0 &&
          obj[key][0] instanceof File
        ) {
          // Handle file arrays
          for (let i = 0; i < obj[key].length; i++) {
            formData.append(`${formKey}[${i}]`, obj[key][i]);
          }
        } else if (typeof obj[key] === "object" && obj[key] !== null) {
          this.objectToFormData(formData, obj[key], formKey);
        } else {
          formData.append(formKey, obj[key]);
        }
      }
    }
    return formData;
  },
};

export function SingleDraftFormClient({
  refId,
  formData,
  session,
}: {
  refId: string;
  formData: any;
  session: any;
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [formValues, setFormValues] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const locale = useLocale();
  const t = useTranslations("SingleServicePage");
  const [statusBadgeColor, setStatusBadgeColor] = useState<
    "default" | "secondary" | "destructive" | "outline"
  >("default");

  // Create localized steps array
  const localizedSteps = [
    { title: t("steps.step1") },
    { title: t("steps.step2") },
    { title: t("steps.step3") },
    { title: t("steps.step4") },
  ];

  // Add rejected step with destructive styling if status is Rejected
  const [showRejectedStep, setShowRejectedStep] = useState(false);
  const stepsWithRejection = showRejectedStep
    ? [
        ...localizedSteps.slice(0, 3),
        { title: t("steps.rejected"), color: "text-red-500" },
      ]
    : localizedSteps;

  useEffect(() => {
    // Parse formData if it exists and has the right format
    if (
      formData &&
      formData.success &&
      formData.data &&
      formData.data.formData
    ) {
      try {
        // Parse the formData string to JSON if it's a string
        const parsedData =
          typeof formData.data.formData === "string"
            ? JSON.parse(formData.data.formData)
            : formData.data.formData;

        setFormValues(parsedData);
      } catch (err) {
        console.error("Error parsing form data:", err);
        setError("Invalid form data format");
      }
    } else {
      setError("Could not load form data");
    }
  }, [formData]);

  // Handle form submission
  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    setError(null);

    try {
      // Filter out numeric keys from the data
      const filteredData = Object.fromEntries(
        Object.entries(data).filter(([key]) => isNaN(Number(key)))
      );

      // Create a new FormData object
      const formData = new FormData();

      // Use Common.objectToFormData
      Common.objectToFormData(formData, {
        DocumentTypeId: refId,
        FormData: JSON.stringify(filteredData),
      });

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/request/save-send`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${session.accessToken || session.token}`,
          },
        }
      );

      toast.success(t("formSubmitted"));

      // Redirect to my-requests page
      router.push("/dashboard/my-requests");

      return response.data;
    } catch (error) {
      const errorMessage = axios.isAxiosError(error)
        ? error.response?.data?.message || error.message
        : error instanceof Error
        ? error.message
        : "Unknown error";

      toast.error(`${t("submitError")}: ${errorMessage}`);
      console.error("Submit form error:", error);
      setError(`An error occurred while submitting the form: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle manual submission via button
  const handleManualSubmit = () => {
    // Trigger form submission programmatically
    const formElement = document.querySelector("form");
    if (formElement) {
      formElement.dispatchEvent(new Event("submit", { bubbles: true }));
    }
  };

  // Handle draft saving
  const handleSaveDraft = async (data: any) => {
    setIsSaving(true);
    try {
      // Filter out numeric keys from the data
      const filteredData = Object.fromEntries(
        Object.entries(data).filter(([key]) => isNaN(Number(key)))
      );

      // Create a new FormData object
      const formData = new FormData();

      // Use Common.objectToFormData
      Common.objectToFormData(formData, {
        DocumentTypeId: refId,
        FormData: JSON.stringify(filteredData),
      });

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/request/save`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${session.accessToken || session.token}`,
          },
        }
      );

      toast.success(t("draftSaved"));
      return response.data;
    } catch (error) {
      const errorMessage = axios.isAxiosError(error)
        ? error.response?.data?.message || error.message
        : error instanceof Error
        ? error.message
        : "Unknown error";

      toast.error(`${t("draftSaveError")}: ${errorMessage}`);
      console.error("Save draft error:", error);
    } finally {
      setIsSaving(false);
    }
  };

  // Manual draft saving
  const handleManualSaveDraft = () => {
    // Get the current form values
    const formElement = document.querySelector("form");
    if (formElement) {
      // Create a custom event to trigger the save draft function
      const saveDraftEvent = new CustomEvent("formio.saveDraft", {
        detail: {
          handler: handleSaveDraft,
        },
        bubbles: true,
      });
      formElement.dispatchEvent(saveDraftEvent);
    }
  };

  if (error) {
    return (
      <div className="mx-auto py-8 container">
        <BackButton />
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!formValues || !formData?.data?.formDesigner) {
    return (
      <div className="flex justify-center items-center mx-auto py-8 h-64 container">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
        <span className="ml-2">Loading form data...</span>
      </div>
    );
  }

  // Parse form designer if it's a string
  const formDesigner =
    typeof formData.data.formDesigner === "string"
      ? JSON.parse(formData.data.formDesigner)
      : formData.data.formDesigner;

  // Parse form translations if they exist
  const formTranslations = formData.data.formDesignerTranslation
    ? typeof formData.data.formDesignerTranslation === "string"
      ? JSON.parse(formData.data.formDesignerTranslation)
      : formData.data.formDesignerTranslation
    : [];

  return (
    <div className="mx-auto max-w-5xl">
      <AnimatedMultiStepper steps={stepsWithRejection} currentActiveStep={0}>
        <div className="mx-auto container">
          <div className="flex justify-between items-center">
            <h2 className="flex items-center gap-2 font-semibold text-xl md:text-2xl">
              <BackButton size="icon" />
              {t("draft")}
              {refId}
            </h2>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleManualSaveDraft}
                disabled={isSubmitting || isSaving}
              >
                <Save />
                {t("form.saveDraft")}
              </Button>
              <Button
                variant="default"
                onClick={handleManualSubmit}
                disabled={isSubmitting || isSaving}
              >
                <Send />
                {t("form.submit")}
              </Button>
            </div>
          </div>

          {formValues.PaymentStatus && (
            <Badge variant={statusBadgeColor}>{formValues.PaymentStatus}</Badge>
          )}

          <CardContent className="p-0">
            {formDesigner && (
              <ModularDynamicFormRenderer
                schema={{
                  formDesigner: formDesigner,
                  translations: formTranslations,
                  formData: formValues,
                }}
                onSubmit={handleSubmit}
                onSaveDraft={handleSaveDraft}
                language={locale === "ar" ? "Ar" : "En"}
                session={session}
              />
            )}
          </CardContent>
          <div className="flex gap-2 items-center justify-end p-2">
            <Button
              variant="outline"
              onClick={handleManualSaveDraft}
              disabled={isSubmitting || isSaving}
            >
              <Save />
              {t("form.saveDraft")}
            </Button>
            <Button
              variant="default"
              onClick={handleManualSubmit}
              disabled={isSubmitting || isSaving}
            >
              <Send />
              {t("form.submit")}
            </Button>
          </div>
        </div>
      </AnimatedMultiStepper>
    </div>
  );
}
