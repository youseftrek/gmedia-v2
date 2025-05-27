import { auth } from "@/auth";
import { AnimatedMultiStepper } from "@/components/MultiStep";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { getCertificate } from "@/data/get-certificate";
import { getRequestDetails } from "@/data/get-request-status";
import { BackButton } from "@/components/shared/BackButton";
import { AlertCircle, FileWarning } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { ReactNode } from "react";
import PaymentCard from "../_components/PaymentCard";
import { NoDataMessage } from "../_components/NoDataMessage";
import DocumentPDFs from "../_components/DocumentPDFs";
import { Button } from "@/components/ui/button";
import { Metadata } from "next";

// Add StatusBanner component
const StatusBanner = ({ statusId, t }: { statusId?: number; t: any }) => {
  // Default to under review if no statusId
  const status = !statusId ? 20 : statusId;

  // Return the appropriate banner based on status
  switch (status) {
    case 41: // Payment step
      return (
        <div className="w-full border border-amber-500/30 bg-amber-500/5 text-amber-700 p-4 rounded-md text-right">
          {t("statusCards.title")}
          {t("statusCards.pendingPayment")}
        </div>
      );
    case 21:
    case 20: // Under review
      return (
        <div className="w-full border border-blue-500/30 bg-blue-500/5 text-blue-700 p-4 rounded-md text-right">
          {t("statusCards.title")}
          {t("statusCards.underReview")}
        </div>
      );
    case 15: // Rejected
      return (
        <div className="w-full border border-red-500/30 bg-red-500/5 text-red-700 p-4 rounded-md text-right">
          {t("statusCards.title")}
          {t("statusCards.rejected")}
        </div>
      );
    case 42: // Success/Approved
      return (
        <div className="w-full border border-green-500/30 bg-green-500/5 text-green-700 p-4 rounded-md text-right">
          {t("statusCards.title")}
          {t("statusCards.approved")}
        </div>
      );
    default:
      return (
        <div className="w-full border border-blue-500/30 bg-blue-500/5 text-blue-700 p-4 rounded-md text-right">
          {t("statusCards.title")}
          {t("statusCards.underReview")}
        </div>
      );
  }
};

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Metadata");

  return {
    title: t("requestStatus.title"),
  };
}

type Props = {
  params: Promise<{ id: number; locale: string }>;
};

// Add helper function to get badge color class based on statusId
const getBadgeColorClass = (statusId?: number) => {
  if (!statusId) return "bg-blue-500/10 text-blue-700";

  switch (statusId) {
    case 41: // Payment step
      return "bg-amber-500/10 text-amber-700";
    case 21:
    case 20: // Under review
      return "bg-blue-500/10 text-blue-700";
    case 15: // Rejected
      return "bg-red-500/10 text-red-700";
    case 42: // Success/Approved
      return "bg-green-500/10 text-green-700";
    default:
      return "bg-blue-500/10 text-blue-700";
  }
};

