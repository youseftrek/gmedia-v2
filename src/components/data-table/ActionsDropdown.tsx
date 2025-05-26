/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, MoreHorizontal, Eye } from "lucide-react";

type ActionsDropdownProps = {
  onView?: (item: any) => void;
  onEdit?: (item: any) => void;
  onDelete?: (item: any) => void;
  item: any;
};

const ActionsDropdown = ({
  onView,
  onEdit,
  onDelete,
  item,
}: ActionsDropdownProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="hover:bg-muted p-0 w-8 h-8">
          <MoreHorizontal className="w-4 h-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" className="w-[140px]">
        {onView && (
          <DropdownMenuItem onClick={() => onView(item)}>
            <Eye className="mr-2 w-4 h-4" />
            <span>View</span>
          </DropdownMenuItem>
        )}
        {onEdit && (
          <>
            {onView && <DropdownMenuSeparator />}
            <DropdownMenuItem onClick={() => onEdit(item)}>
              <Pencil className="mr-2 w-4 h-4" />
              <span>Edit</span>
            </DropdownMenuItem>
          </>
        )}
        {onDelete && (
          <>
            {(onEdit || onView) && <DropdownMenuSeparator />}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <DropdownMenuItem
                  className="bg-red-500/10 focus:bg-red-500/20 text-red-500 focus:text-red-600"
                  onSelect={(e) => e.preventDefault()}
                >
                  <Trash2 className="mr-2 w-4 h-4" />
                  <span>Delete</span>
                </DropdownMenuItem>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    this record and remove it from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => onDelete(item)}
                    className="bg-destructive hover:bg-destructive/90 text-foreground"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ActionsDropdown;
