/* eslint-disable @typescript-eslint/no-explicit-any */
// Helper function for extracting document types with robust error handling
export const getDocumentTypes = (draftsData: any): string[] => {
  // Check if data is available
  if (!draftsData) {
    console.warn("getDocumentTypes: No data provided");
    return [];
  }

  // Handle different API response formats
  let items = [];

  try {
    // Try to find the items array in different possible locations
    if (Array.isArray(draftsData)) {
      items = draftsData;
    } else if (draftsData.items && Array.isArray(draftsData.items)) {
      items = draftsData.items;
    } else if (draftsData.data) {
      if (Array.isArray(draftsData.data)) {
        items = draftsData.data;
      } else if (
        draftsData.data.items &&
        Array.isArray(draftsData.data.items)
      ) {
        items = draftsData.data.items;
      }
    }

    // If we still don't have an array, return empty
    if (!Array.isArray(items)) {
      console.warn("getDocumentTypes: Could not find items array", draftsData);
      return [];
    }

    // Now extract the document types safely
    const types = items
      .filter(
        (item) =>
          item &&
          typeof item === "object" &&
          "documentType" in item &&
          item.documentType
      )
      .map((item) => item.documentType);

    // Use Set to remove duplicates
    return [...new Set(types)];
  } catch (error) {
    console.error("Error in getDocumentTypes:", error);
    return [];
  }
};
