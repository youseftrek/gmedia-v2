/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

type DynamicColumnsProps = {
  component: any;
  componentKey: string;
  renderComponents: (
    components: any[],
    parentKey?: string,
    rowData?: any,
    rowIndex?: number
  ) => React.ReactNode;
  rowData?: any;
  rowIndex?: number;
};

const DynamicColumns = ({
  component,
  componentKey,
  renderComponents,
  rowData,
  rowIndex,
}: DynamicColumnsProps) => {
  return (
    <div className="gap-4 grid grid-cols-12">
      {component.columns.map((column: any, colIndex: number) => {
        // Calculate column width based on the width property or equal distribution
        const colWidth =
          column.width || Math.floor(12 / component.columns.length);
        return (
          <div
            key={`${componentKey}-col-${colIndex}`}
            className={`col-span-${colWidth}`}
            style={{
              gridColumn: `span ${colWidth} / span ${colWidth}`,
            }}
          >
            {column.components &&
              renderComponents(
                column.components,
                `${componentKey}-col-${colIndex}`,
                rowData,
                rowIndex
              )}
          </div>
        );
      })}
    </div>
  );
};

export default DynamicColumns;
