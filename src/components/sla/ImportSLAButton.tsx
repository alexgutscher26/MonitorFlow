/* eslint-disable react/jsx-no-undef */
"use client"
import { useState } from "react"
import { toast } from "@/components/ui/use-toast"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Loader2, Upload } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Fragment } from "react"

interface ImportSLAButtonProps {
  onImportComplete?: () => void
}

export function ImportSLAButton({ onImportComplete }: ImportSLAButtonProps) {
  const [isImporting, setIsImporting] = useState(false)

  const handleFileUpload = async (file: File, format: "json" | "csv") => {
    try {
      setIsImporting(true)
      const reader = new FileReader()

      reader.onload = async (e) => {
        try {
          let data
          if (format === "json") {
            data = JSON.parse(e.target?.result as string)
          } else {
            // Parse CSV
            const csvContent = e.target?.result as string
            const lines = csvContent.split("\n")
            const headers = lines[0]
              .split(",")
              .map((h) => h.trim().replace(/^"(.*)"$/, "$1"))

            data = lines.slice(1).map((line) => {
              const values = line
                .split(",")
                .map((v) => v.trim().replace(/^"(.*)"$/, "$1"))
              const entry: any = {}
              headers.forEach((header, index) => {
                if (header === "Target") {
                  entry.target = parseFloat(values[index])
                } else if (header === "Time Window") {
                  entry.timeWindow = values[index]
                } else if (header === "Category") {
                  const categoryMatch = values[index].match(/^(.*?)\s+(.*)$/)
                  if (categoryMatch) {
                    entry.category = {
                      emoji: categoryMatch[1],
                      name: categoryMatch[2],
                    }
                  }
                } else {
                  entry[header.toLowerCase()] = values[index]
                }
              })
              return entry
            })
          }

          // Send data to API
          const response = await fetch("/api/v1/sla/import", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ slas: data }),
          })

          if (!response.ok) {
            throw new Error(await response.text())
          }

          toast({
            title: "Success",
            description: "SLA configurations imported successfully",
          })

          onImportComplete?.()
        } catch (error) {
          console.error("Error processing file:", error)
          toast({
            title: "Error",
            description:
              error instanceof Error
                ? error.message
                : "Failed to process import file",
            variant: "destructive",
          })
        }
      }

      reader.readAsText(file)
    } catch (error) {
      console.error("Error importing SLAs:", error)
      toast({
        title: "Error",
        description: "Failed to import SLA configurations",
        variant: "destructive",
      })
    } finally {
      setIsImporting(false)
    }
  }

  const handleFileSelect = (format: "json" | "csv") => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = format === "json" ? ".json" : ".csv"
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        handleFileUpload(file, format)
      }
    }
    input.click()
  }

  return (
    <Fragment>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" disabled={isImporting}>
            {isImporting ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Upload className="h-4 w-4 mr-2" />
            )}
            {isImporting ? "Importing..." : "Import SLAs"}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => handleFileSelect("json")}>
            Import from JSON
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleFileSelect("csv")}>
            Import from CSV
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </Fragment>
  )
}
