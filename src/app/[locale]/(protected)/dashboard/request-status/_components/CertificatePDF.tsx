"use client";

import { useEffect, useState } from "react";
import CertificatesService from "@/data/certificates-service";
import BillsService from "@/data/bills-service";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Download, FileText } from "lucide-react";
import { useTranslations } from "next-intl";

type CertificatePDFProps = {
  pdfData: {
    data?: string; // Base64 encoded data
    id?: number;
    guid?: string;
    type?: "certificate" | "bill";
  } | null;
};

const CertificatePDF = ({ pdfData }: CertificatePDFProps) => {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();
  const [dialogOpen, setDialogOpen] = useState(false);
  const t = useTranslations("RequestStatusPage");

  useEffect(() => {
    const fetchPdf = async () => {
      if (!pdfData) {
        setLoading(false);
        return;
      }

      try {
        // If we already have the PDF data as Base64 string
        if (pdfData.data) {
          // Convert Base64 to Blob
          const binaryData = atob(pdfData.data);
          const bytes = new Uint8Array(binaryData.length);
          for (let i = 0; i < binaryData.length; i++) {
            bytes[i] = binaryData.charCodeAt(i);
          }
          const blob = new Blob([bytes], { type: "application/pdf" });
          const url = URL.createObjectURL(blob);
          setPdfUrl(url);
        }
        // If we need to fetch the PDF
        else if (session && (pdfData.id || pdfData.guid)) {
          let response;

          if (pdfData.type === "bill" && pdfData.id) {
            response = await BillsService.generate(pdfData.id, session);
          } else if (pdfData.type === "certificate" && pdfData.id) {
            response = await CertificatesService.download(pdfData.id, session);
          } else if (pdfData.guid) {
            response = await CertificatesService.view(pdfData.guid, session);
          }

          if (response?.success && response.data) {
            // Convert Base64 to Blob
            const binaryData = atob(response.data);
            const bytes = new Uint8Array(binaryData.length);
            for (let i = 0; i < binaryData.length; i++) {
              bytes[i] = binaryData.charCodeAt(i);
            }
            const blob = new Blob([bytes], { type: "application/pdf" });
            const url = URL.createObjectURL(blob);
            setPdfUrl(url);
          }
        }
      } catch (error) {
        console.error("Error loading PDF:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPdf();

    // Clean up the object URL on unmount
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pdfData, session]);

  const handleDownload = () => {
    if (pdfUrl) {
      const link = document.createElement("a");
      link.href = pdfUrl;
      link.download = `certificate-${pdfData?.id || "document"}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-4">
        {t("loading_certificate")}
      </div>
    );
  }

  if (!pdfUrl) {
    return (
      <div className="flex justify-center items-center p-4">
        {t("noCertificate")}
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-3">
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="default" className="w-full">
            <FileText className="mr-2 w-4 h-4" />
            {t("view_certificate")}
          </Button>
        </DialogTrigger>

        <DialogContent className="p-0 w-[90vw] max-w-4xl h-[90vh] overflow-hidden">
          <iframe
            src={pdfUrl}
            className="mt-12 border-none w-full h-full"
            title="Certificate PDF"
          />
        </DialogContent>
      </Dialog>

      <Button variant="outline" className="w-full" onClick={handleDownload}>
        <Download className="mr-2 w-4 h-4" />
        {t("download_certificate")}
      </Button>
    </div>
  );
};

export default CertificatePDF;
