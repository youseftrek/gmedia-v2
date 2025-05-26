"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import ModularDynamicFormRenderer from "@/components/form-io/ModularDynamicFormRenderer";
import { testFormSchema } from "@/data/test-form-schema";
import { useLocale } from "next-intl";
import React, { useEffect, useState } from "react";

const ClientForm = ({
  schema,
  session,
  mode = "edit",
}: {
  schema: any;
  session: any;
  mode: "view" | "edit";
}) => {
  const [useTestSchema, setUseTestSchema] = useState(false);
  // Enhanced debugging
  useEffect(() => {
    console.log("Debug - Original schema:", schema);
    if (typeof schema?.formDesigner === "string") {
      try {
        const parsed = JSON.parse(schema.formDesigner);
        console.log("Debug - Parsed formDesigner:", parsed);
        console.log("Debug - Has components:", !!parsed?.components);
        console.log("Debug - Components length:", parsed?.components?.length);
      } catch (e) {
        console.error("Debug - Error parsing formDesigner:", e);
        setUseTestSchema(true);
      }
    } else {
      console.log("Debug - formDesigner object:", schema?.formDesigner);
      console.log(
        "Debug - Has components:",
        !!schema?.formDesigner?.components
      );
      console.log(
        "Debug - Components length:",
        schema?.formDesigner?.components?.length
      );

      // Check if the schema is empty or invalid
      if (
        !schema?.formDesigner?.components ||
        schema?.formDesigner?.components.length === 0
      ) {
        setUseTestSchema(true);
      }
    }
  }, [schema]);

  // Parse the formDesigner if it's a string
  const formDesigner = useTestSchema
    ? testFormSchema.formDesigner
    : typeof schema?.formDesigner === "string"
    ? JSON.parse(schema.formDesigner)
    : schema?.formDesigner;

  // Parse the translations if available
  const translations = useTestSchema
    ? testFormSchema.translations
    : schema?.formDesignerTranslation
    ? typeof schema.formDesignerTranslation === "string"
      ? JSON.parse(schema.formDesignerTranslation)
      : schema.formDesignerTranslation
    : schema?.translations;

  // Create the properly formatted schema
  const formattedSchema = {
    formDesigner,
    translations,
    formData: schema?.formData || {},
  };
  const locale = useLocale();
  return (
    <div>
      <ModularDynamicFormRenderer
        mode={mode}
        session={session}
        schema={formattedSchema}
        onSubmit={() => {}}
        language={locale === "ar" ? "Ar" : "En"}
      />
    </div>
  );
};

export default ClientForm;
