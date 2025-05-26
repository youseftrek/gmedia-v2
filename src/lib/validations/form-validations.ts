import { z } from "zod";

// Helper function to safely apply min validation to a schema that might not support it
const safeMIN = (schema: any, count: number, message: string) => {
  if (typeof schema.min === "function") {
    return schema.min(count, { message });
  }
  // Fallback to using refine for validation
  return schema.refine(
    (val: unknown) => {
      if (val === undefined || val === null) return false;
      if (typeof val === "string") return val.length >= count;
      if (Array.isArray(val)) return val.length >= count;
      return val !== "";
    },
    { message }
  );
};

// Helper function to generate required message
export const generateRequiredMessage = (label: string, translations: any) => {
  // Find the required message template
  const requiredTemplate = translations?.find(
    (t: any) => t.Type === "required"
  );

  if (requiredTemplate) {
    // Get the template with placeholders for the current language
    const templateString = requiredTemplate.En;

    // Find translation for the field label
    const labelTranslation = translations?.find(
      (t: any) => t.Keyword === label
    );

    // Get the translated field label
    const translatedLabel = labelTranslation ? labelTranslation.En : label;

    // Replace the {{field}} placeholder with the translated field label
    if (templateString && templateString.includes("{{field}}")) {
      return templateString.replace("{{field}}", translatedLabel);
    }
  }

  return `${label} is required`;
};

