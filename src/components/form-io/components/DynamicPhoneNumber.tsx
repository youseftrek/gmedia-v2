import { FC, useState, useEffect } from "react";
import { Control, Controller, FieldErrors } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Country codes data
const COUNTRY_CODES = [
  { code: "sa", dialCode: "+966", name: "Saudi Arabia" },
  { code: "ae", dialCode: "+971", name: "United Arab Emirates" },
  { code: "us", dialCode: "+1", name: "United States" },
  { code: "gb", dialCode: "+44", name: "United Kingdom" },
  { code: "fr", dialCode: "+33", name: "France" },
  { code: "de", dialCode: "+49", name: "Germany" },
  { code: "eg", dialCode: "+20", name: "Egypt" },
  { code: "jo", dialCode: "+962", name: "Jordan" },
  { code: "kw", dialCode: "+965", name: "Kuwait" },
  { code: "lb", dialCode: "+961", name: "Lebanon" },
  { code: "qa", dialCode: "+974", name: "Qatar" },
  { code: "om", dialCode: "+968", name: "Oman" },
  { code: "bh", dialCode: "+973", name: "Bahrain" },
];

interface DynamicPhoneNumberProps {
  component: any;
  control: Control<any>;
  errors: FieldErrors;
  getTranslation: (keyword: string) => string;
}

interface PhoneValue {
  countryCode: string;
  number: string;
  fullNumber: string;
}

const DynamicPhoneNumber: FC<DynamicPhoneNumberProps> = ({
  component,
  control,
  errors,
  getTranslation,
}) => {
  // Safety check to ensure a key exists
  if (!component.key) return null;

  // Get translated label and placeholder
  const label = getTranslation(component.label);
  const placeholder = component.placeholder
    ? getTranslation(component.placeholder)
    : "";
  const description = component.description
    ? getTranslation(component.description)
    : "";

  // Custom CSS classes
  const customClass = component.customClass || "";

  // Input mask if available
  const inputMask = component.inputMask || "";

  // Validation params
  const required = component.validate?.required || false;

  // Function to format the phone number according to the input mask
  const formatPhoneNumber = (value: string, mask: string) => {
    if (!mask || !value) return value;

    let result = "";
    let valueIndex = 0;

    for (let i = 0; i < mask.length && valueIndex < value.length; i++) {
      if (mask[i] === "9") {
        // Digit placeholder
        if (/\d/.test(value[valueIndex])) {
          result += value[valueIndex];
          valueIndex++;
        } else {
          // Skip non-digits in the input
          valueIndex++;
          i--;
        }
      } else {
        // Add mask character
        result += mask[i];
      }
    }

    return result;
  };

  // Function to extract plain number from formatted input
  const extractNumber = (formattedValue: string) => {
    return formattedValue.replace(/\D/g, "");
  };

  return (
    <Controller
      control={control}
      name={component.key}
      rules={{
        required: required ? `${label} is required` : false,
      }}
      render={({ field }) => {
        // Parse the stored value
        const [countryCode, setCountryCode] = useState("+966"); // Default to Saudi Arabia
        const [number, setNumber] = useState("");

        // Initialize from field value if it exists
        useEffect(() => {
          if (field.value) {
            // Handle string or object value formats
            if (typeof field.value === "string") {
              // Try to extract country code from string
              const match = field.value.match(/^(\+\d+)(.*)$/);
              if (match) {
                setCountryCode(match[1]);
                setNumber(match[2].trim());
              } else {
                setNumber(field.value);
              }
            } else if (
              typeof field.value === "object" &&
              field.value.countryCode
            ) {
              setCountryCode(field.value.countryCode);
              setNumber(field.value.number || "");
            }
          }
        }, [field.value]);

        // Update the field value when either part changes
        const updateFieldValue = (
          newCountryCode: string,
          newNumber: string
        ) => {
          // Create a properly formatted full number
          const fullNumber = `${newCountryCode}${
            newNumber ? " " + newNumber : ""
          }`.trim();

          // Store the value as a string to avoid schema validation issues
          field.onChange(fullNumber);
        };

        return (
          <FormItem className={cn("mb-4", customClass)}>
            <FormLabel className={cn(component.hideLabel ? "sr-only" : "")}>
              {label}
              {required && <span className="text-destructive"> *</span>}
            </FormLabel>
            <div className="flex gap-2">
              <Select
                value={countryCode}
                onValueChange={(value) => {
                  setCountryCode(value);
                  updateFieldValue(value, number);
                }}
                disabled={component.disabled}
              >
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Code" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {COUNTRY_CODES.map((country) => (
                      <SelectItem key={country.code} value={country.dialCode}>
                        <div className="flex items-center">
                          <span className={`fi fi-${country.code} mr-2`}></span>
                          <span>{country.dialCode}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>

              <FormControl className="flex-1">
                <Input
                  type="tel"
                  inputMode="tel"
                  placeholder={placeholder || "Enter phone number"}
                  value={number}
                  onChange={(e) => {
                    // Apply formatting if a mask is provided
                    const rawValue = extractNumber(e.target.value);
                    const formattedValue = inputMask
                      ? formatPhoneNumber(rawValue, inputMask)
                      : rawValue;

                    setNumber(formattedValue);
                    updateFieldValue(countryCode, formattedValue);
                  }}
                  disabled={component.disabled}
                  className={cn(
                    errors[component.key] ? "border-destructive" : ""
                  )}
                />
              </FormControl>
            </div>
            {description && <FormDescription>{description}</FormDescription>}
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};

export default DynamicPhoneNumber;
