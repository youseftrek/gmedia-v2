/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type DynamicHtmlElementProps = {
  component: any;
  getTranslation: (keyword: string, type?: string) => string;
};

const DynamicHtmlElement = ({
  component,
  getTranslation,
}: DynamicHtmlElementProps) => {
  const contentWithTranslations = getTranslation(component.content || "");

  // Process the HTML content based on component configuration
  const processedContent = component.refreshOnChange
    ? contentWithTranslations
    : contentWithTranslations;

  return (
    <Card
      className={cn(
        "mb-4 border-0 shadow-none",
        component.className,
        component.customClass
      )}
    >
      <CardContent className="p-0">
        <div
          className={component.className || ""}
          dangerouslySetInnerHTML={{ __html: processedContent }}
        />
      </CardContent>
    </Card>
  );
};

export default DynamicHtmlElement;
