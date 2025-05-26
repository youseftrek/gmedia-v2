/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

type DynamicPanelProps = {
  component: any;
  componentKey: string;
  renderComponents: (
    components: any[],
    parentKey?: string,
    rowData?: any,
    rowIndex?: number
  ) => React.ReactNode;
  getTranslation: (keyword: string, type?: string) => string;
  rowData?: any;
  rowIndex?: number;
};

const DynamicPanel = ({
  component,
  componentKey,
  renderComponents,
  getTranslation,
  rowData,
  rowIndex,
}: DynamicPanelProps) => {
  return (
    <Card
      className={`${component.customClass || "pt-4"} ${
        component.theme ? `border-${component.theme}-200` : ""
      }`}
    >
      {!component.hideLabel && (
        <CardHeader
          className={component.collapsible ? "cursor-pointer" : ""}
          onClick={() => {
            if (component.collapsible) {
              // Toggle collapsed state
              const panelElement = document.getElementById(
                `panel-content-${componentKey}`
              );
              if (panelElement) {
                panelElement.classList.toggle("hidden");
              }
            }
          }}
        >
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>
                {getTranslation(component.title || component.label)}
              </CardTitle>
              {component.description && (
                <CardDescription>
                  {getTranslation(component.description)}
                </CardDescription>
              )}
            </div>
            {component.collapsible && (
              <div className="text-xl">
                {/* Collapsible indicator */}
                <span>▼</span>
              </div>
            )}
          </div>
        </CardHeader>
      )}
      <CardContent
        id={`panel-content-${componentKey}`}
        className={component.collapsed ? "hidden" : ""}
      >
        {component.components &&
          renderComponents(
            component.components,
            componentKey,
            rowData,
            rowIndex
          )}
      </CardContent>
    </Card>
  );
};

export default DynamicPanel;
