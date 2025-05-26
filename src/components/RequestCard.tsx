"use client";
import { PROTECTED_ROUTES } from "@/constants";
import { Link } from "@/i18n/routing";
import { cn, formatDate } from "@/lib/utils";
import { Clock, FileText } from "lucide-react";
import { useTranslations } from "next-intl";

type Props = {
  request: any;
  page?: "drafts" | "need-actions" | "closed" | "my-requests";
};

const RequestCard = ({ request, page }: Props) => {
  const t = useTranslations("DraftsPage");

  return (
    <div className="flex flex-col md:flex-row gap-2 px-4 py-4 bg-background border rounded-md">
      {/* ID */}
      <div className="flex flex-col gap-0.5 w-full md:w-[300px]">
        <span className="font-medium text-sm md:hidden">{t("Table.id")}:</span>
        <div className="flex items-center gap-1 font-medium text-base">
          <FileText className="w-4 h-4 text-muted-foreground shrink-0" />
          <Link
            href={
              page === "drafts"
                ? `${PROTECTED_ROUTES.DASHBOARD}/drafts/${request.id}`
                : page === "closed"
                ? `${PROTECTED_ROUTES.DASHBOARD}/request-status/${request.id}`
                : page === "need-actions"
                ? `${PROTECTED_ROUTES.DASHBOARD}/request-status/${request.documentId}`
                : page === "my-requests"
                ? `${PROTECTED_ROUTES.DASHBOARD}/request-status/${request.documentId}`
                : `${PROTECTED_ROUTES.DASHBOARD}/request-status/${request.id}`
            }
            className="hover:underline hover:text-primary duration-200 transition-all truncate"
          >
            {request.referenceNumber}
          </Link>
        </div>
      </div>

      {/* Document Type */}
      <div className="w-full md:w-[40%]">
        <span className="md:hidden text-sm font-medium block">
          {t("Table.documentType")}:
        </span>
        <p className="text-sm text-muted-foreground md:text-foreground md:font-medium">
          {request.documentType}
        </p>
      </div>

      {/* Created Date */}
      <div className="flex flex-col gap-0.5 w-full md:w-[25%]">
        <span className="font-medium text-sm md:hidden">
          {t("Table.createdAt")}:
        </span>
        <div className="flex items-center gap-1 text-muted-foreground text-sm">
          <Clock className="w-4 h-4" />
          <span>{formatDate(request.createdDate)}</span>
        </div>
      </div>

      {/* Status */}
      <div className="w-full md:w-[25%]">
        <span className="md:hidden text-sm font-medium block">
          {t("Table.status")}:
        </span>
        <span
          className="text-[11px] py-1 px-3 rounded-full"
          style={{
            backgroundColor: request.color ? `${request.color}10` : "#80808020",
            color: request.color || "var(--foreground)",
          }}
        >
          {request.status}
        </span>
      </div>
    </div>
  );
};

export default RequestCard;
