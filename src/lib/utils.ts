import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Creates a URL string by combining a path with search parameters
 * @param pathname The base URL pathname
 * @param params The search parameters to append to the URL
 * @returns A formatted URL string
 */
export function createUrl(pathname: string, params: URLSearchParams): string {
  const paramsString = params.toString();
  return `${pathname}${paramsString ? `?${paramsString}` : ""}`;
}

export function getRandId() {
  return crypto.randomUUID();
}

// Define the possible request status types
export type RequestStatus =
  | "preparation"
  | "under_review"
  | "pending_approval"
  | "completed";

// Define a type for request data
export interface RequestData {
  statusId?: number;
  status?: {
    id?: number;
    name?: string;
  };
  statusName?: string;
  documentType?: string;
  createdDate?: string;
  id?: number | string;
  referenceNumber?: string;
  // For other properties use a more specific indexer
  [key: string]: unknown;
}

/**
 * Determine the current status of a request based on API data
 *
 * @param requestData The data returned from the API about the request
 * @returns The current status of the request
 */
export function determineRequestStatus(
  requestData: RequestData | null | undefined
): RequestStatus {
  // This is where you'll implement your logic to determine the request status based on
  // your API response. For now, here's a placeholder implementation:

  // Example implementation
  if (!requestData) return "preparation";

  // Check if request has specific status ids or fields indicating status
  const statusId = requestData.statusId || requestData.status?.id;
  const statusName = requestData.status?.name || requestData.statusName;

  // Example logic - replace with your actual logic based on API response structure
  if (statusId === 1 || statusName === "New" || statusName === "Draft") {
    return "preparation";
  } else if (statusId === 2 || statusName?.includes("Review")) {
    return "under_review";
  } else if (
    statusId === 3 ||
    statusName?.includes("Approval") ||
    statusName?.includes("Pending")
  ) {
    return "pending_approval";
  } else if (
    statusId === 4 ||
    statusName === "Completed" ||
    statusName === "Approved"
  ) {
    return "completed";
  }

  // Default to under_review if status can't be determined
  return "under_review";
}

export function getInitials(name: string, uppercase: boolean = true): string {
  if (!name) return "";

  // Split the name by spaces and filter out empty parts
  const parts = name.split(" ").filter((part) => part.trim().length > 0);

  if (parts.length === 0) return "";

  // Get the first character of each part (up to 2 parts)
  let initials = "";

  for (let i = 0; i < Math.min(2, parts.length); i++) {
    // Get the first character, accounting for combining characters
    const firstChar = [...parts[i]][0];

    // For Latin script, apply uppercase if requested
    if (uppercase && /[\u0000-\u007F]/.test(firstChar)) {
      initials += firstChar.toUpperCase();
    } else {
      initials += firstChar;
    }
  }

  // If we only have one part but it should return 2 characters, get the second character
  if (parts.length === 1 && parts[0].length > 1 && initials.length < 2) {
    const secondChar = [...parts[0]][1];

    if (uppercase && /[\u0000-\u007F]/.test(secondChar)) {
      initials += secondChar.toUpperCase();
    } else {
      initials += secondChar;
    }
  }

  return initials;
}

export const formatDate = (dateString: string) => {
  if (!dateString) return "";

  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  } catch (error) {
    console.error("Error formatting date:", error);
    return dateString;
  }
};

export function convertFormDataToJSON(data: any) {
  // Create a clean object with parsed JSON strings
  const result = {
    formDesigner: JSON.parse(data.formDesigner),
    formDesignerTranslation: JSON.parse(data.formDesignerTranslation),
    documentTypesBase: data.documentTypesBase,
    formData: data.formData,
  };

  return result;
}
