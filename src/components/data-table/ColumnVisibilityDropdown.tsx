import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { ToggleRight } from "lucide-react";
import { Checkbox } from "../ui/checkbox";
import TooltipChildren from "../ui/TooltipChildren";

type ColumnVisibilityDropdownProps = {
  columns: string[]; // Array of column keys
  visibleColumns: Record<string, boolean>; // State of visible columns
  onToggleColumn: (key: string) => void; // Handler to toggle column visibility
  tooltipMessage: string;
};

const ColumnVisibilityDropdown = ({
  columns,
  visibleColumns,
  onToggleColumn,
  tooltipMessage = "Show/Hide Columns",
}: ColumnVisibilityDropdownProps) => {
  return (
    <DropdownMenu>
      <TooltipChildren message={tooltipMessage}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <ToggleRight />
          </Button>
        </DropdownMenuTrigger>
      </TooltipChildren>
      <DropdownMenuContent className="flex flex-col gap-2 w-auto">
        {columns.map((key) => (
          <div
            key={key}
            className="flex items-center gap-2 bg-secondary/50 hover:bg-secondary px-1 rounded-sm h-6 transition-all"
          >
            <Checkbox
              id={key}
              checked={visibleColumns[key]}
              onCheckedChange={() => onToggleColumn(key)}
            />
            <Label htmlFor={key} className="w-full cursor-pointer">
              {key}
            </Label>
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ColumnVisibilityDropdown;
