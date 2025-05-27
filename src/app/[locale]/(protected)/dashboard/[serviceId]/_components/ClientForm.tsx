"use client";
import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Formio } from "formiojs";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import apiClient from "@/lib/apiClient";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

export default function ClientForm({
  formDataObj,
  DocumentTypeId,
}: {
  formDataObj: any;
  DocumentTypeId: string;
}) {
  const [isFormBuilt, setIsFormBuilt] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dialog, setDialog] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState(false);
  const [errorDialog, setErrorDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmit, setIsSubmit] = useState(false);
  const [referenceNumber, setReferenceNumber] = useState("");
  const [showSuccessOverlay, setShowSuccessOverlay] = useState(false);
  const locale = useLocale();
  const session = useSession();
  const router = useRouter();
  const [formBuilder, setFormBuilder] = useState<any>(null);

  // Get translations
  const t = useTranslations("SingleServicePage");
  const formT = useTranslations("SingleServicePage.form");
  const commonT = useTranslations("FormPage.form");

  useEffect(() => {
    // Dynamically import formBuilder only on the client side
    const initializeForm = async () => {
      try {
        // Set up Formio fetch with authentication
        if (session?.data?.token) {
          Formio.fetch = (url: string, options: RequestInit = {}) => {
            // Ensure headers object exists
            if (!options.headers) {
              options.headers = {};
            }

            // Type assertion for headers
            const headers = options.headers as Record<string, string>;

            // Remove any existing authorization header
            delete headers["authorization"];

            // Add the Bearer token
            headers["Authorization"] = `Bearer ${session?.data?.token}`;

            // Return the fetch call
            return fetch(url, options);
          };
        }

        // Dynamic import of the formBuilder module
        const formBuilderModule = await import("@/lib/formio/FormBuilder");
        const formBuilder = formBuilderModule.default;

        // Set up the form
        formBuilder.FormDesignerTranslation =
          formDataObj.formDesignerTranslation;
        formBuilder.FormDesigner = formDataObj.formDesigner;
        formBuilder.IsFormReadonly = false;
        formBuilder.CurrentLanguage = locale;
        const formData = { formData: formDataObj.formData };

        // Build the form
        formBuilder.BuildForm("form-container", formData);
        setFormBuilder(formBuilder);
        setIsFormBuilt(true);
      } catch (error) {
        console.error("Error initializing form:", error);
      }
    };

    initializeForm();
  }, [formDataObj, locale, session?.data?.token]);

  const saveRequest = async () => {
    setLoading(true);
    try {
      const saveOptions: { params: Record<string, any> } = { params: {} };

      if (formBuilder && formBuilder.builder && formBuilder.builder.data) {
        let formData = { ...formBuilder.builder.data };

        Object.keys(formData).forEach((key) => {
          if (!isNaN(Number(key))) {
            delete formData[key];
          }
        });

        formBuilder.builder.data = formData;
        formBuilder.clearAttachmentsFromData(
          formBuilder.builder.data,
          saveOptions
        );
        formBuilder.fetchAttachmentsFromData(
          formBuilder.builder.data,
          saveOptions
        );

        saveOptions.params.DocumentTypeId = Number(DocumentTypeId);
        saveOptions.params.id = Number(DocumentTypeId);
        saveOptions.params.FormData = JSON.stringify(formBuilder.builder.data);
      }

      const model = new FormData();
      for (const key in saveOptions.params) {
        model.append(key, saveOptions.params[key]);
      }

      // Call API to save form
      const response = await apiClient.post("/request/save", model);

      if (response.data) {
        setIsSubmit(false);
        setDialog(true);
        // Show success message
        setShowSuccessOverlay(true);
        setTimeout(() => {
          setShowSuccessOverlay(false);
        }, 3000);
      }
    } catch (error) {
      console.error("Error saving form:", error);
      setErrorMessage(t("errors.networkError"));
      setErrorDialog(true);
    } finally {
      setLoading(false);
    }
  };

  const submitRequest = async () => {
    setConfirmDialog(false);
    setLoading(true);
    try {
      const saveOptions: { params: Record<string, any> } = { params: {} };

      if (formBuilder && formBuilder.builder && formBuilder.builder.data) {
        let formData = { ...formBuilder.builder.data };

        Object.keys(formData).forEach((key) => {
          if (!isNaN(Number(key))) {
            delete formData[key];
          }
        });

        formBuilder.builder.data = formData;
        formBuilder.clearAttachmentsFromData(
          formBuilder.builder.data,
          saveOptions
        );
        formBuilder.fetchAttachmentsFromData(
          formBuilder.builder.data,
          saveOptions
        );

        saveOptions.params.DocumentTypeId = Number(DocumentTypeId);
        saveOptions.params.id = Number(DocumentTypeId);
        saveOptions.params.FormData = JSON.stringify(formBuilder.builder.data);
      }

      const model = new FormData();
      for (const key in saveOptions.params) {
        model.append(key, saveOptions.params[key]);
      }

      // Call API to submit form
      const response = await apiClient.post("/request/save-send", model);

      if (response.data && response.data.success) {
        setReferenceNumber(response.data.data);
        setIsSubmit(true);
        setDialog(true);
        // Show success message
        setShowSuccessOverlay(true);
        setTimeout(() => {
          setShowSuccessOverlay(false);
        }, 3000);
      } else {
        setErrorMessage(response.data.message || t("errors.unknown"));
        setErrorDialog(true);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setErrorMessage(t("errors.networkError"));
      setErrorDialog(true);
    } finally {
      setLoading(false);
    }
  };

  const openConfirmDialog = () => {
    setConfirmDialog(true);
  };

  const closeDialog = () => {
    setDialog(false);
    // Redirect to dashboard using Next.js router
    router.push(`/${locale}/dashboard`);
  };

  return (
    <div className="container">
      <div className="container mt-4">
        <div id="form-container" className="formio-container"></div>
      </div>

      {isFormBuilt && (
        <div className="flex items-center gap-2 justify-end mb-8">
          <Button variant="outline" disabled={loading} onClick={saveRequest}>
            {commonT("save")}
          </Button>
          <Button
            className="apply-request"
            disabled={loading}
            onClick={openConfirmDialog}
          >
            {commonT("submit")}
          </Button>
        </div>
      )}

      {/* Success Dialog */}
      <Dialog open={dialog} onOpenChange={setDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{formT("submitted")}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            {isSubmit ? (
              <div className="space-y-4">
                <p className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  {formT("successMessage")}
                </p>
                <p className="font-medium">
                  {formT("referenceNumber")}:{" "}
                  <span className="text-primary">{referenceNumber}</span>
                </p>
              </div>
            ) : (
              <p className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                {t("draftSaved")}
              </p>
            )}
          </div>
          <DialogFooter>
            <Button onClick={closeDialog}>{formT("viewRequests")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog open={confirmDialog} onOpenChange={setConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("confirmSubmitTitle")}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>{t("confirmSubmitMessage")}</p>
          </div>
          <DialogFooter className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setConfirmDialog(false)}>
              {t("cancel")}
            </Button>
            <Button onClick={submitRequest}>{t("confirm")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Error Dialog */}
      <Dialog open={errorDialog} onOpenChange={setErrorDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Error</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-red-500">{errorMessage}</p>
          </div>
          <DialogFooter>
            <Button onClick={() => setErrorDialog(false)}>{t("cancel")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Animated Success Overlay */}
      <AnimatePresence>
        {showSuccessOverlay && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
              }}
              className="bg-white dark:bg-slate-900 p-8 rounded-xl shadow-2xl flex flex-col items-center max-w-md w-full"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.2, 1] }}
                transition={{
                  delay: 0.2,
                  times: [0, 0.6, 1],
                  duration: 0.6,
                }}
                className="text-green-500 mb-4"
              >
                <CheckCircle2 size={80} strokeWidth={1.5} />
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-2xl font-bold mb-2 text-center"
              >
                {isSubmit ? formT("submitted") : t("draftSaved")}
              </motion.h2>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-center text-gray-600 dark:text-gray-300 mb-4"
              >
                {isSubmit ? formT("successMessage") : t("draftSaved")}
              </motion.p>

              {isSubmit && referenceNumber && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="bg-gray-100 dark:bg-slate-800 p-3 rounded-lg w-full text-center mb-4"
                >
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {formT("referenceNumber")}
                  </p>
                  <p className="text-lg font-mono font-medium">
                    {referenceNumber}
                  </p>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
