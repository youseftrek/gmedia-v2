import { FileWarning } from "lucide-react";

interface NoDataMessageProps {
  message?: string;
  description?: string;
}

export const NoDataMessage = ({
  message = "There is no data provided",
  description = "The requested information is not available at this time.",
}: NoDataMessageProps) => (
  <div className="flex flex-col justify-center items-center p-8 text-center">
    <FileWarning className="mb-2 w-12 h-12 text-muted-foreground" />
    <h3 className="font-medium text-lg">{message}</h3>
    <p className="mt-1 text-muted-foreground text-sm">{description}</p>
  </div>
);
