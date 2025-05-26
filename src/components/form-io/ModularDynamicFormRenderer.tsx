/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useForm, FormProvider as RHFormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  DynamicTextField,
  DynamicTextArea,
  DynamicCheckbox,
  DynamicDatetime,
  DynamicFile,
  DynamicMultiSelect,
  DynamicSelect,
  DynamicHtmlElement,
  DynamicDataGrid,
  DynamicColumns,
  DynamicTabs,
  DynamicPanel,
  DynamicEmail,
  DynamicNumber,
  DynamicPhoneNumber,
  PhoneNumberAssets,
} from "./components";
import { Session } from "next-auth";
import Script from "next/script";
import { toast } from "sonner";
import { FormProvider as CustomFormProvider } from "./context/FormContext";
import {
  buildZodSchema,
  validateSelectOptions,
} from "@/lib/validations/form-validations";
import { useTranslations } from "next-intl";

interface FormSchema {
  formDesigner: {
    components: any[];
    display: string;
  };
  translations?: Array<{
    Keyword: string;
    En: string;
    Ar: string;
    Fr: string;
    Type?: string;
  }>;
  formData?: Record<string, any>;
}

interface DynamicFormProps {
  schema: FormSchema;
  onSubmit: (data: any) => void;
  onSaveDraft?: (data: any) => void;
  onFormChange?: (values: any) => void;
  language?: "En" | "Ar" | "Fr";
  session: Session | any;
  mode?: "edit" | "view";
}

interface DynamicSelectOptions {
  [key: string]: Array<{
    label: string;
    value: string | number;
    [key: string]: any;
  }>;
}

interface LogicTrigger {
  name?: string;
  trigger: {
    type: string;
    javascript: string;
  };
  actions?: any[];
}

// Add this helper function at the top level
const processFormData = (data: any) => {
  const processedData: Record<string, any> = {};

  // Helper function to process nested objects
  const processObject = (obj: any, prefix = "") => {
    Object.entries(obj).forEach(([key, value]) => {
      // Check if this is a nested object key (contains a dot)
      if (key.includes(".")) {
        const [parentKey, childKey] = key.split(".");

        // Initialize the parent object if it doesn't exist
        if (!processedData[parentKey]) {
          processedData[parentKey] = {};
        }

        // Set the child value
        processedData[parentKey][childKey] = value;
      } else {
        // Handle arrays
        if (Array.isArray(value)) {
          processedData[key] = value;
        }
        // Handle objects (but not null)
        else if (value && typeof value === "object") {
          processedData[key] = value;
        }
        // Handle primitive values
        else {
          processedData[key] = value;
        }
      }
    });
  };

  processObject(data);
  return processedData;
};

