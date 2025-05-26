"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CertificatePDF from "./CertificatePDF";
import { useTranslations } from "next-intl";
import { Session } from "next-auth";
import { NoDataMessage } from "./NoDataMessage";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Download, FileText } from "lucide-react";
import { useEffect, useState } from "react";
import BillsService from "@/data/bills-service";

interface DocumentPDFsProps {
  certificateDetails?: {
    id: number;
    referenceNumber?: string;
    status?: string;
    createdDate?: string;
    expiryDate?: string;
  } | null;
  certificateData?: any;
  billId?: number;
  session: Session;
  showBillDownload: boolean;
}

export default function DocumentPDFs({
  certificateDetails,
  certificateData,
  billId,
  session,
  showBillDownload,
}: DocumentPDFsProps) {
  const t = useTranslations("RequestStatusPage");
  const [billPdfUrl, setBillPdfUrl] = useState<string | null>(null);
  const [billLoading, setBillLoading] = useState(true);
  const [billDialogOpen, setBillDialogOpen] = useState(false);

  console.log("dataadad: ", certificateData);

  useEffect(() => {
    // Fetch bill PDF
    const fetchBillPdf = async () => {
      if (!billId) {
        setBillLoading(false);
        return;
      }

      try {
        const response = await BillsService.generate(billId, session);

        if (response?.success && response.data) {
          // Convert Base64 to Blob
          const binaryData = atob(response.data);
          const bytes = new Uint8Array(binaryData.length);
          for (let i = 0; i < binaryData.length; i++) {
            bytes[i] = binaryData.charCodeAt(i);
          }
          const blob = new Blob([bytes], { type: "application/pdf" });
          const url = URL.createObjectURL(blob);
          setBillPdfUrl(url);
        }
      } catch (error) {
        console.error("Error fetching bill PDF:", error);
      } finally {
        setBillLoading(false);
      }
    };

    fetchBillPdf();

    // Clean up the object URL on unmount
    return () => {
      if (billPdfUrl) {
        URL.revokeObjectURL(billPdfUrl);
      }
    };
  }, [billId, session]);

  const handleBillDownload = () => {
    if (billPdfUrl) {
      const link = document.createElement("a");
      link.href = billPdfUrl;
      link.download = `bill-${billId || "document"}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full lg:w-1/4">
      {/* Certificate PDF */}
      <Card className="bg-card w-full">
        <CardHeader>
          <CardTitle className="font-semibold text-primary text-lg">
            {t("certificate_document")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {certificateDetails ? (
            <CertificatePDF
              pdfData={{
                id: certificateDetails?.id,
                type: "certificate",
                data: certificateData?.success
                  ? certificateData.data
                  : undefined,
              }}
            />
          ) : (
            <NoDataMessage message={t("noCertificate")} />
          )}
        </CardContent>
      </Card>

      {/* Bill PDF */}
      {showBillDownload && (
        <Card className="bg-card w-full">
          <CardHeader>
            <CardTitle className="font-semibold text-primary text-lg">
              {t("bill_data")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {billId ? (
              billLoading ? (
                <div className="flex justify-center items-center p-4">
                  {t("loading_certificate")}
                </div>
              ) : billPdfUrl ? (
                <div className="flex flex-col space-y-3">
                  <Dialog
                    open={billDialogOpen}
                    onOpenChange={setBillDialogOpen}
                  >
                    <DialogTrigger asChild>
                      <Button variant="default" className="w-full">
                        <FileText className="mr-2 w-4 h-4" />
                        {t("view_bill")}
                      </Button>
                    </DialogTrigger>

                    <DialogContent className="p-0 w-[90vw] max-w-4xl h-[90vh] overflow-hidden">
                      <iframe
                        src={billPdfUrl}
                        className="mt-12 border-none w-full h-full"
                        title="Bill PDF"
                      />
                    </DialogContent>
                  </Dialog>

                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={handleBillDownload}
                  >
                    <Download className="mr-2 w-4 h-4" />
                    {t("download_bill")}
                  </Button>
                </div>
              ) : (
                <NoDataMessage message={t("noDataYet")} />
              )
            ) : (
              <NoDataMessage message={t("noDataYet")} />
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
