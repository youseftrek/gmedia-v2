/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import type React from "react";

import {
  type Dispatch,
  type SetStateAction,
  useState,
  useRef,
  useEffect,
} from "react";
import { Controller } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { InfoIcon, Upload, X, FileIcon } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

type DynamicFileProps = {
  component: any;
  control: any;
  errors: any;
  getTranslation: (keyword: string, type?: string) => string;
  fileUploads: Record<string, File[]>;
  setFileUploads: Dispatch<SetStateAction<Record<string, File[]>>>;
  mode?: "edit" | "view";
};

// File object structure for form submission
interface FormattedFile {
  name: string;
  url: string;
  size: number;
  type: string;
  originalName: string;
  hash: string;
  id: string;
  file?: File | string | ArrayBuffer | null; // Can be File object, base64 string, ArrayBuffer, or null
  storage?: string;
  originalFile: File;
  base64Data?: string | ArrayBuffer | null;
}

const DynamicFile = ({
  component,
  control,
  errors,
  getTranslation,
  fileUploads,
  setFileUploads,
  mode = "edit",
}: DynamicFileProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const t = useTranslations("DynamicComponents.fileUpload");
  const commonT = useTranslations("common");

  // At the beginning of the DynamicFile component, add some debugging for gameCover
  useEffect(() => {
    // Special logging for gameCover field
    if (component.key === "gameCover") {
      console.log("GameCover component loaded:", component);
    }
  }, [component.key]);

  // Function to format a File object into the required structure
  const formatFileForForm = async (file: File): Promise<FormattedFile> => {
    // Generate a simple random ID without external dependencies
    const randomId = Math.random().toString(36).substring(2, 15);

    // Store the original file object directly
    // This is important - we need the actual File object for FormData submission
    const originalFile = file;

    // Log debugging info for specific component keys to help troubleshoot
    const specificKey =
      component.key.startsWith("copyOfCinemaDistributedLicense") ||
      component.key === "gameCover";

    if (specificKey) {
      console.log(
        `Formatting file for ${component.key}:`,
        file.name,
        file.size
      );
    }

    // Create a base64 representation of the file for storage if needed
    let fileData: string | ArrayBuffer | null = null;
    if (component.storage === "base64") {
      const reader = new FileReader();
      fileData = await new Promise<string | ArrayBuffer | null>((resolve) => {
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(file);
      });
    }

    const formattedFile = {
      name: `${file.name.split(".")[0]}-${randomId}.${file.name
        .split(".")
        .pop()}`,
      url: URL.createObjectURL(file), // Add URL for preview
      size: file.size,
      type: file.type,
      originalName: file.name,
      hash: randomId, // Simple hash
      id: `#${randomId}#`,
      // Store both the original file and the base64 data
      // The original file is crucial for FormData submission
      originalFile, // Add this to ensure we keep a reference to the actual File object
      file: originalFile, // Keep the original file object
      base64Data: fileData, // Store base64 data separately if available
      storage: component.storage || "base64",
    };

    return formattedFile;
  };

  // Validate file type against allowed types
  const validateFileType = (
    file: File,
    allowedTypes: string[] | undefined
  ): boolean => {
    // If no allowed types specified, all types are allowed
    if (!allowedTypes || allowedTypes.length === 0) {
      return true;
    }

    // Check if any allowed type matches the file's type
    return allowedTypes.some((type) => {
      // Handle wildcard types like image/*
      if (type.endsWith("/*")) {
        const category = type.split("/")[0];
        return file.type.startsWith(`${category}/`);
      }
      // Handle specific types
      return file.type.includes(type.replace("*", "")) || type === "*";
    });
  };

  // Extract and normalize file type constraints from component
  const normalizeFileTypes = (component: any): string[] => {
    if (!component.fileTypes || !Array.isArray(component.fileTypes)) {
      return [];
    }

    return component.fileTypes
      .map((type: { value: string }) => type.value)
      .filter(Boolean)
      .map((type: string) => type.trim().toLowerCase());
  };

  // Function to parse filePattern from component
  const parseFilePattern = (
    component: any
  ): { maxSize?: number; accept?: string[] } => {
    const result: { maxSize?: number; accept?: string[] } = {};

    // Extract max size if available
    if (component.fileMaxSize) {
      result.maxSize = Number(component.fileMaxSize) * 1024 * 1024; // Convert MB to bytes
    }

    // Extract accept patterns
    if (component.filePattern) {
      try {
        // Try to parse filePattern if it's a JSON string
        const pattern =
          typeof component.filePattern === "string"
            ? JSON.parse(component.filePattern)
            : component.filePattern;

        if (pattern && pattern.accept) {
          result.accept = Array.isArray(pattern.accept)
            ? pattern.accept
            : Object.values(pattern.accept).flat();
        }
      } catch (e) {
        console.warn("Failed to parse filePattern:", e);
      }
    }

    return result;
  };

  // Function to validate file size
  const validateFileSize = (file: File, maxSize?: number): boolean => {
    if (!maxSize) return true;
    return file.size <= maxSize;
  };

  return (
    <div className={`mb-6 w-full ${component.customClass || ""}`}>
      <Controller
        name={component.key}
        control={control}
        defaultValue={
          component.defaultValue || (component.multiple ? [] : null)
        }
        render={({ field }) => {
          // Special logging for gameCover field value from react-hook-form
          useEffect(() => {
            if (component.key === "gameCover") {
              console.log("Current gameCover value:", field.value);
            }
          }, [field.value, component.key]);

          const handleFileChange = async (
            e: React.ChangeEvent<HTMLInputElement>
          ) => {
            const files = e.target.files;
            if (!files || files.length === 0) return;

            // Special handling for gameCover
            const isGameCover = component.key === "gameCover";
            if (isGameCover) {
              console.log("GameCover file selected:", files[0].name);
            }

            // Parse file constraints from component
            const allowedTypes = normalizeFileTypes(component);
            const { maxSize } = parseFilePattern(component);

            // Create validation metrics
            let validCount = 0;
            let invalidTypeCount = 0;
            let invalidSizeCount = 0;

            if (component.multiple) {
              const fileList = Array.from(files);
              const validFiles: File[] = [];

              // Validate each file
              fileList.forEach((file) => {
                const isValidType = validateFileType(file, allowedTypes);
                const isValidSize = validateFileSize(file, maxSize);

                if (isValidType && isValidSize) {
                  validFiles.push(file);
                  validCount++;
                } else {
                  if (!isValidType) invalidTypeCount++;
                  if (!isValidSize) invalidSizeCount++;
                }
              });

              // Show appropriate warning messages
              if (invalidTypeCount > 0) {
                toast.warning(
                  t("invalidFileType", {
                    count: invalidTypeCount,
                    types: allowedTypes?.join(", "),
                  })
                );
              }

              if (invalidSizeCount > 0) {
                toast.warning(
                  t("fileTooLarge", {
                    count: invalidSizeCount,
                    size: maxSize
                      ? (maxSize / (1024 * 1024)).toFixed(1) + " MB"
                      : "",
                  })
                );
              }

              if (validFiles.length === 0) {
                return; // No valid files to process
              }

              // Convert files to binary and store in fileUploads for preview
              const binaryFiles = await Promise.all(
                validFiles.map(async (file) => {
                  const arrayBuffer = await file.arrayBuffer();
                  return new File([arrayBuffer], file.name, {
                    type: file.type,
                  });
                })
              );

              // Format files for form submission
              const formattedFiles = await Promise.all(
                binaryFiles.map(formatFileForForm)
              );

              // Update form value with formatted files
              field.onChange(formattedFiles);

              // Update fileUploads for preview
              setFileUploads((prev) => ({
                ...prev,
                [component.key]: [
                  ...(prev[component.key] || []),
                  ...binaryFiles,
                ],
              }));
            } else {
              const file = files[0];
              const isValidType = validateFileType(file, allowedTypes);
              const isValidSize = validateFileSize(file, maxSize);

              if (!isValidType) {
                toast.error(
                  t("invalidFileType", {
                    count: 1,
                    types: allowedTypes?.join(", "),
                  })
                );
                return;
              }

              if (!isValidSize) {
                toast.error(
                  t("fileTooLarge", {
                    count: 1,
                    size: maxSize
                      ? (maxSize / (1024 * 1024)).toFixed(1) + " MB"
                      : "",
                  })
                );
                return;
              }

              // Convert file to binary for preview
              const arrayBuffer = await file.arrayBuffer();
              const binaryFile = new File([arrayBuffer], file.name, {
                type: file.type,
              });

              // Format file for form submission
              const formattedFile = await formatFileForForm(binaryFile);

              // Update form value with formatted file
              field.onChange(formattedFile);

              // Update fileUploads for preview
              setFileUploads((prev) => ({
                ...prev,
                [component.key]: [binaryFile],
              }));
            }

            // Reset the file input to allow the same file to be selected again
            if (fileInputRef.current) {
              fileInputRef.current.value = "";
            }
          };

          const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
            e.preventDefault();
            e.stopPropagation();
            setIsDragging(true);
          };

          const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
            e.preventDefault();
            e.stopPropagation();
            setIsDragging(false);
          };

          const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
            e.preventDefault();
            e.stopPropagation();
            setIsDragging(false);

            const files = e.dataTransfer.files;
            if (!files || files.length === 0) return;

            // Special handling for gameCover
            const isGameCover = component.key === "gameCover";
            if (isGameCover) {
              console.log("GameCover file dropped:", files[0]?.name);
            }

            // Handle file type validation
            const allowedTypes = component.fileTypes
              ?.map((type: { value: string }) => type.value)
              .filter(Boolean);

            if (component.multiple) {
              const fileList = Array.from(files);
              const validFiles =
                allowedTypes && allowedTypes.length > 0
                  ? fileList.filter((file) =>
                      allowedTypes.some(
                        (type: string) =>
                          file.type.includes(type.replace("*", "")) ||
                          type === "*"
                      )
                    )
                  : fileList;

              if (validFiles.length !== fileList.length) {
                toast.warning(t("filesSkipped"));
              }

              // Convert files to binary for preview
              const binaryFiles = await Promise.all(
                validFiles.map(async (file) => {
                  const arrayBuffer = await file.arrayBuffer();
                  return new File([arrayBuffer], file.name, {
                    type: file.type,
                  });
                })
              );

              // Format files for form submission
              const formattedFiles = await Promise.all(
                binaryFiles.map(formatFileForForm)
              );

              // Update form value with formatted files
              field.onChange(formattedFiles);

              // Update fileUploads for preview
              setFileUploads((prev) => ({
                ...prev,
                [component.key]: [
                  ...(prev[component.key] || []),
                  ...binaryFiles,
                ],
              }));
            } else {
              const file = files[0];
              const isValidType =
                !allowedTypes ||
                allowedTypes.length === 0 ||
                allowedTypes.some(
                  (type: string) =>
                    file.type.includes(type.replace("*", "")) || type === "*"
                );

              if (isValidType) {
                // Convert file to binary for preview
                const arrayBuffer = await file.arrayBuffer();
                const binaryFile = new File([arrayBuffer], file.name, {
                  type: file.type,
                });

                // Format file for form submission
                const formattedFile = await formatFileForForm(binaryFile);

                // Update form value with formatted file
                field.onChange(formattedFile);

                // Update fileUploads for preview
                setFileUploads((prev) => ({
                  ...prev,
                  [component.key]: [binaryFile],
                }));
              } else {
                toast.error(
                  t("invalidFileType", {
                    count: 1,
                    types: allowedTypes?.join(", "),
                  })
                );
              }
            }

            // Reset the file input to allow the same file to be selected again
            if (fileInputRef.current) {
              fileInputRef.current.value = "";
            }
          };

          const removeFile = (index?: number) => {
            if (
              component.multiple &&
              typeof index === "number" &&
              Array.isArray(field.value)
            ) {
              const newFiles = [...field.value];
              newFiles.splice(index, 1);
              field.onChange(newFiles);

              const newUploads = fileUploads[component.key]
                ? [...fileUploads[component.key]]
                : [];
              newUploads.splice(index, 1);
              setFileUploads((prev) => ({
                ...prev,
                [component.key]: newUploads,
              }));
            } else {
              field.onChange(null);
              setFileUploads((prev) => ({
                ...prev,
                [component.key]: [],
              }));
            }

            // Reset the file input to allow the same file to be selected again
            if (fileInputRef.current) {
              fileInputRef.current.value = "";
            }
          };

          // Generate preview URL for image files
          const getPreviewUrl = (file: File): string | undefined => {
            if (file && file.type && file.type.includes("image/")) {
              return URL.createObjectURL(file);
            }
            return undefined;
          };

          // Get file type icon component based on file type
          const getFileTypeIcon = (file: File) => {
            if (!file || !file.type) return <FileIcon className="w-6 h-6" />;

            if (file.type.includes("pdf"))
              return <FileIcon className="w-6 h-6 text-red-500" />;
            if (file.type.includes("text/"))
              return <FileIcon className="w-6 h-6 text-blue-500" />;
            if (file.type.includes("application/"))
              return <FileIcon className="w-6 h-6 text-green-500" />;

            return <FileIcon className="w-6 h-6 text-gray-500" />;
          };

          const hasFiles =
            fileUploads[component.key] && fileUploads[component.key].length > 0;

          return (
            <div className="w-full">
              <Label className="flex items-center mb-2 font-medium">
                {getTranslation(component.label)}
                {component.validate?.required && (
                  <span className="ml-1 text-destructive">*</span>
                )}
                {component.tooltip && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="inline-flex ml-2 cursor-help">
                          <InfoIcon className="w-4 h-4 text-muted-foreground" />
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{getTranslation(component.tooltip)}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </Label>

              {component.description && (
                <p className="mb-3 text-muted-foreground text-sm">
                  {getTranslation(component.description)}
                </p>
              )}

              {/* Preview section */}
              {hasFiles && (
                <div className="mb-4">
                  <div className="gap-2 grid grid-cols-1">
                    {component.multiple
                      ? fileUploads[component.key].map(
                          (file: File, idx: number) => (
                            <div
                              key={idx}
                              className="group relative flex items-center gap-1 bg-muted/50 hover:bg-muted shadow-sm p-1 border border-border rounded-lg overflow-hidden transition-colors"
                            >
                              <div className="flex shrink-0 justify-center items-center bg-background border border-border/50 rounded-md w-12 h-12">
                                {getPreviewUrl(file) ? (
                                  <Image
                                    src={getPreviewUrl(file) || ""}
                                    alt={file.name}
                                    className="rounded-md w-full h-full object-cover"
                                    width={100}
                                    height={100}
                                  />
                                ) : (
                                  getFileTypeIcon(file)
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-sm truncate">
                                  {file.name}
                                </p>
                                <p className="text-muted-foreground text-xs">
                                  {(file.size / 1024).toFixed(1)}{" "}
                                  {t("fileSize")}
                                </p>
                              </div>
                              {mode !== "view" && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  type="button"
                                  onClick={() => removeFile(idx)}
                                  className="shrink-0 bg-red-500/10 hover:bg-red-500/20 opacity-70 hover:opacity-100 text-red-500"
                                >
                                  <X className="w-4 h-4" />
                                  <span className="sr-only">{t("remove")}</span>
                                </Button>
                              )}
                            </div>
                          )
                        )
                      : fileUploads[component.key][0] && (
                          <div className="group relative flex items-center bg-muted/50 hover:bg-muted shadow-sm p-3 border border-border rounded-lg overflow-hidden transition-colors">
                            <div className="flex shrink-0 justify-center items-center bg-background mr-3 border border-border/50 rounded-md w-12 h-12">
                              {getPreviewUrl(fileUploads[component.key][0]) ? (
                                <Image
                                  src={
                                    getPreviewUrl(
                                      fileUploads[component.key][0]
                                    ) || ""
                                  }
                                  alt={fileUploads[component.key][0].name}
                                  className="rounded-md w-full h-full object-cover"
                                  width={100}
                                  height={100}
                                />
                              ) : (
                                getFileTypeIcon(fileUploads[component.key][0])
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm truncate">
                                {fileUploads[component.key][0].name}
                              </p>
                              <p className="text-muted-foreground text-xs">
                                {(
                                  fileUploads[component.key][0].size / 1024
                                ).toFixed(1)}{" "}
                                {t("fileSize")}
                              </p>
                            </div>
                            {mode !== "view" && (
                              <Button
                                variant="ghost"
                                size="icon"
                                type="button"
                                onClick={() => removeFile()}
                                className="shrink-0 bg-red-500/10 hover:bg-red-500/20 opacity-70 hover:opacity-100 text-red-500"
                              >
                                <X className="w-4 h-4" />
                                <span className="sr-only">{t("remove")}</span>
                              </Button>
                            )}
                          </div>
                        )}
                  </div>
                </div>
              )}

              {/* Upload area - only show in edit mode */}
              {mode !== "view" && (
                <div
                  className={cn(
                    "flex flex-col justify-center items-center w-full p-8 border-2 rounded-lg transition-colors duration-200",
                    isDragging
                      ? "border-primary bg-primary/5 border-dashed"
                      : hasFiles
                      ? "border-gray-200 bg-muted/50"
                      : "border-dashed border-muted-foreground hover:border-primary/50 hover:bg-muted/50",
                    errors[component.key] &&
                      "border-destructive/50 bg-destructive/5"
                  )}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <Upload
                    className={cn(
                      "mb-3 w-12 h-12 transition-colors",
                      isDragging ? "text-primary" : "text-muted-foreground"
                    )}
                  />
                  <p className="mb-4 text-center">
                    <span className="block mb-1 font-medium text-base">
                      {isDragging ? t("dropFilesHere") : t("dragAndDrop")}
                    </span>
                    <span className="text-muted-foreground text-sm">
                      {t("or")} {t("selectFiles")}
                    </span>
                  </p>
                  <input
                    type="file"
                    id={component.key}
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleFileChange}
                    multiple={component.multiple}
                    accept={component.fileTypes
                      ?.map((type: any) => type.value)
                      .filter(Boolean)
                      .join(",")}
                  />
                  <label htmlFor={component.key} className="cursor-pointer">
                    <Button
                      type="button"
                      variant="default"
                      size="lg"
                      className="px-6 font-medium"
                      onClick={() =>
                        document.getElementById(component.key)?.click()
                      }
                    >
                      {t("browseFiles")}
                    </Button>
                  </label>
                  {component.fileTypes && component.fileTypes.length > 0 && (
                    <span className="mt-4 text-muted-foreground text-xs text-center">
                      {t("acceptedFileTypes")}:{" "}
                      {component.fileTypes
                        .map((type: any) => type.label || type.value)
                        .join(", ")}
                    </span>
                  )}
                </div>
              )}

              {errors[component.key] && (
                <p className="mt-2 text-destructive text-sm">
                  {errors[component.key]?.message ||
                    getTranslation(component.label, "required")}
                </p>
              )}

              {/* Add a special class for game cover previews */}
              {hasFiles && component.key === "gameCover" && (
                <div className="mt-2 text-sm text-blue-600">
                  {t("gameCoverReady")}
                </div>
              )}
            </div>
          );
        }}
      />
    </div>
  );
};

export default DynamicFile;
