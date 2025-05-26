"use client";
import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import { Formio } from "formiojs";
import { useSession } from "next-auth/react";

export default function ClientForm({ formDataObj }: { formDataObj: any }) {
  const [isFormBuilt, setIsFormBuilt] = useState(false);
  const locale = useLocale();
  const session = useSession();

  useEffect(() => {
    // Dynamically import formBuilder only on the client side
    const initializeForm = async () => {
      try {
        // Get the token

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
        setIsFormBuilt(true);
      } catch (error) {
        console.error("Error initializing form:", error);
      }
    };

    initializeForm();
  }, [formDataObj, locale]); // Added dependencies to the useEffect

  return (
    <div className="container mt-4">
      <div id="form-container" className="formio-container"></div>
    </div>
  );
}
