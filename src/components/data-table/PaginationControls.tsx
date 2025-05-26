import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

type PaginationControlsProps = {
  currentPage: number; // Current page number
  totalPages: number; // Total number of pages
  onPrevPage: () => void; // Handler for going to the previous page
  onNextPage: () => void; // Handler for going to the next page
  dataLength: number;
};

const PaginationControls = ({
  currentPage,
  totalPages,
  onPrevPage,
  onNextPage,
  dataLength = 0,
}: PaginationControlsProps) => {
  return (
    <div className="flex rtl:flex-row-reverse justify-between items-center mt-2">
      <div className="flex rtl:flex-row-reverse items-center gap-2">
        <Button
          className="flex rtl:flex-row-reverse items-center gap-1"
          size="sm"
          variant="outline"
          onClick={onPrevPage}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="rtl:rotate-180" />
          Previous
        </Button>
        <span>
          Page <span className="font-bold text-primary">{currentPage}</span> of{" "}
          {totalPages}
        </span>
        <Button
          className="flex rtl:flex-row-reverse items-center gap-1"
          size="sm"
          variant="outline"
          onClick={onNextPage}
          disabled={currentPage === totalPages}
        >
          Next
          <ChevronRight className="rtl:rotate-180" />
        </Button>
      </div>
      <p>
        <span className="font-bold text-primary">{dataLength} </span>
        {dataLength === 1 ? "Result" : "Results"}
      </p>
    </div>
  );
};

export default PaginationControls;