const ModularDynamicFormRenderer = ({
  schema,
  onSubmit,
  onSaveDraft,
  onFormChange,
  language = "Ar",
  session,
  mode = "edit",
}: DynamicFormProps) => {
  const [formSchema, setFormSchema] = useState<z.ZodObject<any>>();
  const [activeTab, setActiveTab] = useState<string>("");
  const [hiddenFields, setHiddenFields] = useState<Record<string, any>>({});
  const [logicTriggers, setLogicTriggers] = useState<
    Record<string, LogicTrigger[]>
  >({});
  const [dynamicSelectOptions, setDynamicSelectOptions] =
    useState<DynamicSelectOptions>({});
  const [isLoading, setIsLoading] = useState<Record<string, boolean>>({});
  const [fileUploads, setFileUploads] = useState<Record<string, File[]>>({});
  // Track loaded components to prevent duplicate fetches and infinite loops
  const loadedComponentsRef = useRef<Set<string>>(new Set());

  // Add translation hooks
  const t = useTranslations("DynamicComponents");
  const formT = useTranslations("SingleServicePage.form");
  const commonT = useTranslations("common");

  // The token provided by the user (supports both session structures)
  const authToken = session?.token || session?.accessToken;

  const form = useForm({
    resolver: formSchema ? zodResolver(formSchema) : undefined,
    defaultValues: schema.formData || {},
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    getValues,
  } = form;

  // Watch all form values for conditional rendering
  const formValues = watch();
  const formRef = useRef<HTMLFormElement>(null);

  // Extract and set hidden fields with their default values
  useEffect(() => {
    if (!schema.formDesigner?.components) return;

    const extractHiddenFields = (components: any[]) => {
      const fields: Record<string, any> = {};

      const processComponent = (component: any) => {
        if (component.key && component.hidden === true) {
          fields[component.key] =
            component.defaultValue !== undefined
              ? component.defaultValue
              : null;
          // Set the value in the form
          setValue(
            component.key,
            component.defaultValue !== undefined ? component.defaultValue : null
          );
        }
      };

      const traverseComponents = (components: any[]) => {
        components.forEach((component) => {
          if (component.type === "columns" && component.columns) {
            component.columns.forEach((column: any) => {
              if (column.components) {
                traverseComponents(column.components);
              }
            });
          } else if (component.type === "panel" && component.components) {
            traverseComponents(component.components);
          } else if (component.type === "tabs" && component.components) {
            component.components.forEach((tab: any) => {
              if (tab.components) {
                traverseComponents(tab.components);
              }
            });
          } else {
            processComponent(component);
          }
        });
      };

      traverseComponents(components);
      return fields;
    };

    const hiddenFieldsData = extractHiddenFields(
      schema.formDesigner.components
    );
    setHiddenFields(hiddenFieldsData);
  }, [schema, setValue]);

  // Parse dynamic URL with template variables
  const parseUrl = useCallback(
    (url: string) => {
      if (!url) return url;

      // First replace patterns like {{data.fieldName}} with actual values (Formio style)
      let parsedUrl = url.replace(/\{\{data\.([^}]+)\}\}/g, (match, field) => {
        const value = formValues[field];
        return value !== undefined ? String(value) : "";
      });

      // Then replace patterns like ${variableName} (JavaScript template literal style)
      // This is a simplified version and doesn't evaluate arbitrary JavaScript expressions
      parsedUrl = parsedUrl.replace(/\$\{([^}]+)\}/g, (match, expression) => {
        // Simple variable name extraction - for complex expressions would need proper parsing
        const variableName = expression.trim();

        // Try to find the value in formValues first
        if (formValues[variableName] !== undefined) {
          return String(formValues[variableName]);
        }

        // Keep original if we can't resolve it
        return match;
      });

      return parsedUrl;
    },
    [formValues]
  );

  // Find and return all components with dataSrc="url"
  const findDynamicDataComponents = useCallback((components: any[]) => {
    const dynamicComponents: any[] = [];

    const processComponent = (component: any) => {
      if (
        component.type === "select" &&
        component.dataSrc === "url" &&
        component.data?.url
      ) {
        dynamicComponents.push(component);
      }
    };

    const traverseComponents = (components: any[]) => {
      components.forEach((component) => {
        if (component.type === "columns" && component.columns) {
          component.columns.forEach((column: any) => {
            if (column.components) {
              traverseComponents(column.components);
            }
          });
        } else if (component.type === "panel" && component.components) {
          traverseComponents(component.components);
        } else if (component.type === "tabs" && component.components) {
          component.components.forEach((tab: any) => {
            if (tab.components) {
              traverseComponents(tab.components);
            }
          });
        } else {
          processComponent(component);
        }
      });
    };

    traverseComponents(components);
    return dynamicComponents;
  }, []);

  // Find a component by key in the schema
  const findComponentByKey = useCallback(
    (key: string) => {
      const findInComponents = (components: any[]): any => {
        for (const component of components) {
          if (component.key === key) {
            return component;
          }

          if (component.type === "columns" && component.columns) {
            for (const column of component.columns) {
              if (column.components) {
                const found = findInComponents(column.components);
                if (found) return found;
              }
            }
          } else if (component.type === "panel" && component.components) {
            const found = findInComponents(component.components);
            if (found) return found;
          } else if (component.type === "tabs" && component.components) {
            for (const tab of component.components) {
              if (tab.components) {
                const found = findInComponents(tab.components);
                if (found) return found;
              }
            }
          }
        }
        return null;
      };

      if (!schema.formDesigner?.components) return null;
      return findInComponents(schema.formDesigner.components);
    },
    [schema.formDesigner?.components]
  );

  // Function to extract related URLs from schema components to avoid hardcoding
  const getRelatedDataUrl = useCallback(
    (
      componentKey: string,
      action: string,
      params: Record<string, any> = {}
    ) => {
      // First try to find the URL in the component's own configuration
      const component = findComponentByKey(componentKey);

      if (!component) return null;

      // Check if there's a direct URL in the component's logic
      if (component.logic && Array.isArray(component.logic)) {
        // First try to find a URL in the component's logic triggers
        for (const logic of component.logic) {
          if (
            logic.trigger?.type === "javascript" &&
            logic.trigger?.javascript
          ) {
            // Extract URLs from JavaScript logic using regex
            // Look for patterns like: `https://...`, Formio.fetch(`https://...`), fetch(`https://...`)
            const urlMatches = logic.trigger.javascript.match(
              /(?:Formio\.fetch|fetch)\(`([^`]+)`/
            );
            if (urlMatches && urlMatches[1]) {
              // Found a URL in the logic - now replace any template variables
              let url = urlMatches[1];

              // Replace any parameters in the URL
              Object.entries(params).forEach(([key, value]) => {
                // Replace both ${key} and :key formats
                url = url
                  .replace(`\${${key}}`, String(value))
                  .replace(`:${key}`, String(value));
              });

              return url;
            }
          }
        }
      }

      // Special case handling based on common patterns in the schema
      if (action === "details" || action === "info") {
        // Check for custom properties containing endpoint information
        const relatedDataUrls =
          component.relatedDataUrls || component.customEndpoints || {};

        if (relatedDataUrls && relatedDataUrls[action]) {
          let url = relatedDataUrls[action];

          // Replace any parameters in the URL
          Object.entries(params).forEach(([key, value]) => {
            url = url
              .replace(`{${key}}`, String(value))
              .replace(`:${key}`, String(value));
          });

          return url;
        }

        // If component is a select with a URL, we can try to derive a details URL
        if (component.dataSrc === "url" && component.data?.url) {
          const baseUrl = component.data.url.split("?")[0];

          // Common patterns for detail URLs
          const detailsPatterns = [
            // 1. Base URL + /info with ID segment for Saudi classification pattern
            ...(componentKey.includes("Classification")
              ? [`${baseUrl}/${params.id || ""}/Info`]
              : []),
            // 2. Base URL with ID segment and info (preferred for most APIs)
            `${baseUrl}/${params.id || ""}/info`,
            // 3. Base URL with ID segment
            `${baseUrl}/${params.id || ""}/details`,
            // 4. Base URL + /details with ID param (least preferred fallback)
            `${baseUrl}/details?id=${params.id || ""}`,
          ];

          // Try the most relevant pattern based on component type
          return detailsPatterns[0];
        }
      }

      // For dropdown relationships (like areas->cities->districts)
      if (action === "children" && params.child) {
        const childComponent = findComponentByKey(params.child);

        if (
          childComponent &&
          childComponent.dataSrc === "url" &&
          childComponent.data?.url
        ) {
          let url = childComponent.data.url;

          // Replace the template variables with actual values
          Object.entries(params).forEach(([key, value]) => {
            if (key !== "child") {
              url = url.replace(`{{data.${key}}}`, value as string);
            }
          });

          return url;
        }
      }

      return null;
    },
    [findComponentByKey]
  );

  // Function to fetch data from a URL with proper headers
  const fetchDataWithAuth = useCallback(
    async (url: string, componentKey?: string) => {
      // Add logging for debugging URL issues
      console.log(
        `Fetching data for component ${
          componentKey || "unknown"
        } from URL: ${url}`
      );

      // Don't try to fetch invalid URLs
      if (!url || url.includes("undefined") || url.includes("${")) {
        console.error(`Invalid URL detected: ${url}`);
        throw new Error(commonT("errors.invalidUrl"));
      }

      // Find the component to get custom headers if provided
      const component = componentKey ? findComponentByKey(componentKey) : null;

      // Prepare headers
      const headers: Record<string, string> = {};
      if (authToken) {
        headers["Authorization"] = `Bearer ${authToken}`;
      }

      // Add any custom headers from the component
      if (component?.data?.headers && Array.isArray(component.data.headers)) {
        component.data.headers.forEach((header: any) => {
          if (header.key && typeof header.key === "string") {
            if (header.key === "Authorization") {
              headers[header.key] = `Bearer ${authToken}`;
            } else {
              headers[header.key] = header.value || "";
            }
          }
        });
      }

      // Make the request
      try {
        const response = await fetch(url, {
          method: "GET",
          headers,
        });

        if (!response.ok) {
          console.error(
            `API request failed: ${response.statusText} for URL: ${url}`
          );
          throw new Error(commonT("errors.apiRequestFailed"));
        }

        const data = await response.json();
        console.log(
          `Successfully fetched data for ${componentKey || "unknown"}`
        );
        return data;
      } catch (error) {
        console.error(`Fetch error for ${url}:`, error);
        throw error;
      }
    },
    [authToken, findComponentByKey, commonT]
  );

  // Helper function to find all form components recursively
  const findAllFormComponents = useCallback((components: any[]): any[] => {
    let allComponents: any[] = [];

    const traverseComponents = (components: any[]) => {
      components.forEach((component) => {
        if (component.type === "columns" && component.columns) {
          component.columns.forEach((column: any) => {
            if (column.components) {
              traverseComponents(column.components);
            }
          });
        } else if (component.type === "panel" && component.components) {
          traverseComponents(component.components);
        } else if (component.type === "tabs" && component.components) {
          component.components.forEach((tab: any) => {
            if (tab.components) {
              traverseComponents(tab.components);
            }
          });
        } else {
          // Add this component to our list of all components
          allComponents.push(component);
        }
      });
    };

    traverseComponents(components);
    return allComponents;
  }, []);

  // Handle logic triggers when a field value changes
  const handleLogicTrigger = useCallback(
    async (componentKey: string, value: any) => {
      const triggers = logicTriggers[componentKey];
      if (!triggers || triggers.length === 0) return;

      for (const trigger of triggers) {
        if (trigger.trigger.type === "javascript") {
          try {
            // Create a safe execution context for the JavaScript logic
            const instance = {
              getValue: () => value,
              root: {
                getComponent: (key: string) => ({
                  setValue: (val: any) => {
                    setValue(key, val);
                  },
                  component: {
                    data: {
                      values: [],
                    },
                  },
                  items: [],
                  redraw: () => {
                    // This would be handled by React's state updates
                  },
                }),
              },
            };

            // Extract API URL from trigger JavaScript if available
            let apiUrl = null;
            let urlParams = {};

            // Try to extract URL from JS trigger
            if (trigger.trigger.javascript) {
              const urlMatch = trigger.trigger.javascript.match(
                /Formio\.fetch\(`([^`]+)`/
              );
              if (urlMatch && urlMatch[1]) {
                apiUrl = urlMatch[1];

                // Replace any placeholders in the URL
                if (typeof value === "object" && value?.id) {
                  apiUrl = apiUrl.replace(/\${selectedId}/g, value.id);
                } else if (value) {
                  apiUrl = apiUrl.replace(/\${selectedId}/g, value);
                }
              }
            }

            // If we have an API URL, fetch the data
            if (apiUrl) {
              const toastId = toast.loading(
                t("select.loading", { field: componentKey })
              );

              try {
                const data = await fetchDataWithAuth(apiUrl, componentKey);

                // Auto determine which fields to populate based on the response data
                if (data) {
                  // Find all form components to potentially receive data
                  const allComponents = findAllFormComponents(
                    schema.formDesigner?.components || []
                  );

                  // Log the data in development
                  if (process.env.NODE_ENV === "development") {
                    console.log(
                      `Classification info data for ${componentKey}:`,
                      data
                    );
                  }

                  // Process all data fields dynamically, using same approach as above
                  Object.entries(data).forEach(([dataKey, dataValue]) => {
                    // Skip null/undefined values and functions
                    if (
                      dataValue === null ||
                      dataValue === undefined ||
                      typeof dataValue === "function"
                    )
                      return;

                    // Handle arrays (like console/platforms lists) separately
                    if (Array.isArray(dataValue)) {
                      // Process arrays like 'console' later
                      return;
                    }

                    // Skip deep nested objects
                    if (
                      typeof dataValue === "object" &&
                      dataValue !== null &&
                      !Array.isArray(dataValue)
                    )
                      return;

                    // Try direct match first (exact field key match)
                    const directMatch = allComponents.find(
                      (comp) => comp.key === dataKey
                    );

                    if (directMatch) {
                      setValue(directMatch.key, dataValue);
                      if (process.env.NODE_ENV === "development") {
                        console.log(`Set ${directMatch.key} to ${dataValue}`);
                      }
                      return; // Continue to next field
                    }

                    // Try language-specific matches
                    let possibleMatches = [];

                    // Handle fields ending with Ar, En, Fr
                    if (dataKey.endsWith("Ar")) {
                      const baseKey = dataKey.slice(0, -2).toLowerCase();
                      possibleMatches = allComponents.filter(
                        (comp) =>
                          comp.key.toLowerCase().includes(baseKey) &&
                          (comp.key.includes("Arabic") ||
                            comp.key.includes("InArabic") ||
                            comp.key.includes("Ar"))
                      );
                    } else if (dataKey.endsWith("En")) {
                      const baseKey = dataKey.slice(0, -2).toLowerCase();
                      possibleMatches = allComponents.filter(
                        (comp) =>
                          comp.key.toLowerCase().includes(baseKey) &&
                          (comp.key.includes("English") ||
                            comp.key.includes("InEnglish") ||
                            comp.key.includes("En"))
                      );
                    }
                    // Try semantic matches for common fields
                    else if (dataKey.toLowerCase().includes("name")) {
                      possibleMatches = allComponents.filter(
                        (comp) =>
                          comp.key.toLowerCase().includes("name") &&
                          !comp.key.toLowerCase().includes("ar") &&
                          !comp.key.toLowerCase().includes("arabic") &&
                          !comp.key.toLowerCase().includes("en") &&
                          !comp.key.toLowerCase().includes("english")
                      );
                    } else if (dataKey.toLowerCase().includes("description")) {
                      possibleMatches = allComponents.filter(
                        (comp) =>
                          comp.key.toLowerCase().includes("description") &&
                          !comp.key.toLowerCase().includes("ar") &&
                          !comp.key.toLowerCase().includes("arabic") &&
                          !comp.key.toLowerCase().includes("en") &&
                          !comp.key.toLowerCase().includes("english")
                      );
                    } else if (dataKey.toLowerCase().includes("publisher")) {
                      possibleMatches = allComponents.filter(
                        (comp) =>
                          comp.key.toLowerCase().includes("publisher") &&
                          !comp.key.toLowerCase().includes("ar") &&
                          !comp.key.toLowerCase().includes("arabic") &&
                          !comp.key.toLowerCase().includes("en") &&
                          !comp.key.toLowerCase().includes("english")
                      );
                    }
                    // General partial match
                    else {
                      const dataKeyNormalized = dataKey.toLowerCase();
                      possibleMatches = allComponents.filter((comp) => {
                        const compKeyNormalized = comp.key.toLowerCase();
                        return (
                          compKeyNormalized.includes(dataKeyNormalized) ||
                          dataKeyNormalized.includes(compKeyNormalized)
                        );
                      });
                    }

                    // Apply the first potential match if found
                    if (possibleMatches.length > 0) {
                      // Sort by relevance (shortest key that contains the data key)
                      possibleMatches.sort(
                        (a, b) => a.key.length - b.key.length
                      );
                      setValue(possibleMatches[0].key, dataValue);
                      if (process.env.NODE_ENV === "development") {
                        console.log(
                          `Set ${possibleMatches[0].key} to ${dataValue}`
                        );
                      }
                    }
                  });

                  // Handle special cases like lists or arrays
                  if (data.console && Array.isArray(data.console)) {
                    // Find components that can accept platform/console data
                    const platformComponents = allComponents.filter(
                      (comp) =>
                        comp.type === "select" &&
                        comp.multiple &&
                        (comp.key.toLowerCase().includes("platform") ||
                          comp.key.toLowerCase().includes("console") ||
                          comp.key.toLowerCase().includes("device"))
                    );

                    if (platformComponents.length > 0) {
                      // Process the console array data
                      const platformOptions = data.console.map((item: any) => ({
                        value:
                          typeof item === "object"
                            ? item.text || item.value || item.id || item
                            : item,
                        label:
                          typeof item === "object"
                            ? item.text || item.label || item.name || item
                            : item,
                      }));

                      // Update all matching fields
                      platformComponents.forEach((comp) => {
                        setDynamicSelectOptions((prev) => ({
                          ...prev,
                          [comp.key]: platformOptions,
                        }));
                      });
                    }
                  }

                  toast.success(
                    `${componentKey} information loaded successfully`,
                    {
                      id: toastId,
                    }
                  );
                } else {
                  toast.error(`No data received for ${componentKey}`, {
                    id: toastId,
                  });
                }
              } catch (error) {
                console.error(`Error fetching ${componentKey} info:`, error);
                toast.error(
                  `Error loading information: ${
                    error instanceof Error ? error.message : "Unknown error"
                  }`,
                  { id: toastId }
                );
              }
            }

            // Handle specific logic for dependent selects
            // For commercial records -> subActivity relationship
            if (componentKey === "commercialRecords" && value) {
              const crNationalNumber =
                typeof value === "object" ? value.crNationalNumber : value;

              // Find subActivity component to get its URL pattern
              const subActivityComponent = findComponentByKey("subActivity");

              if (
                subActivityComponent &&
                subActivityComponent.dataSrc === "url" &&
                subActivityComponent.data?.url
              ) {
                // Use the URL from the component schema, replacing any template variables
                let url = subActivityComponent.data.url;

                // Replace {{data.commercialRecords}} with the actual value
                url = url.replace(
                  /\{\{data\.commercialRecords\}\}/g,
                  crNationalNumber
                );

                try {
                  setIsLoading((prev) => ({ ...prev, subActivity: true }));

                  const data = await fetchDataWithAuth(url, "subActivity");

                  // Determine data source path based on component configuration
                  let subActivitiesData = data;
                  if (subActivityComponent.selectValues) {
                    subActivitiesData =
                      data[subActivityComponent.selectValues] || data;
                  } else {
                    subActivitiesData = data.subActivities || data.data || data;
                  }

                  if (Array.isArray(subActivitiesData)) {
                    // Extract label/value fields from component template
                    const labelField = subActivityComponent.template
                      ? subActivityComponent.template.match(
                          /\{\{\s*item\.([^}]+)\s*\}\}/
                        )?.[1] || "activityDescription"
                      : "activityDescription";

                    const valueField =
                      subActivityComponent.valueProperty ||
                      "activityID" ||
                      "id";

                    const options = subActivitiesData.map((item: any) => ({
                      label:
                        item[labelField] ||
                        item.activityDescription ||
                        item.text ||
                        "Unknown",
                      value:
                        item[valueField] || item.activityID || item.id || "",
                      activityId: item.activityID || item.id,
                      ...item,
                    }));

                    setDynamicSelectOptions((prev) => ({
                      ...prev,
                      subActivity: options,
                    }));

                    // Don't automatically trigger subsequent logic to avoid infinite loops
                    // Remove this to prevent cascading updates
                    // if (options[0]) {
                    //   handleLogicTrigger("subActivity", options[0]);
                    // }
                  }
                } catch (error) {
                  console.error("Error fetching sub-activities:", error);
                  toast.error("Failed to load sub-activities");
                } finally {
                  setIsLoading((prev) => ({ ...prev, subActivity: false }));
                }
              }
            }

            // For subActivity -> activity, issuanceType, etc. relationship
            if (componentKey === "subActivity" && value) {
              const activityId =
                typeof value === "object" ? value.activityId : value;

              if (activityId) {
                // Try to get the URL from schema
                const detailsUrl = getRelatedDataUrl("subActivity", "details", {
                  id: activityId,
                });

                if (detailsUrl) {
                  const toastId = toast.loading("Loading activity details...");

                  try {
                    const data = await fetchDataWithAuth(
                      detailsUrl,
                      "subActivity"
                    );

                    // Auto-fill related fields
                    if (data) {
                      // Set main activity
                      if (data.mainActivity) {
                        setValue("activity", data.mainActivity);
                      }

                      // Set issuance type
                      if (data.issuanceType) {
                        setValue("issuanceType", data.issuanceType);
                        setValue(
                          "issuanceType1",
                          data.issuanceType === "فوري" ? "فوري" : "غير فوري"
                        );
                      }

                      // Set fees
                      if (data.fees) {
                        setValue("fees", data.fees);
                      }

                      // Set ISIC number
                      if (data.isicNumber) {
                        setValue("isicNumber", data.isicNumber);
                      }

                      toast.success(
                        "Activity information loaded successfully",
                        {
                          id: toastId,
                        }
                      );
                    } else {
                      toast.error(
                        "No data received for the selected activity",
                        {
                          id: toastId,
                        }
                      );
                    }
                  } catch (error) {
                    console.error("Error fetching activity details:", error);
                    toast.error(
                      `Error loading activity information: ${
                        error instanceof Error ? error.message : "Unknown error"
                      }`,
                      { id: toastId }
                    );
                  }
                }
              }
            }

            // For areas -> cities relationship
            if (componentKey === "areas" && value) {
              const areaId = typeof value === "object" ? value.id : value;

              if (areaId) {
                // Get cities URL using the relationship function
                const citiesUrl = getRelatedDataUrl("areas", "children", {
                  child: "cities",
                  areas: areaId,
                });

                if (citiesUrl) {
                  try {
                    setIsLoading((prev) => ({ ...prev, cities: true }));

                    const data = await fetchDataWithAuth(citiesUrl, "cities");

                    // Determine data source path based on component configuration
                    const citiesComponent = findComponentByKey("cities");
                    let citiesData = data;

                    if (citiesComponent) {
                      if (citiesComponent.selectValues) {
                        citiesData = data[citiesComponent.selectValues] || data;
                      } else {
                        citiesData = data.data || data;
                      }

                      // Process cities and update options
                      if (Array.isArray(citiesData)) {
                        // Extract label/value fields from component template
                        const labelField = citiesComponent.template
                          ? citiesComponent.template.match(
                              /\{\{\s*item\.([^}]+)\s*\}\}/
                            )?.[1] || "text"
                          : "text";

                        const valueField =
                          citiesComponent.valueProperty || "id";

                        const options = citiesData.map((item: any) => ({
                          label: item[labelField] || item.text || "Unknown",
                          value: item[valueField] || item.id || "",
                          ...item,
                        }));

                        setDynamicSelectOptions((prev) => ({
                          ...prev,
                          cities: options,
                        }));

                        // Clear dependent fields
                        setValue("cities", "");
                        setValue("districts", "");
                      }
                    }
                  } catch (error) {
                    console.error("Error fetching cities:", error);
                    toast.error("Failed to load cities");
                  } finally {
                    setIsLoading((prev) => ({ ...prev, cities: false }));
                  }
                }
              }
            }

            // For cities -> districts relationship
            if (componentKey === "cities" && value) {
              const cityId = typeof value === "object" ? value.id : value;

              if (cityId) {
                // Get districts URL using the relationship function
                const districtsUrl = getRelatedDataUrl("cities", "children", {
                  child: "districts",
                  cities: cityId,
                });

                if (districtsUrl) {
                  try {
                    setIsLoading((prev) => ({ ...prev, districts: true }));

                    const data = await fetchDataWithAuth(
                      districtsUrl,
                      "districts"
                    );

                    // Determine data source path based on component configuration
                    const districtsComponent = findComponentByKey("districts");
                    let districtsData = data;

                    if (districtsComponent) {
                      if (districtsComponent.selectValues) {
                        districtsData =
                          data[districtsComponent.selectValues] || data;
                      } else {
                        districtsData = data.data || data;
                      }

                      // Process districts and update options
                      if (Array.isArray(districtsData)) {
                        // Extract label/value fields from component template
                        const labelField = districtsComponent.template
                          ? districtsComponent.template.match(
                              /\{\{\s*item\.([^}]+)\s*\}\}/
                            )?.[1] || "text"
                          : "text";

                        const valueField =
                          districtsComponent.valueProperty || "id";

                        const options = districtsData.map((item: any) => ({
                          label: item[labelField] || item.text || "Unknown",
                          value: item[valueField] || item.id || "",
                          ...item,
                        }));

                        setDynamicSelectOptions((prev) => ({
                          ...prev,
                          districts: options,
                        }));

                        // Clear dependent field
                        setValue("districts", "");
                      }
                    }
                  } catch (error) {
                    console.error("Error fetching districts:", error);
                    toast.error("Failed to load districts");
                  } finally {
                    setIsLoading((prev) => ({ ...prev, districts: false }));
                  }
                }
              }
            }

            // For any classification components with details (like games, etc.)
            if (
              (componentKey.includes("Classification") ||
                componentKey === "saudiAgeClassification") &&
              value &&
              value.id
            ) {
              const selectedId = value.id;

              // First, try to extract URL directly from the logic definition
              let infoUrl = null;

              // This is important: extract the URL directly from the JavaScript logic
              if (trigger.trigger.javascript) {
                const urlMatch = trigger.trigger.javascript.match(
                  /Formio\.fetch\(`([^`]+)`/
                );
                if (urlMatch && urlMatch[1]) {
                  // Found the URL in the JavaScript code
                  infoUrl = urlMatch[1].replace("${selectedId}", selectedId);
                }
              }

              // If we couldn't extract from logic, fall back to the related data function
              if (!infoUrl) {
                infoUrl = getRelatedDataUrl(componentKey, "info", {
                  id: selectedId,
                });
              }

              if (infoUrl) {
                const toastId = toast.loading(
                  `Loading ${componentKey} information...`
                );

                try {
                  const data = await fetchDataWithAuth(infoUrl, componentKey);

                  // Auto determine which fields to populate based on the response data
                  if (data) {
                    // Find all form components to potentially receive data
                    const allComponents = findAllFormComponents(
                      schema.formDesigner?.components || []
                    );

                    // Log the data in development
                    if (process.env.NODE_ENV === "development") {
                      console.log(
                        `Classification info data for ${componentKey}:`,
                        data
                      );
                    }

                    // Process all data fields dynamically, using same approach as above
                    Object.entries(data).forEach(([dataKey, dataValue]) => {
                      // Skip null/undefined values and functions
                      if (
                        dataValue === null ||
                        dataValue === undefined ||
                        typeof dataValue === "function"
                      )
                        return;

                      // Handle arrays (like console/platforms lists) separately
                      if (Array.isArray(dataValue)) {
                        // Process arrays like 'console' later
                        return;
                      }

                      // Skip deep nested objects
                      if (
                        typeof dataValue === "object" &&
                        dataValue !== null &&
                        !Array.isArray(dataValue)
                      )
                        return;

                      // Try direct match first (exact field key match)
                      const directMatch = allComponents.find(
                        (comp) => comp.key === dataKey
                      );

                      if (directMatch) {
                        setValue(directMatch.key, dataValue);
                        if (process.env.NODE_ENV === "development") {
                          console.log(`Set ${directMatch.key} to ${dataValue}`);
                        }
                        return; // Continue to next field
                      }

                      // Try language-specific matches
                      let possibleMatches = [];

                      // Handle fields ending with Ar, En, Fr
                      if (dataKey.endsWith("Ar")) {
                        const baseKey = dataKey.slice(0, -2).toLowerCase();
                        possibleMatches = allComponents.filter(
                          (comp) =>
                            comp.key.toLowerCase().includes(baseKey) &&
                            (comp.key.includes("Arabic") ||
                              comp.key.includes("InArabic") ||
                              comp.key.includes("Ar"))
                        );
                      } else if (dataKey.endsWith("En")) {
                        const baseKey = dataKey.slice(0, -2).toLowerCase();
                        possibleMatches = allComponents.filter(
                          (comp) =>
                            comp.key.toLowerCase().includes(baseKey) &&
                            (comp.key.includes("English") ||
                              comp.key.includes("InEnglish") ||
                              comp.key.includes("En"))
                        );
                      }
                      // Try semantic matches for common fields
                      else if (dataKey.toLowerCase().includes("name")) {
                        possibleMatches = allComponents.filter(
                          (comp) =>
                            comp.key.toLowerCase().includes("name") &&
                            !comp.key.toLowerCase().includes("ar") &&
                            !comp.key.toLowerCase().includes("arabic") &&
                            !comp.key.toLowerCase().includes("en") &&
                            !comp.key.toLowerCase().includes("english")
                        );
                      } else if (
                        dataKey.toLowerCase().includes("description")
                      ) {
                        possibleMatches = allComponents.filter(
                          (comp) =>
                            comp.key.toLowerCase().includes("description") &&
                            !comp.key.toLowerCase().includes("ar") &&
                            !comp.key.toLowerCase().includes("arabic") &&
                            !comp.key.toLowerCase().includes("en") &&
                            !comp.key.toLowerCase().includes("english")
                        );
                      } else if (dataKey.toLowerCase().includes("publisher")) {
                        possibleMatches = allComponents.filter(
                          (comp) =>
                            comp.key.toLowerCase().includes("publisher") &&
                            !comp.key.toLowerCase().includes("ar") &&
                            !comp.key.toLowerCase().includes("arabic") &&
                            !comp.key.toLowerCase().includes("en") &&
                            !comp.key.toLowerCase().includes("english")
                        );
                      }
                      // General partial match
                      else {
                        const dataKeyNormalized = dataKey.toLowerCase();
                        possibleMatches = allComponents.filter((comp) => {
                          const compKeyNormalized = comp.key.toLowerCase();
                          return (
                            compKeyNormalized.includes(dataKeyNormalized) ||
                            dataKeyNormalized.includes(compKeyNormalized)
                          );
                        });
                      }

                      // Apply the first potential match if found
                      if (possibleMatches.length > 0) {
                        // Sort by relevance (shortest key that contains the data key)
                        possibleMatches.sort(
                          (a, b) => a.key.length - b.key.length
                        );
                        setValue(possibleMatches[0].key, dataValue);
                        if (process.env.NODE_ENV === "development") {
                          console.log(
                            `Set ${possibleMatches[0].key} to ${dataValue}`
                          );
                        }
                      }
                    });

                    // Handle special cases like lists or arrays
                    if (data.console && Array.isArray(data.console)) {
                      // Find components that can accept platform/console data
                      const platformComponents = allComponents.filter(
                        (comp) =>
                          comp.type === "select" &&
                          comp.multiple &&
                          (comp.key.toLowerCase().includes("platform") ||
                            comp.key.toLowerCase().includes("console") ||
                            comp.key.toLowerCase().includes("device"))
                      );

                      if (platformComponents.length > 0) {
                        // Process the console array data
                        const platformOptions = data.console.map(
                          (item: any) => ({
                            value:
                              typeof item === "object"
                                ? item.text || item.value || item.id || item
                                : item,
                            label:
                              typeof item === "object"
                                ? item.text || item.label || item.name || item
                                : item,
                          })
                        );

                        // Update all matching fields
                        platformComponents.forEach((comp) => {
                          setDynamicSelectOptions((prev) => ({
                            ...prev,
                            [comp.key]: platformOptions,
                          }));
                        });
                      }
                    }

                    toast.success(
                      `${componentKey} information loaded successfully`,
                      {
                        id: toastId,
                      }
                    );
                  } else {
                    toast.error(`No data received for ${componentKey}`, {
                      id: toastId,
                    });
                  }
                } catch (error) {
                  console.error(`Error fetching ${componentKey} info:`, error);
                  toast.error(
                    `Error loading information: ${
                      error instanceof Error ? error.message : "Unknown error"
                    }`,
                    { id: toastId }
                  );
                }
              }
            }
          } catch (error) {
            console.error(
              `Error executing logic trigger for ${componentKey}:`,
              error
            );
          }
        }
      }
    },
    [
      logicTriggers,
      findComponentByKey,
      fetchDataWithAuth,
      setValue,
      setDynamicSelectOptions,
      setIsLoading,
      toast,
      getRelatedDataUrl,
      schema.formDesigner?.components,
      findAllFormComponents,
      t,
      commonT,
    ]
  );

  // Generic function to fetch options for any component with dataSrc="url"
  const fetchComponentOptions = useCallback(
    async (component: any) => {
      if (
        !component.key ||
        component.dataSrc !== "url" ||
        !component.data?.url
      ) {
        return;
      }

      try {
        setIsLoading((prev) => ({ ...prev, [component.key]: true }));

        // Parse the URL to replace any template variables
        const parsedUrl = parseUrl(component.data.url);

        // Validate URL before fetching
        try {
          new URL(parsedUrl);
        } catch (e) {
          console.warn(
            `Invalid URL for ${component.key}: ${parsedUrl}. Skipping fetch.`
          );
          setIsLoading((prev) => ({ ...prev, [component.key]: false }));
          return;
        }

        const data = await fetchDataWithAuth(parsedUrl, component.key);

        // Determine the property in the response that contains the options data
        let dataSource = data;
        if (
          component.selectValues &&
          typeof component.selectValues === "string"
        ) {
          dataSource = data[component.selectValues] || data;
        } else if (
          !Array.isArray(data) &&
          typeof data === "object" &&
          data !== null
        ) {
          // Handle common response structures
          dataSource =
            data.data ||
            data.items ||
            data.results ||
            data.content ||
            data.subActivities || // For specific API responses like sub-activities
            data[component.key] || // Try using the component key
            data;
        }

        // Ensure dataSource is an array
        const items = Array.isArray(dataSource) ? dataSource : [];

        // Process the response based on component configuration
        const labelField = component.template
          ? component.template.match(/\{\{\s*item\.([^}]+)\s*\}\}/)?.[1] ||
            "label"
          : "label";

        const valueField = component.valueProperty || "value" || "id";

        const options = items.map((item: any) => ({
          label:
            item[labelField] ||
            item.text ||
            item.label ||
            item.name ||
            item.title ||
            item.id ||
            "Unknown",
          value: item[valueField] || item.id || item.value || item.key || "",
          ...item, // Keep the original data for reference
        }));

        setDynamicSelectOptions((prev) => ({
          ...prev,
          [component.key]: options,
        }));

        // Avoid auto-triggering additional logic for initial loads
        // to prevent potential infinite loops
        // Instead, let the user interaction trigger subsequent logic
      } catch (error) {
        console.error(`Error fetching options for ${component.key}:`, error);
        // Set empty options to prevent UI issues
        setDynamicSelectOptions((prev) => ({
          ...prev,
          [component.key]: [],
        }));
      } finally {
        setIsLoading((prev) => ({ ...prev, [component.key]: false }));
      }
    },
    [parseUrl, fetchDataWithAuth, setDynamicSelectOptions, setIsLoading]
  );

  // Extract logic triggers from components
  useEffect(() => {
    if (!schema.formDesigner?.components) return;

    const extractLogicTriggers = (components: any[]) => {
      const triggers: Record<string, LogicTrigger[]> = {};

      const processComponent = (component: any) => {
        if (component.key && component.logic && component.logic.length > 0) {
          triggers[component.key] = component.logic;
        }
      };

      const traverseComponents = (components: any[]) => {
        components.forEach((component) => {
          if (component.type === "columns" && component.columns) {
            component.columns.forEach((column: any) => {
              if (column.components) {
                traverseComponents(column.components);
              }
            });
          } else if (component.type === "panel" && component.components) {
            traverseComponents(component.components);
          } else if (component.type === "tabs" && component.components) {
            component.components.forEach((tab: any) => {
              if (tab.components) {
                traverseComponents(tab.components);
              }
            });
          } else {
            processComponent(component);
          }
        });
      };

      traverseComponents(components);
      return triggers;
    };

    const logicTriggersData = extractLogicTriggers(
      schema.formDesigner.components
    );
    setLogicTriggers(logicTriggersData);
  }, [schema]);

  // Watch for changes in fields that other components depend on via refreshOn
  useEffect(() => {
    if (!schema.formDesigner?.components) return;

    const dynamicComponents = findDynamicDataComponents(
      schema.formDesigner.components
    );

    // Create a subscription to watch form values
    const subscription = watch((value, { name, type }) => {
      if (name && type === "change") {
        // Find components that depend on the changed field via refreshOn
        dynamicComponents.forEach((component) => {
          if (component.refreshOn) {
            // Handle both comma-separated fields and single field
            const refreshFields = component.refreshOn
              .split(",")
              .map((field: string) => field.trim());

            if (refreshFields.includes(name)) {
              // If this field is a dependency for this component, fetch new options
              fetchComponentOptions(component);

              // If refreshOnChange is true or not specified, clear the value
              if (component.refreshOnChange !== false) {
                setValue(component.key, component.multiple ? [] : "");
              }
            }
          }
        });

        // Call onFormChange with current form values
        if (onFormChange) {
          onFormChange(getValues());
        }
      }
    });

    // Cleanup subscription on unmount
    return () => subscription.unsubscribe();
  }, [
    schema,
    watch,
    setValue,
    findDynamicDataComponents,
    fetchComponentOptions,
    onFormChange,
    getValues,
  ]);

  // Fetch options for select fields with dataSrc="url" on initial load
  useEffect(() => {
    if (!schema.formDesigner?.components) return;

    const dynamicComponents = findDynamicDataComponents(
      schema.formDesigner.components
    );

    // Initial fetch for components without dependencies (no refreshOn property)
    dynamicComponents
      .filter(
        (component) =>
          !component.refreshOn &&
          !loadedComponentsRef.current.has(component.key)
      )
      .forEach((component) => {
        loadedComponentsRef.current.add(component.key);
        fetchComponentOptions(component);
      });
  }, [schema, findDynamicDataComponents, fetchComponentOptions]);

  // Get translation for a given keyword
  const getTranslation = useCallback(
    (keyword: string, type?: string) => {
      if (!schema.translations) return keyword;

      // For required messages (with type='required')
      if (type === "required") {
        // Find the required message template
        const requiredTemplate = schema.translations.find(
          (t) => t.Type === "required"
        );

        if (requiredTemplate) {
          // Get the template with placeholders for the current language
          const templateString =
            requiredTemplate[language] || requiredTemplate.En;

          // Find translation for the field label
          const labelTranslation = schema.translations.find(
            (t) => t.Keyword === keyword
          );

          // Get the translated field label
          const translatedLabel = labelTranslation
            ? labelTranslation[language] || labelTranslation.En
            : keyword;

          // Replace the {{field}} placeholder with the translated field label
          if (templateString && templateString.includes("{{field}}")) {
            return templateString.replace("{{field}}", translatedLabel);
          }
        }
      }

      // Regular translation lookup
      const translation = schema.translations.find(
        (t) => t.Keyword === keyword || (type && t.Type === type)
      );

      // Return the translation if found
      if (translation)
        return translation[language] || translation.En || keyword;

      return keyword;
    },
    [schema.translations, language]
  );

  // Build Zod schema based on form components
  useEffect(() => {
    if (!schema.formDesigner?.components) return;

    // Validate select options to ensure no empty values
    validateSelectOptions(schema.formDesigner.components);

    const generatedSchema = buildZodSchema(
      schema.formDesigner.components,
      schema.translations || []
    );
    setFormSchema(generatedSchema);

    // Set initial active tab if there are tabs
    const tabsComponent = schema.formDesigner.components.find(
      (c) => c.type === "tabs"
    );
    if (
      tabsComponent &&
      tabsComponent.components &&
      tabsComponent.components.length > 0
    ) {
      setActiveTab(tabsComponent.components[0].key);
    }
  }, [schema]);

  // Check if a component should be shown based on its conditional logic
  const shouldShowComponent = (component: any): boolean => {
    // If there's no conditional logic, always show the component
    if (!component.conditional || !component.conditional.show) {
      return true;
    }

    // Get the field to check against
    const whenField = component.conditional.when;
    if (!whenField) {
      return true;
    }

    // For fields that might be populated by logic, ensure we have the latest values
    const fieldValue = formValues[whenField];

    // Check if the condition is met
    if (component.conditional.eq !== undefined) {
      // Handle string comparison (convert both to strings for consistency)
      if (String(fieldValue) === String(component.conditional.eq)) {
        return (
          component.conditional.show === true ||
          component.conditional.show === "true"
        );
      } else {
        return (
          component.conditional.show === false ||
          component.conditional.show === "false"
        );
      }
    }

    // Handle JSON condition if present
    if (component.conditional.json) {
      try {
        // This would need a more complex implementation to evaluate JSON conditions
        // For now, we'll just return true if JSON condition exists
        return true;
      } catch (error) {
        console.error("Error evaluating JSON condition:", error);
        return true;
      }
    }

    return true;
  };

  // Add a useEffect to watch form changes and handle dependencies between fields
  useEffect(() => {
    // For each field that has a refreshOn property, we need to reset it when its dependency changes
    if (!schema.formDesigner?.components) return;

    const findAndResetDependentFields = (
      components: any[],
      changedField: string
    ) => {
      const processComponent = (component: any) => {
        // Check if this component depends on the changed field
        if (component.refreshOn) {
          // Handle both comma-separated fields and single field
          const refreshFields = component.refreshOn
            .split(",")
            .map((field: string) => field.trim());

          if (refreshFields.includes(changedField)) {
            // If this is a select field with a URL data source, we'll let the DynamicSelect handle refreshing
            // We only need to reset the value if the refreshOnChange is true (default is true)
            if (component.refreshOnChange !== false) {
              setValue(component.key, component.multiple ? [] : "");
            }
          }
        }

        // Also check if there's a conditional display that depends on this field
        if (component.conditional?.when === changedField) {
          // The field visibility might change, but we don't need to reset it
          // The rendering logic will handle showing/hiding it
        }
      };

      const traverseComponents = (components: any[]) => {
        components.forEach((component) => {
          if (component.type === "columns" && component.columns) {
            component.columns.forEach((column: any) => {
              if (column.components) {
                traverseComponents(column.components);
              }
            });
          } else if (component.type === "panel" && component.components) {
            traverseComponents(component.components);
          } else if (component.type === "tabs" && component.components) {
            component.components.forEach((tab: any) => {
              if (tab.components) {
                traverseComponents(tab.components);
              }
            });
          } else {
            processComponent(component);
          }
        });
      };

      traverseComponents(components);
    };

    // Subscribe to form changes
    const subscription = watch((value, { name, type }) => {
      if (name && type === "change") {
        findAndResetDependentFields(schema.formDesigner.components, name);
      }
    });

    // Cleanup subscription on unmount
    return () => subscription.unsubscribe();
  }, [schema.formDesigner?.components, watch, setValue]);

  // Add an effect to listen for the custom save draft event
  useEffect(() => {
    const form = formRef.current;
    if (!form) return;

    const handleSaveDraft = (event: any) => {
      const handler = event.detail?.handler;
      if (handler && typeof handler === "function") {
        const formData = {
          ...getValues(),
          ...hiddenFields,
        };
        handler(formData);
      } else if (onSaveDraft) {
        const formData = {
          ...getValues(),
          ...hiddenFields,
        };
        onSaveDraft(formData);
      }
    };

    form.addEventListener("formio.saveDraft", handleSaveDraft);

    return () => {
      form.removeEventListener("formio.saveDraft", handleSaveDraft);
    };
  }, [formRef, getValues, hiddenFields, onSaveDraft]);

  // Add a debugging effect to check file uploads during form submission
  useEffect(() => {
    // Only in development mode
    if (process.env.NODE_ENV !== "development") return;

    // Create a function to intercept form submissions
    const handleSubmit = (event: Event) => {
      // Skip this if we're just logging and not actually debugging file uploads
      console.log("DEBUG - Form submission event:", event);
      if (event.type !== "submit") return;

      // Find all file components in the schema
      const fileComponents = findAllFormComponents(
        schema.formDesigner?.components || []
      ).filter((comp) => comp.type === "file");

      if (fileComponents.length) {
        // Log information about tracked files
        console.log("Files being tracked before form submission:", fileUploads);

        // Check what's in the form values for these file components
        const formValues = getValues();
        fileComponents.forEach((comp) => {
          const key = comp.key;
          const value = formValues[key];

          // Log the file value
          console.log(`Form value for file field ${key}:`, value);

          // Check if it has the correct file object properties
          if (value) {
            if (Array.isArray(value)) {
              value.forEach((item, idx) => {
                console.log(
                  `  ${key}[${idx}] has file object:`,
                  item instanceof File
                    ? true
                    : item && typeof item === "object" && "file" in item
                );
                console.log(
                  `  ${key}[${idx}] has originalFile:`,
                  item && typeof item === "object" && "originalFile" in item
                );
              });
            } else if (typeof value === "object") {
              console.log(
                `  ${key} has file object:`,
                value instanceof File ? true : value && "file" in value
              );
              console.log(
                `  ${key} has originalFile:`,
                value && "originalFile" in value
              );
            }
          }
        });
      }
    };

    // Add event listener to the form element
    const form = formRef.current;
    if (form) {
      form.addEventListener("submit", handleSubmit);
    }

    // Cleanup
    return () => {
      if (form) {
        form.removeEventListener("submit", handleSubmit);
      }
    };
  }, [
    schema.formDesigner?.components,
    fileUploads,
    getValues,
    findAllFormComponents,
  ]);

  // Render form components recursively
  const renderComponents = (
    components: any[],
    parentKey = "",
    rowData?: any,
    rowIndex?: number
  ) => {
    return components.map((component, index) => {
      const componentKey = `${parentKey}-${component.key || index}`;

      // Skip rendering hidden components, but they're still in the form state
      if (component.hidden === true) {
        return null;
      }

      // Check conditional rendering
      if (!shouldShowComponent(component)) {
        return null;
      }

      // For components inside a datagrid, we need to use the key that includes the row index
      // The key is already modified in DynamicDataGrid component
      if (rowData && rowIndex !== undefined && component.key) {
        // Make sure the key already has the correct index
        if (!component.key.includes(`[${rowIndex}]`)) {
          component.key = `${component.key.replace(
            /\[\d+\]$/,
            ""
          )}[${rowIndex}]`;
        }
      }

      // If in view mode, force component to be disabled
      if (mode === "view") {
        component = { ...component, disabled: true };
      }

      switch (component.type) {
        case "htmlelement":
          return (
            <DynamicHtmlElement
              key={componentKey}
              component={component}
              getTranslation={getTranslation}
            />
          );

        case "datagrid":
          return (
            <DynamicDataGrid
              key={componentKey}
              component={component}
              control={control}
              errors={errors}
              getTranslation={getTranslation}
              renderComponents={renderComponents}
              parentKey={parentKey}
            />
          );

        case "columns":
          return (
            <DynamicColumns
              key={componentKey}
              component={component}
              componentKey={componentKey}
              renderComponents={renderComponents}
              rowData={rowData}
              rowIndex={rowIndex}
            />
          );

        case "tabs":
          return (
            <DynamicTabs
              key={componentKey}
              component={component}
              componentKey={componentKey}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              renderComponents={renderComponents}
              getTranslation={getTranslation}
              rowData={rowData}
              rowIndex={rowIndex}
            />
          );

        case "panel":
          return (
            <DynamicPanel
              key={componentKey}
              component={component}
              componentKey={componentKey}
              renderComponents={renderComponents}
              getTranslation={getTranslation}
              rowData={rowData}
              rowIndex={rowIndex}
            />
          );

        case "textfield":
          return (
            <DynamicTextField
              key={componentKey}
              component={component}
              control={control}
              errors={errors}
              getTranslation={getTranslation}
            />
          );

        case "textarea":
          return (
            <DynamicTextArea
              key={componentKey}
              component={component}
              control={control}
              errors={errors}
              getTranslation={getTranslation}
            />
          );

        case "email":
          return (
            <DynamicEmail
              key={componentKey}
              component={component}
              control={control}
              errors={errors}
              getTranslation={getTranslation}
            />
          );

        case "checkbox":
          return (
            <DynamicCheckbox
              key={componentKey}
              component={component}
              control={control}
              errors={errors}
              getTranslation={getTranslation}
            />
          );

        case "datetime":
          return (
            <DynamicDatetime
              key={componentKey}
              component={component}
              control={control}
              errors={errors}
              getTranslation={getTranslation}
            />
          );

        case "file":
          return (
            <DynamicFile
              key={componentKey}
              component={component}
              control={control}
              errors={errors}
              getTranslation={getTranslation}
              fileUploads={fileUploads}
              setFileUploads={setFileUploads}
              mode={mode}
            />
          );

        case "select":
          if (component.multiple) {
            return (
              <DynamicMultiSelect
                key={componentKey}
                component={component}
                control={control}
                errors={errors}
                getTranslation={getTranslation}
                dynamicSelectOptions={dynamicSelectOptions}
                isLoading={isLoading}
                handleLogicTrigger={handleLogicTrigger}
              />
            );
          } else {
            return (
              <DynamicSelect
                key={componentKey}
                component={component}
                control={control}
                errors={errors}
                getTranslation={getTranslation}
                watch={watch}
                sessionToken={session}
                dynamicOptions={dynamicSelectOptions[component.key]}
                setValue={setValue}
                handleLogicTrigger={handleLogicTrigger}
              />
            );
          }

        case "number":
          return (
            <DynamicNumber
              key={componentKey}
              component={component}
              control={control}
              errors={errors}
              getTranslation={getTranslation}
            />
          );

        case "phoneNumber":
          return (
            <DynamicPhoneNumber
              key={componentKey}
              component={component}
              control={control}
              errors={errors}
              getTranslation={getTranslation}
            />
          );

        case "button":
          if (component.action === "submit") {
            return (
              <div key={componentKey} className="mb-4">
                <Button
                  type="submit"
                  className={component.customClass || ""}
                  disabled={component.disabled}
                >
                  {getTranslation(component.label)}
                </Button>
              </div>
            );
          }
          return null;

        default:
          console.warn(`Unsupported component type: ${component.type}`);
          return null;
      }
    });
  };

  // Handle form submission
  const handleFormSubmit = (data: any) => {
    // Don't submit if in view mode
    console.log("DEBUG $%%$%$%$%$%$%%%", data);
    if (mode === "view") return;

    // Debug logging for file fields
    if (process.env.NODE_ENV === "development") {
      // Find file components
      const fileComponents = findAllFormComponents(
        schema.formDesigner?.components || []
      ).filter((comp) => comp.type === "file");

      // Log file field values for debugging
      fileComponents.forEach((fileComp) => {
        const fieldKey = fileComp.key;
        const fieldValue = data[fieldKey];
        console.log(`File field ${fieldKey}:`, fieldValue);

        // Check if the value is valid according to our validation rules
        const isValid =
          fieldValue instanceof File ||
          (Array.isArray(fieldValue) && fieldValue.length > 0) ||
          (typeof fieldValue === "string" && fieldValue.trim() !== "") ||
          (fieldValue &&
            typeof fieldValue === "object" &&
            (fieldValue.name ||
              fieldValue.url ||
              fieldValue.originalName ||
              fieldValue.hash ||
              fieldValue.id));

        console.log(`File field ${fieldKey} is valid:`, isValid);
      });
    }

    // Process the form data to ensure proper structure
    const processedData = processFormData({
      ...data,
      ...hiddenFields,
    });

    onSubmit(processedData);
  };

  return (
    <CustomFormProvider
      onSubmit={handleFormSubmit}
      initialValues={schema.formData || {}}
    >
      <RHFormProvider {...form}>
        {/* Load flag icons for phone number component */}
        <PhoneNumberAssets />
        <form
          ref={formRef}
          onSubmit={handleSubmit(handleFormSubmit)}
          className="space-y-6"
        >
          {/* Include a script tag for Formio if needed */}
          <Script
            id="formio-script"
            strategy="afterInteractive"
            src="https://unpkg.com/formiojs@latest/dist/formio.full.min.js"
          />

          {/* Render hidden fields as hidden inputs to ensure they're included in form submission */}
          {Object.entries(hiddenFields).map(([key, value]) => (
            <input key={key} type="hidden" name={key} value={String(value)} />
          ))}

          {schema.formDesigner?.components &&
            renderComponents(schema.formDesigner.components)}
        </form>
      </RHFormProvider>
    </CustomFormProvider>
  );
};

export default ModularDynamicFormRenderer;
