import { LOCALE_CODE } from "@/constants/locale";
import apiClient from "@/lib/apiClient";
import { Session } from "next-auth";

export const CertificatesService = {
  /**
   * Download certificate by ID
   */
  async download(id: number, session: Session, locale: string = "en") {
    try {
      const response = await apiClient.get(`/certificate/${id}/download`, {
        headers: {
          Authorization: `Bearer ${session?.token}`,
          "Accept-Language": locale,
        },
        responseType: "arraybuffer",
      });

      // Convert ArrayBuffer to Base64 for client-side use
      const base64Data = Buffer.from(response.data).toString("base64");

      return { success: true, data: base64Data };
    } catch (error) {
      console.error("Error downloading certificate:", error);
      return { success: false, error: "certificateDownloadFailed" };
    }
  },

  /**
   * View certificate by GUID
   */
  async view(guid: string, session: Session, locale: string = "en") {
    try {
      const response = await apiClient.get(`/certificate/${guid}/view`, {
        headers: {
          "Accept-Language": locale,
        },
        responseType: "arraybuffer",
      });

      // Convert ArrayBuffer to Base64 for client-side use
      const base64Data = Buffer.from(response.data).toString("base64");

      return { success: true, data: base64Data };
    } catch (error) {
      console.error("Error viewing certificate:", error);
      return { success: false, error: "certificateViewFailed" };
    }
  },
};

export default CertificatesService;
