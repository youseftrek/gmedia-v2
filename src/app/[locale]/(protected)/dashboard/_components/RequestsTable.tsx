"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ColumnDef } from "@tanstack/react-table";
import {
  Eye,
  Pencil,
  Trash2,
  Download,
  Copy,
  FileText,
  Clock,
  AlertCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { ActionMenu } from "@/components/table/ActionMenu";
import { DataTable } from "@/components/table/Table";
import { cn } from "@/lib/utils";
import { Link } from "@/i18n/routing";
import { useLocale, useTranslations } from "next-intl";
import { TableSkeleton } from "./TableSkeleton";
import { fetchRequestsNeedActions } from "@/actions/dashboard-actions";
import { Session } from "@/lib/auth";

// Define type for draft items
interface DraftItem {
  id: number;
  statusId: number;
  documentId: number;
  createdDate: string;
  documentType: string;
  referenceNumber: string;
  status: string;
  color: string | null;
}

// Define types for the API response
interface DraftsResponse {
  success: boolean;
  data?: {
    items: DraftItem[];
    totalItems: number;
  };
  error?: string;
  message?: string;
}

interface RequestsTableProps {
  session: Session | null;
}

export default function RequestsTable({ session }: RequestsTableProps) {
  const t = useTranslations("DashboardPage");
  const [drafts, setDrafts] = useState<DraftsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const locale = useLocale();

  // Check session status
  const isAuthenticated = !!session;

  // Simplified pagination state
  const [currentPage, setCurrentPage] = useState(
    parseInt(searchParams.get("page") || "1", 10)
  );
  const [pageSize, setPageSize] = useState(
    parseInt(searchParams.get("size") || "10", 10)
  );
  const [totalPages, setTotalPages] = useState(1);

  // Update URL with pagination parameters
  const updateUrlWithPagination = useCallback(
    (page: number, size: number) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", page.toString());
      params.set("size", size.toString());
      router.push(`?${params.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );

  // Handle page change
  const handlePageChange = useCallback(
    (page: number) => {
      setCurrentPage(page);
      updateUrlWithPagination(page, pageSize);
    },
    [pageSize, updateUrlWithPagination]
  );

  // Handle page size change
  const handlePageSizeChange = useCallback(
    (size: number) => {
      // When changing page size, always reset to page 1
      setPageSize(size);
      setCurrentPage(1);
      updateUrlWithPagination(1, size);
    },
    [updateUrlWithPagination]
  );

  // Fetch drafts data using server action
  useEffect(() => {
    async function fetchDrafts() {
      if (!isAuthenticated || !session) return;

      try {
        setLoading(true);
        // Use the server action instead of direct API call
        const draftsData = await fetchRequestsNeedActions(
          session,
          currentPage,
          pageSize,
          locale
        );

        setDrafts(draftsData);

        if (draftsData.success && draftsData.data?.items) {
          const totalItems = draftsData.data.totalItems || 0;
          setTotalPages(Math.ceil(totalItems / pageSize));
        } else {
          console.error(
            "Error fetching drafts:",
            draftsData.error,
            draftsData.message
          );
          setError(draftsData.message || "Failed to load drafts");
        }
      } catch (err) {
        console.error("Exception while fetching drafts:", err);
        setError("An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    }

    fetchDrafts();
  }, [session, isAuthenticated, currentPage, pageSize, locale]);

  // Function to format date
  const formatDate = (dateString: string) => {
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

  // Function to handle action clicks
  const handleViewDraft = (draftId: number) => {
    console.log(`View draft ${draftId}`);
    // Implementation for view action
  };

  const handleEditDraft = (draftId: number) => {
    console.log(`Edit draft ${draftId}`);
    // Implementation for edit action
  };

  const handleDeleteDraft = (draftId: number) => {
    console.log(`Delete draft ${draftId}`);
    // Implementation for delete action
  };

  const handleDuplicateDraft = (draftId: number) => {
    console.log(`Duplicate draft ${draftId}`);
    // Implementation for duplicate action
  };

  const handleDownloadDraft = (draftId: number) => {
    console.log(`Download draft ${draftId}`);
    // Implementation for download action
  };

  // Define columns
  const columns = useMemo<ColumnDef<DraftItem>[]>(
    () => [
      {
        accessorKey: "documentId",
        header: t("Table.id"),
        cell: ({ row }) => {
          const id = row.getValue("documentId") as number;
          return (
            <Link
              href={`/dashboard/request-status/${id}`}
              className="flex items-center gap-2 hover:text-primary hover:underline"
            >
              <FileText className="w-4 h-4 text-muted-foreground" />
              <span className="font-medium">{id}</span>
            </Link>
          );
        },
      },
      {
        accessorKey: "documentType",
        header: t("Table.documentType"),
        cell: ({ row }) => {
          const type = row.getValue("documentType") as string;
          return (
            <div className="max-w-[300px] truncate" title={type}>
              {type}
            </div>
          );
        },
      },
      {
        accessorKey: "createdDate",
        header: t("Table.createdAt"),
        cell: ({ row }) => {
          const date = row.getValue("createdDate") as string;
          return (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="w-4 h-4" />
              {formatDate(date)}
            </div>
          );
        },
      },
      {
        accessorKey: "statusId",
        header: t("Table.status"),
        cell: ({ row }) => {
          const statusId = row.getValue("statusId") as number;
          const status = row.original.status;
          return (
            <Badge
              variant="secondary"
              className={cn(
                statusId === 41 &&
                  "bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-500",
                statusId === 19 &&
                  "bg-sky-500/10 hover:bg-sky-500/20 text-sky-500",
                statusId === 12 &&
                  "bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500",
                statusId === 16 &&
                  "bg-red-500/10 hover:bg-red-500/20 text-red-500",
                statusId === 14 &&
                  "bg-pink-500/10 hover:bg-pink-500/20 text-pink-500",
                "text-[10px]"
              )}
            >
              {status || "Unknown Status"}
            </Badge>
          );
        },
      },
      {
        id: "actions",
        cell: ({ row }) => {
          const draft = row.original;
          const actions = [
            {
              label: "View",
              onClick: () => handleViewDraft(draft.id),
              icon: <Eye className="w-4 h-4" />,
            },
            {
              label: "Edit",
              onClick: () => handleEditDraft(draft.id),
              icon: <Pencil className="w-4 h-4" />,
            },
            {
              label: "Duplicate",
              onClick: () => handleDuplicateDraft(draft.id),
              icon: <Copy className="w-4 h-4" />,
            },
            {
              label: "Download",
              onClick: () => handleDownloadDraft(draft.id),
              icon: <Download className="w-4 h-4" />,
            },
            {
              label: "Delete",
              onClick: () => handleDeleteDraft(draft.id),
              icon: <Trash2 className="w-4 h-4" />,
              variant: "destructive" as const,
            },
          ];
          return (
            <ActionMenu
              actions={actions}
              label="Actions"
              direction={locale === "ar" ? "rtl" : "ltr"}
            />
          );
        },
      },
    ],
    [locale, t]
  );

  // Get drafts data
  const draftsData = useMemo(() => {
    if (
      !drafts?.success ||
      !drafts.data?.items ||
      !Array.isArray(drafts.data.items)
    ) {
      return [];
    }

    return drafts.data.items;
  }, [drafts]);

  return (
    <div className="mt-8">
      <h2 className="mb-4 font-medium text-[#25155c] dark:text-white text-2xl">
        {t("RequestsNeedsActions.title")}
      </h2>

      {isAuthenticated ? (
        error ? (
          <Alert variant="destructive" className="max-w-md">
            <AlertCircle className="w-4 h-4" />
            <AlertTitle>Error Loading Drafts</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : loading ? (
          <TableSkeleton
            rowCount={pageSize > 5 ? 5 : pageSize}
            columnCount={4}
            showActions={true}
          />
        ) : !drafts?.success ||
          !Array.isArray(drafts.data?.items) ||
          drafts.data.items.length === 0 ? (
          <Card className="bg-background text-center">
            <CardContent className="pt-12 pb-12">
              <div className="mx-auto mb-4 w-12 h-12 text-muted-foreground">
                <FileText className="w-12 h-12" />
              </div>
              <CardTitle className="mb-1 text-lg">No drafts found</CardTitle>
              <p className="text-muted-foreground">
                You don&apos;t have any drafts saved at the moment.
              </p>
            </CardContent>
          </Card>
        ) : (
          <DataTable
            columns={columns}
            data={draftsData}
            totalItems={drafts.data.totalItems}
            pageCount={totalPages}
            onPageChange={handlePageChange}
            currentPage={currentPage}
            pageSize={pageSize}
            onPageSizeChange={handlePageSizeChange}
          />
        )
      ) : (
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="w-4 h-4" />
          <AlertTitle>Authentication Required</AlertTitle>
          <AlertDescription>
            Please sign in to view your drafts
          </AlertDescription>
        </Alert>
      )}

      {/* Debug information in development */}
      {process.env.NODE_ENV === "development" && (
        <details className="mt-8 p-2 border rounded">
          <summary className="font-medium cursor-pointer">
            Debug Information
          </summary>
          <div className="bg-gray-50 mt-2 p-4 rounded">
            <h3 className="mb-2 font-semibold">
              Session Status:{" "}
              {isAuthenticated ? "Authenticated" : "Unauthenticated"}
            </h3>
            <h3 className="mb-2 font-semibold">Drafts Response:</h3>
            <pre className="max-h-96 overflow-auto text-xs">
              {JSON.stringify(drafts, null, 2)}
            </pre>
          </div>
        </details>
      )}
    </div>
  );
}
