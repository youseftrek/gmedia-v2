"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslations } from "next-intl";
import { AlertCircle, CreditCard, Loader2 } from "lucide-react";
import BillsService from "@/data/bills-service";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Session } from "@/lib/auth";

interface PaymentCardProps {
  documentId: number;
  billDetails?: {
    billNumber?: string;
    amount?: string;
    createdDate?: string;
    expiryDate?: string;
  } | null;
  session?: Session;
}

export default function PaymentCard({
  documentId,
  billDetails,
  session,
}: PaymentCardProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const t = useTranslations("RequestStatusPage");

  const handlePayment = async () => {
    if (!session) {
      setError(t("session_required"));
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await BillsService.initiateAlRajihiPayment(
        documentId,
        session
      );

      console.log("Rajhi payment response:", JSON.stringify(res, null, 2));

      if (!res || !res.success) {
        console.error("Invalid response structure:", res);
        throw new Error("Payment initialization failed");
      }

      // Handle nested data structure - the actual payment data is in res.data.data
      const paymentData = res.data.data || res.data;

      console.log(
        "Payment data structure:",
        JSON.stringify(paymentData, null, 2)
      );
      console.log("Available keys in payment data:", Object.keys(paymentData));

      // Extract payment information
      const paymentUrl = paymentData.paymentUrl;
      const tranportalId = paymentData.tranportalId;
      const responseUrl = paymentData.responseUrl;
      const errorUrl = paymentData.errorUrl;

      console.log("Extracted payment data:", {
        paymentUrl: paymentUrl ? "Found" : "Not found",
        tranportalId: tranportalId ? "Found" : "Not found",
        responseUrl: responseUrl ? "Found" : "Not found",
        errorUrl: errorUrl ? "Found" : "Not found",
      });

      if (!paymentUrl) {
        console.error("Payment URL not found in response.");
        throw new Error("Payment URL not provided");
      }

      // Check if paymentUrl contains the expected trandata parameter
      if (!paymentUrl.includes("trandata=")) {
        console.error(
          "Payment URL does not contain trandata parameter:",
          paymentUrl
        );
        throw new Error("Invalid payment URL format");
      }

      // Extract trandata and base URL
      const parts = paymentUrl.split("trandata=");
      if (parts.length !== 2) {
        throw new Error("Could not extract trandata from payment URL");
      }

      const trandata = parts[1];
      const baseUrl = parts[0].endsWith("&") ? parts[0].slice(0, -1) : parts[0];

      // Create and submit the payment form
      const form = document.createElement("form");
      form.action = baseUrl;
      form.method = "POST";
      form.target = "_blank";

      // Add form fields
      form.innerHTML = `
        <input type="hidden" name="tranportalId" value="${tranportalId || ""}">
        <input type="hidden" name="responseURL" value="${responseUrl || ""}">
        <input type="hidden" name="errorURL" value="${errorUrl || ""}">
        <input type="hidden" name="trandata" value="${trandata}">
      `;

      document.body.appendChild(form);
      form.submit();

      // Remove the form from the DOM after submission
      setTimeout(() => {
        document.body.removeChild(form);
      }, 100);
    } catch (err) {
      console.error("Payment error:", err);

      // Provide more specific error messages based on the error
      if (err instanceof Error) {
        setError(`${t("payment_error")}: ${err.message}`);
      } else {
        setError(t("payment_error"));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-card h-fit">
      <CardHeader>
        <CardTitle className="font-semibold text-primary text-xl">
          {t("payment")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-4">
          {billDetails && (
            <div className="space-y-2 bg-muted/30 p-4 rounded-md">
              {billDetails.amount && (
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground text-sm">
                    {t("amount")}
                  </span>
                  <span className="font-semibold text-lg">
                    {billDetails.amount}
                  </span>
                </div>
              )}
              {billDetails.billNumber && (
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground text-sm">
                    {t("bill_number")}
                  </span>
                  <span>{billDetails.billNumber}</span>
                </div>
              )}
              {billDetails.expiryDate && (
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground text-sm">
                    {t("expiry_date")}
                  </span>
                  <span>{billDetails.expiryDate}</span>
                </div>
              )}
            </div>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="w-4 h-4" />
              <AlertTitle>{t("error")}</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button onClick={handlePayment} disabled={loading} className="w-full">
            {loading ? (
              <Loader2 className="mr-2 w-4 h-4 animate-spin" />
            ) : (
              <CreditCard className="mr-2 w-4 h-4" />
            )}
            {t("proceed_to_payment")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