// Build Zod schema based on form components
export const buildZodSchema = (components: any[], translations: any[]) => {
  const schemaObj: Record<string, any> = {};

  const processComponent = (component: any) => {
    if (
      !component.key ||
      component.type === "panel" ||
      component.type === "columns" ||
      component.type === "tabs"
    ) {
      return;
    }

    let fieldSchema: any = z.any();

    // Handle hidden fields - they should be included in the schema but not required
    if (component.hidden === true) {
      fieldSchema = z.any().optional();
      schemaObj[component.key] = fieldSchema;
      return;
    }

    // Base validation for required fields
    if (component.validate?.required) {
      // Only use min validation on string type
      fieldSchema = safeMIN(
        z.string(),
        1,
        generateRequiredMessage(component.label, translations)
      );
    } else {
      fieldSchema = z.string().optional();
    }

    // Add regex validation if present and component is a text-based input
    if (
      component.validate?.pattern &&
      ["textfield", "textarea", "email", "url"].includes(component.type)
    ) {
      const pattern = component.validate.pattern;
      const customMessage =
        component.validate.customMessage || "Invalid format";

      // Create a new string schema with regex validation that only applies when there's a value
      fieldSchema = z.string().refine(
        (val) => {
          // If the field is empty and not required, it's valid
          if (!component.validate?.required && (!val || val.trim() === "")) {
            return true;
          }
          // Otherwise, check the regex pattern
          return new RegExp(pattern).test(val);
        },
        {
          message: customMessage,
        }
      );

      // Only add required validation if explicitly set in the schema
      if (component.validate?.required) {
        // Use safe min function
        fieldSchema = safeMIN(
          fieldSchema,
          1,
          generateRequiredMessage(component.label, translations)
        );
      } else {
        fieldSchema = fieldSchema.optional();
      }
    }

    // Handle specific field types
    if (component.type === "email") {
      fieldSchema = component.validate?.required
        ? safeMIN(
            z.string().email(),
            1,
            generateRequiredMessage(component.label, translations)
          )
        : z.string().email().optional();
    }

    if (component.type === "checkbox") {
      fieldSchema = component.validate?.required
        ? z.boolean().refine((val) => val === true, {
            message: generateRequiredMessage(component.label, translations),
          })
        : z.boolean().optional();
    }

    if (component.type === "select" && component.multiple) {
      fieldSchema = component.validate?.required
        ? safeMIN(
            z.array(z.any()),
            1,
            generateRequiredMessage(component.label, translations)
          )
        : z.array(z.any()).optional();
    } else if (component.type === "select") {
      fieldSchema = component.validate?.required
        ? z
            .any()
            .refine((val) => val !== undefined && val !== null && val !== "", {
              message: generateRequiredMessage(component.label, translations),
            })
        : z.any().optional();
    }

    if (component.type === "file") {
      // For debugging
      const componentKey = component.key;

      fieldSchema = component.validate?.required
        ? z.any().refine(
            (val) => {
              // Debug logging in development
              if (process.env.NODE_ENV === "development") {
                console.log(`Validating file field ${componentKey}:`, val);
              }

              // Handle File instance
              if (val instanceof File) {
                if (process.env.NODE_ENV === "development") {
                  console.log(`${componentKey}: Valid File instance`);
                }
                return true;
              }

              // Handle array of files for multiple file uploads
              if (Array.isArray(val) && val.length > 0) {
                if (process.env.NODE_ENV === "development") {
                  console.log(
                    `${componentKey}: Valid file array with ${val.length} items`
                  );
                }
                return true;
              }

              // Handle string value (like a URL or base64 string)
              if (val && typeof val === "string" && val.trim() !== "") {
                if (process.env.NODE_ENV === "development") {
                  console.log(`${componentKey}: Valid string value`);
                }
                return true;
              }

              // Handle file object with metadata (our case)
              if (val && typeof val === "object") {
                const hasMetadata = !!(
                  val.name ||
                  val.url ||
                  val.originalName ||
                  val.hash ||
                  val.id
                );
                if (hasMetadata) {
                  if (process.env.NODE_ENV === "development") {
                    console.log(
                      `${componentKey}: Valid file object with metadata`
                    );
                  }
                  return true;
                }
              }

              if (process.env.NODE_ENV === "development") {
                console.log(`${componentKey}: Invalid file value`);
              }
              return false;
            },
            {
              message: generateRequiredMessage(component.label, translations),
            }
          )
        : z.any().optional();
    }

    if (component.type === "phoneNumber") {
      if (component.multiple) {
        fieldSchema = component.validate?.required
          ? safeMIN(
              z.array(z.string()),
              1,
              generateRequiredMessage(component.label, translations)
            )
          : z.array(z.string()).optional();
      } else {
        fieldSchema = component.validate?.required
          ? safeMIN(
              z.string(),
              1,
              generateRequiredMessage(component.label, translations)
            )
          : z.string().optional();
      }
    }

    if (component.type === "datagrid") {
      fieldSchema = component.validate?.required
        ? safeMIN(
            z.array(z.any()),
            1,
            generateRequiredMessage(component.label, translations)
          )
        : z.array(z.any()).optional();
    }

    if (component.type === "currency") {
      fieldSchema = component.validate?.required
        ? z
            .number()
            .or(
              z
                .string()
                .regex(/^-?\d*\.?\d*$/)
                .transform(Number)
            )
            .refine(
              (val) =>
                !isNaN(val) &&
                (component.validate?.min === undefined ||
                  val >= component.validate.min) &&
                (component.validate?.max === undefined ||
                  val <= component.validate.max),
              {
                message: component.validate?.customMessage
                  ? generateRequiredMessage(
                      component.validate.customMessage,
                      translations
                    )
                  : generateRequiredMessage(component.label, translations),
              }
            )
        : z
            .number()
            .or(
              z
                .string()
                .regex(/^-?\d*\.?\d*$/)
                .transform(Number)
            )
            .optional();
    }

    if (component.type === "number") {
      // For number fields, ensure we handle validation properly
      // Create a base schema that accepts either a number or a parseable string
      let numSchema = z.coerce.number();

      // Make it required or optional based on component settings, but don't validate min/max
      fieldSchema = component.validate?.required
        ? numSchema.refine((val) => val !== null && !isNaN(val), {
            message: generateRequiredMessage(component.label, translations),
          })
        : numSchema.nullable().optional();
    }

    if (component.type === "radio") {
      fieldSchema = component.validate?.required
        ? safeMIN(
            z.string(),
            1,
            generateRequiredMessage(component.label, translations)
          )
        : z.string().optional();
    }

    if (component.type === "url") {
      fieldSchema = component.validate?.required
        ? safeMIN(
            z.string().url(),
            1,
            generateRequiredMessage(component.label, translations)
          )
        : z.string().url().optional();
    }

    if (component.type === "datetime") {
      if (component.validate?.required) {
        fieldSchema = z
          .union([
            z.date(),
            safeMIN(
              z.string(),
              1,
              generateRequiredMessage(component.label, translations)
            ),
          ])
          .refine(
            (val) => {
              if (val instanceof Date) return !isNaN(val.getTime());
              if (typeof val === "string") {
                const date = new Date(val);
                return !isNaN(date.getTime());
              }
              return false;
            },
            {
              message: "Invalid date",
            }
          );
      } else {
        fieldSchema = z
          .union([
            z.date().optional(),
            z.string().optional(),
            z.null(),
            z.undefined(),
          ])
          .refine(
            (val) => {
              if (val === null || val === undefined || val === "") return true;
              if (val instanceof Date) return !isNaN(val.getTime());
              if (typeof val === "string") {
                const date = new Date(val);
                return !isNaN(date.getTime());
              }
              return false;
            },
            {
              message: "Invalid date",
            }
          )
          .optional();
      }
    }

    schemaObj[component.key] = fieldSchema;
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
  return z.object(schemaObj);
};

// Validate select options to ensure no empty values
export const validateSelectOptions = (components: any[]) => {
  const processComponent = (component: any) => {
    if (component.type === "select" && component.data?.values) {
      component.data.values = component.data.values.map(
        (option: any, idx: number) => {
          if (option.value === "") {
            return {
              ...option,
              value: `option-${component.key}-${idx}-fallback`,
            };
          }
          return option;
        }
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
};
