/* eslint-disable react/jsx-no-undef */
"use client";
import * as React from "react";
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { Button } from "@/components/ui/button";
import { Loader2, Upload } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Fragment } from "react";
import { cn } from "@/utils";

interface ImportSLAButtonProps {
  onImportComplete?: () => void;
}

const DropdownMenuContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Content
    ref={ref}
    className={cn(
      "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    )}
    {...props}
  />
));
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName;

const DropdownMenuItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> & {
    inset?: boolean;
  }
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      inset && "pl-8",
      className
    )}
    {...props}
  />
));
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName;

export function ImportSLAButton({ onImportComplete }: ImportSLAButtonProps) {
  const [isImporting, setIsImporting] = useState(false);

  const handleFileUpload = async (file: File, format: "json" | "csv") => {
    try {
      setIsImporting(true);
      const reader = new FileReader();

      reader.onload = async (e) => {
        try {
          let data;
          if (format === "json") {
            data = JSON.parse(e.target?.result as string);
          } else {
            // Parse CSV
            const csvContent = e.target?.result as string;
            const lines = csvContent.split("\n");
            const headers = lines[0].split(",").map(h => h.trim().replace(/^"(.*)"$/, "$1"));
            
            data = lines.slice(1).map(line => {
              const values = line.split(",").map(v => v.trim().replace(/^"(.*)"$/, "$1"));
              const entry: any = {};
              headers.forEach((header, index) => {
                if (header === "Target") {
                  entry.target = parseFloat(values[index]);
                } else if (header === "Time Window") {
                  entry.timeWindow = values[index];
                } else if (header === "Category") {
                  const categoryMatch = values[index].match(/^(.*?)\s+(.*)$/);
                  if (categoryMatch) {
                    entry.category = {
                      emoji: categoryMatch[1],
                      name: categoryMatch[2]
                    };
                  }
                } else {
                  entry[header.toLowerCase()] = values[index];
                }
              });
              return entry;
            });
          }

          // Send data to API
          const response = await fetch("/api/v1/sla/import", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ slas: data }),
          });

          if (!response.ok) {
            throw new Error(await response.text());
          }

          toast({
            title: "Success",
            description: "SLA configurations imported successfully",
          });

          onImportComplete?.();
        } catch (error) {
          console.error("Error processing file:", error);
          toast({
            title: "Error",
            description: error instanceof Error ? error.message : "Failed to process import file",
            variant: "destructive",
          });
        }
      };

      reader.readAsText(file);
    } catch (error) {
      console.error("Error importing SLAs:", error);
      toast({
        title: "Error",
        description: "Failed to import SLA configurations",
        variant: "destructive",
      });
    } finally {
      setIsImporting(false);
    }
  };

  const handleFileSelect = (format: "json" | "csv") => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = format === "json" ? ".json" : ".csv";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        handleFileUpload(file, format);
      }
    };
    input.click();
  };

  return (
    <Fragment>
      <DropdownMenuPrimitive.Root>
        <DropdownMenuPrimitive.Trigger asChild>
          <Button variant="outline" size="sm" disabled={isImporting}>
            {isImporting ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Upload className="h-4 w-4 mr-2" />
            )}
            {isImporting ? "Importing..." : "Import SLAs"}
          </Button>
        </DropdownMenuPrimitive.Trigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => handleFileSelect("json")}>
            Import from JSON
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleFileSelect("csv")}>
            Import from CSV
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenuPrimitive.Root>
    </Fragment>
  );
}
