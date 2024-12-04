"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Download, Loader2 } from "lucide-react";
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable';
import { toast } from "sonner";

interface SLAData {
  id: string;
  name: string;
  description?: string;
  target: number;
  timeWindow: string;
  category?: {
    name: string;
    emoji?: string;
  };
  measurements: {
    uptimePercent: number;
    endTime: Date;
  }[];
}

interface ExportSLAButtonProps {
  slas: SLAData[];
}

export function ExportSLAButton({ slas }: ExportSLAButtonProps) {
  const [isExporting, setIsExporting] = useState(false);

  const exportToCSV = async () => {
    try {
      setIsExporting(true);
      // Prepare CSV data
      const headers = ["Name", "Category", "Target", "Current Uptime", "Average Uptime", "Time Window", "Last Updated"];
      const rows = slas.map(sla => {
        const currentUptime = sla.measurements[0]?.uptimePercent.toFixed(2) || "N/A";
        const avgUptime = sla.measurements.length 
          ? (sla.measurements.reduce((acc, m) => acc + m.uptimePercent, 0) / sla.measurements.length).toFixed(2)
          : "N/A";
        const lastUpdated = sla.measurements[0]
          ? new Date(sla.measurements[0].endTime).toLocaleString()
          : "N/A";

        return [
          sla.name,
          `${sla.category?.emoji || "🎯"} ${sla.category?.name || "Uncategorized"}`,
          `${sla.target}%`,
          `${currentUptime}%`,
          `${avgUptime}%`,
          sla.timeWindow,
          lastUpdated
        ];
      });

      // Convert to CSV string
      const csvContent = [
        headers.join(","),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(","))
      ].join("\n");

      // Create and download file
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", `sla_report_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("CSV report exported successfully");
    } catch (error) {
      console.error("Error exporting CSV:", error);
      toast.error("Failed to export CSV report");
    } finally {
      setIsExporting(false);
    }
  };

  const exportToPDF = async () => {
    try {
      setIsExporting(true);
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.width;

      // Add title
      doc.setFontSize(20);
      doc.text("SLA Performance Report", pageWidth / 2, 20, { align: "center" });
      
      // Add date
      doc.setFontSize(12);
      doc.text(`Generated on: ${new Date().toLocaleString()}`, pageWidth / 2, 30, { align: "center" });

      // Prepare table data
      const tableData = slas.map(sla => {
        const currentUptime = sla.measurements[0]?.uptimePercent.toFixed(2) || "N/A";
        const avgUptime = sla.measurements.length 
          ? (sla.measurements.reduce((acc, m) => acc + m.uptimePercent, 0) / sla.measurements.length).toFixed(2)
          : "N/A";
        const lastUpdated = sla.measurements[0]
          ? new Date(sla.measurements[0].endTime).toLocaleString()
          : "N/A";

        return [
          `${sla.category?.emoji || "🎯"} ${sla.name}`,
          sla.category?.name || "Uncategorized",
          `${sla.target}%`,
          `${currentUptime}%`,
          `${avgUptime}%`,
          sla.timeWindow,
          lastUpdated
        ];
      });

      // Add table
      autoTable(doc, {
        head: [["Name", "Category", "Target", "Current", "Average", "Window", "Last Updated"]],
        body: tableData,
        startY: 40,
        headStyles: { fillColor: [37, 99, 235] },
        alternateRowStyles: { fillColor: [245, 247, 250] },
        margin: { top: 40 },
        styles: { overflow: "linebreak" },
      });

      // Save PDF
      doc.save(`sla_report_${new Date().toISOString().split('T')[0]}.pdf`);
      toast.success("PDF report exported successfully");
    } catch (error) {
      console.error("Error exporting PDF:", error);
      toast.error("Failed to export PDF report");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" disabled={isExporting}>
          {isExporting ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Download className="h-4 w-4 mr-2" />
          )}
          {isExporting ? "Exporting..." : "Export Report"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem 
          onClick={exportToCSV}
          disabled={isExporting}
        >
          Export as CSV
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={exportToPDF}
          disabled={isExporting}
        >
          Export as PDF
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
