/* eslint-disable @typescript-eslint/no-explicit-any */
import { LOCALE_CODE } from "@/constants/locale";
import { Session } from "@/lib/auth";
import axios from "axios";

export async function getRequestDetails(
  requestId: number,
  session: Session,
  locale: string
): Promise<{
  data: {
    documentTitle: string;
    hasBill: boolean;
    hasCertificate: boolean;
    documentStatus: any;
    certificateDetails: any;
    billDetails: any;
    form: any;
  };
  success: boolean;
  message: any;
}> {
  try {
    const basicInfo = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/request/details?documentId=${requestId}`,
      {
        headers: {
          "Accept-Language": LOCALE_CODE[locale as keyof typeof LOCALE_CODE],
          Authorization: `Bearer ${session?.token}`,
        },
      }
    );

    return basicInfo.data;
  } catch (error) {
    console.error("Error while getting form data:", error);
    return {
      data: {
        documentTitle: "",
        hasBill: false,
        hasCertificate: false,
        documentStatus: null,
        certificateDetails: null,
        billDetails: null,
        form: null,
      },
      success: false,
      message: "Something went wrong",
    };
  }
}

export async function getCertificateDetails(
  requestId: number,
  session: Session
) {
  try {
    const resquestDetails = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/certificate/details-by-documentId/${requestId}`,
      {
        headers: {
          Authorization: `Bearer ${session?.token}`,
        },
      }
    );
  } catch (error) {
    console.error("Error while getting form data:", error);
    return {
      success: false,
      basicInfo: null,
    };
  }
}

export async function checkHasBill(requestId: number, session: Session) {
  try {
    const hasBill = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/bills/${requestId}/has-bill`,
      {
        headers: {
          Authorization: `Bearer ${session?.token}`,
        },
      }
    );
  } catch (error) {
    console.error("Error while getting form data:", error);
    return {
      success: false,
      basicInfo: null,
    };
  }
}

export async function getBillDetails(requestId: number, session: Session) {
  try {
    const Bill = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/bills/details/${requestId}`,
      {
        headers: {
          Authorization: `Bearer ${session?.token}`,
        },
      }
    );
  } catch (error) {
    console.error("Error while getting form data:", error);
    return {
      success: false,
      basicInfo: null,
    };
  }
}
