// Helper function to check if a value is a simple type
const isSimpleType = (value: any): boolean => {
  return (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean" ||
    value === null ||
    value === undefined
  );
};

// Helper function to check if an object has specific keys
const hasKeys = (obj: any, keys: string[]): boolean => {
  return keys.every((key) => key in obj);
};

// Select component value handler
export const handleSelectValue = (option: any): any => {
  // If option is a simple type, return it as is
  if (isSimpleType(option)) {
    return option;
  }

  // If option is an object with id and text/value
  if (typeof option === "object" && option !== null) {
    // Check if it has the standard select option structure
    if (hasKeys(option, ["id", "text"])) {
      return {
        id: option.id,
        text: option.text,
      };
    }

    // If it has a different structure, return the original object
    return option;
  }

  return option;
};

// MultiSelect component value handler
export const handleMultiSelectValue = (options: any[]): any[] => {
  if (!Array.isArray(options)) {
    return [];
  }

  return options.map((option) => handleSelectValue(option));
};

// TextField component value handler
export const handleTextFieldValue = (value: any): string => {
  return value?.toString() || "";
};

// TextArea component value handler
export const handleTextAreaValue = (value: any): string => {
  return value?.toString() || "";
};

// Checkbox component value handler
export const handleCheckboxValue = (value: any): boolean => {
  return Boolean(value);
};

// File component value handler
export const handleFileValue = (value: any): File | File[] | null => {
  if (!value) return null;
  if (value instanceof File) return value;
  if (Array.isArray(value) && value.every((v) => v instanceof File))
    return value;
  return null;
};

// DateTime component value handler
export const handleDateTimeValue = (value: any): string | null => {
  if (!value) return null;
  if (value instanceof Date) return value.toISOString();
  if (typeof value === "string") return value;
  return null;
};

// Email component value handler
export const handleEmailValue = (value: any): string => {
  return value?.toString() || "";
};

// DataGrid component value handler
export const handleDataGridValue = (value: any[]): any[] => {
  if (!Array.isArray(value)) return [];
  return value.map((row) => {
    const processedRow: Record<string, any> = {};
    Object.entries(row).forEach(([key, val]) => {
      // Process each cell value based on its type
      if (typeof val === "object" && val !== null) {
        processedRow[key] = handleSelectValue(val);
      } else {
        processedRow[key] = val;
      }
    });
    return processedRow;
  });
};
