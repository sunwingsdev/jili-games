import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";

import { cn } from "@/lib/utils";

const Tabs = TabsPrimitive.Root;

const TabsList = React.forwardRef(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "flex w-full items-center justify-center", // Ensure flex container
      className
    )}
    {...props}
  />
));

TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = React.forwardRef(
  (
    {
      className,
      activeBgColor = "bg-[#2b2b2b]",
      activeTextColor = "text-white",
      ...props
    },
    ref
  ) => {
    return (
      <TabsPrimitive.Trigger
        ref={ref}
        className={cn(
          `flex-1 flex items-center justify-center whitespace-nowrap rounded-sm min-w-[74px] py-3 text-sm font-medium text-center ring-offset-background transition-all 
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50
          data-[state=active]:shadow-sm`,
          `data-[state=active]:${activeBgColor}`,
          `data-[state=active]:${activeTextColor}`,
          className
        )}
        {...props}
      />
    );
  }
);
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    )}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };
