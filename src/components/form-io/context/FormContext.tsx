import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useCallback,
  useMemo,
  useEffect,
} from "react";

interface FormContextType {
  formData: Record<string, any>;
  setFormValue: (key: string, value: any) => void;
  getFormValue: (key: string) => any;
  submitForm: () => void;
  trackFieldUpdate: (key: string, value: any, source: string) => void;
  getFieldHistory: (
    key: string
  ) => Array<{ value: any; timestamp: number; source: string }>;
  getLastUpdate: (
    key: string
  ) => { value: any; timestamp: number; source: string } | null;
}

const FormContext = createContext<FormContextType | undefined>(undefined);

export const useFormContext = () => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error("useFormContext must be used within a FormProvider");
  }
  return context;
};

interface FormProviderProps {
  children: ReactNode;
  onSubmit: (data: Record<string, any>) => void;
  initialValues?: Record<string, any>;
}

export const FormProvider = ({
  children,
  onSubmit,
  initialValues = {},
}: FormProviderProps) => {
  const [formData, setFormData] = useState<Record<string, any>>(initialValues);

  // Track update history for fields to help with debugging and optimization
  const [updateHistory, setUpdateHistory] = useState<
    Record<string, Array<{ value: any; timestamp: number; source: string }>>
  >({});

  useEffect(() => {
    // Log when form data changes to help debug
    if (process.env.NODE_ENV === "development") {
      // Only log the keys and types to avoid large logs
      const simplifiedData = Object.entries(formData).reduce(
        (acc, [key, value]) => {
          // Skip file objects which can be large
          if (value instanceof File) {
            acc[key] = `[File: ${value.name}, ${value.size} bytes]`;
          } else if (
            Array.isArray(value) &&
            value.length > 0 &&
            value[0] instanceof File
          ) {
            acc[key] = `[File Array: ${value.length} items]`;
          } else if (
            typeof value === "object" &&
            value !== null &&
            ("file" in value || "originalFile" in value)
          ) {
            acc[key] = `[File Object: ${
              value.name || value.originalName || "unknown"
            }]`;
          } else if (
            Array.isArray(value) &&
            value.length > 0 &&
            typeof value[0] === "object" &&
            value[0] !== null &&
            ("file" in value[0] || "originalFile" in value[0])
          ) {
            acc[key] = `[File Object Array: ${value.length} items]`;
          } else {
            acc[key] = value;
          }
          return acc;
        },
        {} as Record<string, any>
      );

      console.log("[FormContext] Form data updated:", simplifiedData);
    }
  }, [formData]);

  const setFormValue = useCallback((key: string, value: any) => {
    // Special handling for file objects to preserve the actual File instances
    const shouldPreserveFileMetadata =
      value instanceof File ||
      (typeof value === "object" &&
        value !== null &&
        ("file" in value || "originalFile" in value)) ||
      (Array.isArray(value) &&
        value.length > 0 &&
        (value[0] instanceof File ||
          (typeof value[0] === "object" &&
            value[0] !== null &&
            ("file" in value[0] || "originalFile" in value[0]))));

    setFormData((prevData) => {
      // If the key contains a dot, it means we need to handle nested objects
      if (key.includes(".")) {
        const [parentKey, childKey] = key.split(".");
        const currentParent = prevData[parentKey] || {};

        // Only update if the value has actually changed
        if (currentParent[childKey] === value) {
          return prevData;
        }

        return {
          ...prevData,
          [parentKey]: {
            ...currentParent,
            [childKey]: value,
          },
        };
      }

      // For file fields, we need to be more careful about checking for equality
      if (shouldPreserveFileMetadata) {
        // For file fields, we don't need strict equality - just update
        return {
          ...prevData,
          [key]: value,
        };
      }

      // For regular keys, only update if the value has changed
      if (prevData[key] === value) {
        return prevData;
      }

      return {
        ...prevData,
        [key]: value,
      };
    });

    // Track this update automatically
    trackFieldUpdate(key, value, "formContext");
  }, []);

  const getFormValue = useCallback(
    (key: string) => {
      // If the key contains a dot, it means we need to access nested objects
      if (key.includes(".")) {
        const [parentKey, childKey] = key.split(".");
        return formData[parentKey]?.[childKey];
      }

      return formData[key];
    },
    [formData]
  );

  const submitForm = useCallback(() => {
    // Special handling for file objects before submitting
    const prepareFilesForSubmission = (data: Record<string, any>) => {
      // First, create a shallow copy to avoid modifying the original
      const processedData = { ...data };

      // Look for file fields and ensure they have the required metadata
      for (const [key, value] of Object.entries(processedData)) {
        // Skip null or undefined values
        if (value === null || value === undefined) continue;

        // Handle File instances
        if (value instanceof File) {
          // Make sure this File has the properties needed for submission
          processedData[key] = {
            originalFile: value,
            file: value,
            name: value.name,
            size: value.size,
            type: value.type,
            originalName: value.name,
            // Add other required metadata
            hash: Math.random().toString(36).substring(2, 15),
            id: `#${Math.random().toString(36).substring(2, 15)}#`,
          };
        }
        // Handle arrays of files
        else if (
          Array.isArray(value) &&
          value.length > 0 &&
          value[0] instanceof File
        ) {
          processedData[key] = value.map((file) => ({
            originalFile: file,
            file: file,
            name: file.name,
            size: file.size,
            type: file.type,
            originalName: file.name,
            // Add other required metadata
            hash: Math.random().toString(36).substring(2, 15),
            id: `#${Math.random().toString(36).substring(2, 15)}#`,
          }));
        }
      }

      return processedData;
    };

    // Process data before submitting
    const processedData = prepareFilesForSubmission(formData);
    onSubmit(processedData);
  }, [formData, onSubmit]);

  // Track field updates for debugging and optimization
  const trackFieldUpdate = useCallback(
    (key: string, value: any, source: string) => {
      setUpdateHistory((prevHistory) => {
        const fieldHistory = prevHistory[key] || [];

        // For file fields, create a simplified representation for tracking
        let trackedValue = value;
        if (value instanceof File) {
          trackedValue = `[File: ${value.name}, ${value.size} bytes]`;
        } else if (
          typeof value === "object" &&
          value !== null &&
          ("file" in value || "originalFile" in value)
        ) {
          trackedValue = `[File Object: ${
            value.name || value.originalName || "unknown"
          }]`;
        }

        return {
          ...prevHistory,
          [key]: [
            ...fieldHistory,
            { value: trackedValue, timestamp: Date.now(), source },
          ].slice(-10), // Only keep last 10 updates
        };
      });
    },
    []
  );

  // Get update history for a field
  const getFieldHistory = useCallback(
    (key: string) => {
      return updateHistory[key] || [];
    },
    [updateHistory]
  );

  // Get the most recent update for a field
  const getLastUpdate = useCallback(
    (key: string) => {
      const history = updateHistory[key] || [];
      return history.length > 0 ? history[history.length - 1] : null;
    },
    [updateHistory]
  );

  const contextValue = useMemo(
    () => ({
      formData,
      setFormValue,
      getFormValue,
      submitForm,
      trackFieldUpdate,
      getFieldHistory,
      getLastUpdate,
    }),
    [
      formData,
      setFormValue,
      getFormValue,
      submitForm,
      trackFieldUpdate,
      getFieldHistory,
      getLastUpdate,
    ]
  );

  return (
    <FormContext.Provider value={contextValue}>{children}</FormContext.Provider>
  );
};
