/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type DynamicTabsProps = {
  component: any;
  componentKey: string;
  activeTab: string;
  setActiveTab: (value: string) => void;
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

const DynamicTabs = ({
  component,
  componentKey,
  activeTab,
  setActiveTab,
  renderComponents,
  getTranslation,
  rowData,
  rowIndex,
}: DynamicTabsProps) => {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList
        className="grid w-full"
        style={{
          gridTemplateColumns: `repeat(${component.components.length}, 1fr)`,
        }}
      >
        {component.components.map((tab: any) => (
          <TabsTrigger key={`tab-trigger-${tab.key}`} value={tab.key}>
            {getTranslation(tab.label)}
          </TabsTrigger>
        ))}
      </TabsList>
      {component.components.map((tab: any) => (
        <TabsContent key={`tab-content-${tab.key}`} value={tab.key}>
          {tab.components &&
            renderComponents(
              tab.components,
              `${componentKey}-tab-${tab.key}`,
              rowData,
              rowIndex
            )}
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default DynamicTabs;
