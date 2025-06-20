"use client";

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";

import { cn } from "@/lib/utils";

function Tabs({
  className,
  dir,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root> & { dir?: "rtl" | "ltr" }) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      dir={dir}
      className={cn("flex flex-col gap-2", className)}
      {...props}
    />
  );
}

function TabsList({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(
        "bg-muted text-muted-foreground inline-flex h-9 w-fit items-center justify-center rounded-lg p-[3px] [&[dir=rtl]]:flex-row-reverse",
        className
      )}
      {...props}
    />
  );
}

function TabsTrigger({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        "data-[state=active]:bg-background data-[state=active]:text-primary focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30 text-foreground dark:text-muted-foreground inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&[dir=rtl]_svg]:mr-1.5 [&[dir=rtl]_svg]:ml-0",
        className
      )}
      {...props}
    />
  );
}

function TabsContent({
  className,
  dir,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content> & {
  dir?: "rtl" | "ltr";
}) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      dir={dir}
      className={cn("flex-1 outline-none [&[dir=rtl]]:text-right", className)}
      {...props}
    />
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