// Update the RequestSummaryAndData component to include the status banner
const RequestSummaryAndData = ({
  res,
  locale,
  t,
}: {
  res: any;
  locale: string;
  t: any;
}) => (
  <div className="flex flex-col gap-4 w-full">
    {/* Add the status banner */}
    {"statusId" in res.data && (
      <StatusBanner statusId={res.data.statusId} t={t} />
    )}

    <Card className="bg-card">
      <CardHeader>
        <CardTitle className="font-semibold text-primary text-xl">
          {t("summary")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {res.data.documentTitle || res.data.documentStatus ? (
          <div className="gap-4 grid grid-cols-1 md:grid-cols-2 w-full">
            <div className="flex items-center gap-2">
              <Label>{t("service_type")}: </Label>
              <p>{res.data.documentTitle || t("noData")}</p>
            </div>
            <div className="flex items-center gap-2">
              <Label>{t("request_status")}: </Label>
              <p
                className={`px-4 py-1 rounded-full text-sm ${
                  "statusId" in res.data
                    ? getBadgeColorClass(res.data.statusId as number)
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {res.data.documentStatus || t("noData")}
              </p>
            </div>
          </div>
        ) : (
          <NoDataMessage
            message={t("noData")}
            description={t("noDataDescription")}
          />
        )}
      </CardContent>
    </Card>

    <Card className="bg-card px-5 py-0">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1" className="border-b-0">
          <AccordionTrigger className="font-semibold text-primary text-xl">
            {t("request_data")}
          </AccordionTrigger>
          <AccordionContent>
            {res.data.form ? (
              <FormDataDisplay formData={res.data.form} locale={locale} t={t} />
            ) : (
              <NoDataMessage
                message={t("noData")}
                description={t("noDataDescription")}
              />
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  </div>
);

interface FormData {
  formData: string | Record<string, unknown>;
  formDesigner?: string | Record<string, unknown>;
  formDesignerTranslation?: string | Record<string, unknown>;
  translations?: TranslationItem[];
}

interface TranslationItem {
  Keyword: string;
  En: string;
  Ar: string;
  Fr?: string;
  Type?: string;
}

interface FormDesignerComponent {
  key?: string;
  label?: string;
  components?: FormDesignerComponent[];
  columns?: FormDesignerColumn[];
  [key: string]: unknown;
}

interface FormDesignerColumn {
  components?: FormDesignerComponent[];
  [key: string]: unknown;
}

interface FormDesigner {
  components?: FormDesignerComponent[];
  [key: string]: unknown;
}

const FormDataDisplay = ({
  formData,
  locale = "en",
  t,
}: {
  formData: FormData;
  locale?: string;
  t: any;
}) => {
  if (!formData || !formData.formData) {
    return (
      <NoDataMessage
        message={t("noData")}
        description={t("detailedDataNotAvailable")}
      />
    );
  }

  // Parse form data
  let parsedData: Record<string, unknown> = {};
  try {
    parsedData =
      typeof formData.formData === "string"
        ? JSON.parse(formData.formData)
        : (formData.formData as Record<string, unknown>);
  } catch (error) {
    console.error("Failed to parse form data:", error);
    return (
      <NoDataMessage
        message={t("error_description")}
        description={t("tryAgainLater")}
      />
    );
  }

  // Parse translation data
  let translations: TranslationItem[] = [];
  try {
    const translationsData =
      formData.formDesignerTranslation || formData.translations;
    if (translationsData) {
      translations =
        typeof translationsData === "string"
          ? JSON.parse(translationsData)
          : (translationsData as TranslationItem[]);
    }
  } catch (error) {
    console.error("Failed to parse translations:", error);
  }

  // Parse form designer to get field definitions
  let formDesigner: FormDesigner | null = null;
  try {
    formDesigner =
      typeof formData.formDesigner === "string"
        ? JSON.parse(formData.formDesigner)
        : (formData.formDesigner as FormDesigner);
  } catch (error) {
    console.error("Failed to parse form designer:", error);
  }

  // Get form components if available
  const components = formDesigner?.components || [];

  // Create a map of field keys to their labels from the form designer
  const fieldLabelsMap = new Map<string, string>();
  const processComponent = (component: FormDesignerComponent) => {
    if (component.key && component.label) {
      fieldLabelsMap.set(component.key, component.label);
    }

    // Process child components if present
    if (component.components && Array.isArray(component.components)) {
      component.components.forEach(processComponent);
    }

    // Process columns if present
    if (component.columns && Array.isArray(component.columns)) {
      component.columns.forEach((column: FormDesignerColumn) => {
        if (column.components && Array.isArray(column.components)) {
          column.components.forEach(processComponent);
        }
      });
    }
  };

  components.forEach(processComponent);

  // Get the appropriate locale key for translations
  const defaultLocale = locale === "ar" ? "Ar" : "En";

  // Filter out empty values and typical non-display fields
  const filteredData = Object.entries(parsedData).filter(([key, value]) => {
    return (
      value !== null &&
      value !== undefined &&
      value !== "" &&
      !key.startsWith("_") &&
      key !== "confirmationIConfirmAllInformationIsAccurateAndComplete" &&
      key !== "feesAmount" &&
      !key.toLowerCase().endsWith("id") && // Filter out ID fields
      key !== "id"
    ); // Filter out id field
  });

  if (filteredData.length === 0) {
    return (
      <NoDataMessage
        message={t("noData")}
        description={t("detailedDataNotAvailable")}
      />
    );
  }

  // Function to get translated label for a key
  const getTranslatedLabel = (key: string): string => {
    // First try to find a translation in the translations array
    const translation = translations.find(
      (t) =>
        t.Keyword.toLowerCase() === key.toLowerCase() ||
        (fieldLabelsMap.get(key) &&
          t.Keyword.toLowerCase() === fieldLabelsMap.get(key)?.toLowerCase())
    );

    if (translation) {
      return translation[defaultLocale] || translation.En || key;
    }

    // If no translation found, use the form designer label if available
    if (fieldLabelsMap.has(key)) {
      return fieldLabelsMap.get(key) || key;
    }

    // Fallback to formatting the key
    return formatKey(key);
  };

  const formatKey = (key: string): string => {
    // Capitalize first letter and add spaces before capital letters
    return key
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase());
  };

  const renderValue = (value: unknown): ReactNode => {
    if (value === null || value === undefined) {
      return "-";
    }

    if (typeof value === "boolean") {
      return value ? t("yes") : t("no");
    }

    if (Array.isArray(value)) {
      // Handle arrays (like platforms, interests, etc.)
      if (value.length === 0) return "-";

      if (typeof value[0] === "object" && value[0] !== null) {
        // For complex objects like platforms array
        return (
          <div className="flex flex-col gap-3">
            {value.map((item, index) => {
              if (item === null || item === undefined) {
                return null;
              }

              if (typeof item !== "object") {
                return <div key={index}>{String(item)}</div>;
              }

              return (
                <div key={index} className="p-3 border rounded-md">
                  {Object.entries(item).map(([subKey, subValue]) => {
                    // Skip ID fields
                    if (
                      subKey === "id" ||
                      subKey.toLowerCase().endsWith("id")
                    ) {
                      return null;
                    }

                    // Handle nested objects with text property (like selections)
                    if (
                      subKey === "platform" &&
                      typeof subValue === "object" &&
                      subValue !== null
                    ) {
                      const platformLabel = getTranslatedLabel("Platform");
                      return (
                        <div key={subKey} className="flex gap-2">
                          <Label className="font-medium">
                            {platformLabel}:
                          </Label>
                          <span>
                            {(subValue as Record<string, string>).text || "-"}
                          </span>
                        </div>
                      );
                    }

                    // Handle special fields like interests
                    if (
                      subKey === "interests" &&
                      Array.isArray(subValue) &&
                      subValue.length > 0
                    ) {
                      const interestsLabel = getTranslatedLabel("Interests");
                      return (
                        <div key={subKey} className="flex gap-2 mt-1">
                          <Label className="font-medium">
                            {interestsLabel}:
                          </Label>
                          <span>
                            {(subValue as string[]).join(", ") || "-"}
                          </span>
                        </div>
                      );
                    }

                    // Skip accountImage for now
                    if (subKey === "accountImage") {
                      return null;
                    }

                    // Handle non-object values
                    if (typeof subValue !== "object" || subValue === null) {
                      const subKeyLabel = getTranslatedLabel(subKey);
                      return (
                        <div key={subKey} className="flex gap-2 mt-1">
                          <Label className="font-medium">{subKeyLabel}:</Label>
                          <span>{String(subValue) || "-"}</span>
                        </div>
                      );
                    }

                    // For other nested objects with text property
                    if (
                      subValue &&
                      typeof subValue === "object" &&
                      "text" in subValue
                    ) {
                      const subKeyLabel = getTranslatedLabel(subKey);
                      return (
                        <div key={subKey} className="flex gap-2 mt-1">
                          <Label className="font-medium">{subKeyLabel}:</Label>
                          <span>
                            {(subValue as Record<string, string>).text || "-"}
                          </span>
                        </div>
                      );
                    }

                    return null;
                  })}
                </div>
              );
            })}
          </div>
        );
      }

      return value.join(", ");
    }

    // Handle objects with text property (like dropdown selections)
    if (typeof value === "object" && value !== null) {
      if ("text" in value && "id" in value) {
        return String(value.text) || "-";
      }
      if ("text" in value) {
        return String(value.text) || "-";
      }

      // For other objects, try to display relevant fields
      const objEntries = Object.entries(
        value as Record<string, unknown>
      ).filter(([key]) => key !== "id" && !key.toLowerCase().endsWith("id"));

      if (objEntries.length === 0) {
        return "-";
      }

      return (
        <div className="flex flex-col gap-1">
          {objEntries.map(([key, val]) => (
            <div key={key} className="flex gap-2">
              <span className="font-medium">{formatKey(key)}:</span>
              <span>
                {typeof val === "object"
                  ? val && "text" in val
                    ? String(val.text)
                    : "-"
                  : String(val)}
              </span>
            </div>
          ))}
        </div>
      );
    }

    return String(value || "-");
  };

  return (
    <div className="gap-4 grid grid-cols-1 md:grid-cols-2">
      {filteredData.map(([key, value]) => {
        // Special handling for platforms or console selections
        if (key === "platforms" || key === "console") {
          const platformsLabel = getTranslatedLabel(key);
          return (
            <div className="col-span-2 mt-2" key={key}>
              <h3 className="mb-3 font-medium text-primary text-lg">
                {platformsLabel}
              </h3>
              {renderValue(value)}
            </div>
          );
        }

        // Handle dates with proper formatting
        if (
          key.toLowerCase().includes("date") &&
          typeof value === "string" &&
          value.includes("T")
        ) {
          try {
            const date = new Date(value);
            const formattedDate = new Intl.DateTimeFormat(
              locale === "ar" ? "ar-SA" : "en-US",
              {
                year: "numeric",
                month: "long",
                day: "numeric",
              }
            ).format(date);

            return (
              <div key={key} className="flex flex-col gap-1">
                <Label className="font-medium">{getTranslatedLabel(key)}</Label>
                <div className="bg-muted/30 p-2 rounded-md">
                  {formattedDate}
                </div>
              </div>
            );
          } catch (error) {
            console.error(`Error formatting date for ${key}:`, error);
            // Fallback to default rendering if date parsing fails
          }
        }

        // Regular fields
        return (
          <div key={key} className="flex flex-col gap-1">
            <Label className="font-medium">{getTranslatedLabel(key)}</Label>
            <div className="bg-muted/30 p-2 rounded-md">
              {renderValue(value)}
            </div>
          </div>
        );
      })}
    </div>
  );
};

// Add this component before the main Requeststatus component
const ReportCard = ({ t }: { t: any }) => (
  <Card className="bg-card w-full lg:w-1/4 h-fit">
    <CardHeader>
      <CardTitle className="font-semibold text-primary text-xl flex items-center gap-2">
        {t("report_issue")}
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="w-full flex items-center">
        <span className="w-fit aspect-square rounded-full bg-red-500/20 text-500 p-2 mb-2">
          <FileWarning className="w-8 h-8 text-destructive" />
        </span>
      </div>
      <p className="text-muted-foreground mb-4">{t("report_description")}</p>
      <Button variant="destructive" className="w-full">
        {t("submit_report")}
      </Button>
    </CardContent>
  </Card>
);

export default async function Requeststatus({ params }: Props) {
  const t = await getTranslations("RequestStatusPage");

  const { id, locale } = await params;
  const session = await auth();
  const res = await getRequestDetails(id, session!, locale);

  // Only call getCertificate if certificateDetails is not null
  let certificate = null;
  if (res.data?.certificateDetails?.id) {
    certificate = await getCertificate(
      res.data.certificateDetails.id,
      session!,
      locale
    );
  }

  // IF THERE IS AN ERROR
  if (res.success === false || res.data?.form === null) {
    return (
      <div className="flex justify-center items-center w-full h-[80vh]">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="w-4 h-4" />
          <AlertTitle>{t("error")}</AlertTitle>
          <AlertDescription>{t("error_description")}</AlertDescription>
        </Alert>
      </div>
    );
  }

  // Check if res.data is undefined or null
  if (!res.data) {
    return (
      <div className="flex justify-center items-center w-full h-[80vh]">
        <NoDataMessage
          message={t("noData")}
          description={t("noDataDescription")}
        />
      </div>
    );
  }

  // Check if the request is rejected
  const isRejected =
    res.data.documentStatus === "مرفوض" ||
    (typeof res.data.documentStatus === "string" &&
      res.data.documentStatus.toLowerCase() === "rejected");

  // Define steps dynamically based on whether the request is rejected or not
  const steps = isRejected
    ? [
        { title: t("steps.preparation") },
        { title: t("steps.payment") },
        { title: t("steps.under_review") },
        { title: t("steps.rejected"), color: "text-destructive" },
      ]
    : [
        { title: t("steps.preparation") },
        { title: t("steps.payment") },
        { title: t("steps.under_review") },
        { title: t("steps.completed") },
      ];

  return (
    <div className="flex flex-col gap-4 mx-auto w-full max-w-7xl">
      <div className="flex justify-between items-center p-2 md:p-3 lg:p-0 lg:py-4 border-b">
        <h2 className="font-semibold text-xl md:text-2xl">
          {res.data.documentTitle || t("untitled_request")}
        </h2>
        <BackButton fallbackPath="/dashboard/my-requests" label={t("back")} />
      </div>

      {/* Determine current step based on request state */}
      {(() => {
        let currentStep = 0;

        // Use statusId to determine the current step
        if ("statusId" in res.data && res.data.statusId) {
          switch (res.data.statusId) {
            case 41:
              currentStep = 1; // Payment step
              break;
            case 21:
            case 20:
              currentStep = 2; // Under review
              break;
            case 15:
              currentStep = 3; // Rejected (last step)
              break;
            case 42:
              currentStep = 3; // Success (last step)
              break;
            default:
              currentStep = 2; // Default to under review
          }
        } else {
          // Fallback to the old logic if statusId is not available
          if (isRejected) {
            currentStep = 3; // Last step in the rejected flow
          } else if (
            res.data.hasBill === false &&
            res.data.hasCertificate === false
          ) {
            currentStep = 2; // Under review
          } else if (
            res.data.hasBill === true &&
            res.data.hasCertificate === false
          ) {
            if (res.data.billDetails && res.data.billDetails.statusId === 1) {
              currentStep = 1; // Pending payment
            } else {
              currentStep = 2; // Under review
            }
          } else if (res.data.hasCertificate === true) {
            currentStep = 3; // Completed (last step in the normal flow)
          }
        }

        return (
          <AnimatedMultiStepper steps={steps} currentActiveStep={currentStep}>
            {(() => {
              // Only render content for the current step
              if (currentStep === 0) {
                return (
                  <div className="flex flex-col gap-4">
                    <RequestSummaryAndData res={res} locale={locale} t={t} />
                  </div>
                );
              } else if (currentStep === 1) {
                return (
                  <div className="flex md:flex-row flex-col gap-4 w-full">
                    <div
                      className={`flex flex-col gap-4 w-full ${
                        res.data.billDetails ? "md:w-3/4" : "md:w-full"
                      }`}
                    >
                      <RequestSummaryAndData res={res} locale={locale} t={t} />
                      <Card className="bg-card">
                        <CardHeader>
                          <CardTitle className="font-semibold text-primary text-xl">
                            {t("bill_data")}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          {res.data.billDetails ? (
                            <div className="gap-4 grid grid-cols-1 md:grid-cols-2 w-full">
                              <div className="flex items-center gap-2">
                                <Label>{t("bill_number")}: </Label>
                                <p>
                                  {res.data.billDetails.billNumber ||
                                    t("noDataYet")}
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                <Label>{t("amount")}: </Label>
                                <p>
                                  {res.data.billDetails.amount ||
                                    t("noDataYet")}
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                <Label>{t("created_date")}: </Label>
                                <p>
                                  {res.data.billDetails.createdDate ||
                                    t("noDataYet")}
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                <Label>{t("expiry_date")}: </Label>
                                <p>
                                  {res.data.billDetails.expiryDate ||
                                    t("noDataYet")}
                                </p>
                              </div>
                            </div>
                          ) : (
                            <NoDataMessage
                              message={t("noDataYet")}
                              description={t("billDetailsNotAvailable")}
                            />
                          )}
                        </CardContent>
                      </Card>
                    </div>
                    {res.data.billDetails && (
                      <div className="w-full md:w-1/4">
                        <PaymentCard
                          documentId={id}
                          billDetails={res.data.billDetails}
                          session={session!}
                        />
                      </div>
                    )}
                  </div>
                );
              } else if (currentStep === 2) {
                return (
                  <div className="flex flex-col gap-4">
                    <RequestSummaryAndData res={res} locale={locale} t={t} />
                  </div>
                );
              } else if (currentStep === 3) {
                // Last step - could be either completed or rejected
                if (isRejected) {
                  return (
                    <div className="flex flex-col lg:flex-row gap-4 w-full">
                      <div className="flex flex-col gap-4 w-full lg:w-3/4">
                        <RequestSummaryAndData
                          res={res}
                          locale={locale}
                          t={t}
                        />
                      </div>
                      <ReportCard t={t} />
                    </div>
                  );
                } else {
                  // Completed step (normal flow)
                  return (
                    <div className="flex flex-col lg:flex-row gap-4 w-full">
                      <div className="flex flex-col gap-4 w-full lg:w-3/4">
                        <RequestSummaryAndData
                          res={res}
                          locale={locale}
                          t={t}
                        />

                        <Card className="bg-card">
                          <CardHeader>
                            <CardTitle className="font-semibold text-primary text-xl">
                              {t("certificate_details")}
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            {res.data.certificateDetails ? (
                              <div className="gap-4 grid grid-cols-1 md:grid-cols-2 w-full">
                                <div className="flex items-center gap-2">
                                  <Label>{t("reference_number")}: </Label>
                                  <p>
                                    {res.data.certificateDetails
                                      .referenceNumber || t("noDataYet")}
                                  </p>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Label>{t("certificate_status")}: </Label>
                                  <p
                                    className={`px-4 py-1 rounded-full text-sm ${
                                      "statusId" in res.data
                                        ? getBadgeColorClass(
                                            res.data.statusId as number
                                          )
                                        : "bg-muted text-muted-foreground"
                                    }`}
                                  >
                                    {res.data.certificateDetails?.status ||
                                      t("noDataYet")}
                                  </p>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Label>{t("created_date")}: </Label>
                                  <p>
                                    {res.data.certificateDetails.createdDate ||
                                      t("noDataYet")}
                                  </p>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Label>{t("expiry_date")}: </Label>
                                  <p>
                                    {res.data.certificateDetails.expiryDate ||
                                      t("noDataYet")}
                                  </p>
                                </div>
                              </div>
                            ) : (
                              <NoDataMessage
                                message={t("noData")}
                                description={t(
                                  "certificateDetailsNotAvailable"
                                )}
                              />
                            )}
                          </CardContent>
                        </Card>
                      </div>
                      {/* Display both certificate and bill PDFs */}
                      <DocumentPDFs
                        showBillDownload={res.data.hasBill}
                        certificateDetails={res.data.certificateDetails}
                        certificateData={certificate}
                        billId={res.data.billDetails?.id || id}
                        session={session!}
                      />
                    </div>
                  );
                }
              }
            })()}
          </AnimatedMultiStepper>
        );
      })()}
    </div>
  );
}
