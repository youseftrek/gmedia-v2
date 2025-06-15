import { LOCALE_CODE } from "@/constants/locale";
import apiClient from "@/lib/apiClient";
import { Session } from "@/lib/auth";

export const BillsService = {
  /**
   * Generate bill PDF by document ID
   */
  async generate(documentId: number, session: Session, locale: string = "en") {
    try {
      const response = await apiClient.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/bills/generate/${documentId}`,
        {
          headers: {
            Authorization: `Bearer ${session?.token}`,
            "Accept-Language": LOCALE_CODE[locale as keyof typeof LOCALE_CODE],
          },
          responseType: "arraybuffer",
        }
      );

      // Convert ArrayBuffer to Base64 for client-side use
      const base64Data = Buffer.from(response.data).toString("base64");

      return { success: true, data: base64Data };
    } catch (error) {
      console.error("Error generating bill:", error);
      return { success: false, error: "billGenerationFailed" };
    }
  },

  /**
   * Initiate AlRajihi payment for a document
   */
  async initiateAlRajihiPayment(
    documentId: number,
    session: Session,
    locale: string = "en"
  ) {
    try {
      const response = await apiClient.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/bills/initiate-alrajihi-payment/${documentId}`,
        {
          headers: {
            "Accept-Language": LOCALE_CODE[locale as keyof typeof LOCALE_CODE],
          },
        }
      );

      return { success: true, data: response.data };
    } catch (error) {
      console.error("Error initiating payment:", error);
      return { success: false, error: "paymentInitiationFailed" };
    }
  },

  /**
   * Download bill by ID
   */
  async download(id: number, session: Session, locale: string = "en") {
    try {
      const response = await apiClient.get(`/bills/${id}/download`, {
        headers: {
          "Accept-Language": locale,
        },
        responseType: "arraybuffer",
      });

      // Convert ArrayBuffer to Base64 for client-side use
      const base64Data = Buffer.from(response.data).toString("base64");

      return { success: true, data: base64Data };
    } catch (error) {
      console.error("Error downloading bill:", error);
      return { success: false, error: "billDownloadFailed" };
    }
  },

  /**
   * View bill by GUID
   */
  async view(guid: string, session: Session, locale: string = "en") {
    try {
      const response = await apiClient.get(`/bills/${guid}/view`, {
        headers: {
          "Accept-Language": locale,
        },
        responseType: "arraybuffer",
      });

      // Convert ArrayBuffer to Base64 for client-side use
      const base64Data = Buffer.from(response.data).toString("base64");

      return { success: true, data: base64Data };
    } catch (error) {
      console.error("Error viewing bill:", error);
      return { success: false, error: "billViewFailed" };
    }
  },
};

export default BillsService;
