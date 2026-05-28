"use client";

import { Button } from "@/components/ui/button";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

interface ExportButtonsProps {
  title: string;
  filename: string;
  headers: string[];
  data: (string | number)[][];
  subtitle?: string;
}

export function ExportButtons({
  title,
  filename,
  headers,
  data,
  subtitle,
}: ExportButtonsProps) {
  const generatePDF = () => {
    const doc = new jsPDF();

    // Add title
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text(title, 14, 20);

    // Add subtitle if provided
    if (subtitle) {
      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
      doc.text(subtitle, 14, 28);
    }

    // Add table
    autoTable(doc, {
      head: [headers],
      body: data,
      startY: subtitle ? 35 : 30,
      theme: "grid",
      headStyles: {
        fillColor: [45, 55, 72],
        textColor: [255, 255, 255],
        fontStyle: "bold",
      },
      styles: {
        fontSize: 10,
        cellPadding: 3,
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
    });

    // Add footer with date
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.text(
        `Generated on ${new Date().toLocaleDateString("en-IN")} | Page ${i} of ${pageCount}`,
        14,
        doc.internal.pageSize.height - 10
      );
    }

    return doc;
  };

  const handleDownload = () => {
    const doc = generatePDF();
    doc.save(`${filename}.pdf`);
  };

  const handleShare = async () => {
    const doc = generatePDF();
    const pdfBlob = doc.output("blob");
    const file = new File([pdfBlob], `${filename}.pdf`, {
      type: "application/pdf",
    });

    if (navigator.share && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({
          title: title,
          text: subtitle || title,
          files: [file],
        });
      } catch (error) {
        // User cancelled or share failed, fallback to download
        if ((error as Error).name !== "AbortError") {
          handleDownload();
        }
      }
    } else {
      // Fallback: copy link or download
      handleDownload();
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="icon"
        onClick={handleShare}
        title="Share"
        className="h-9 w-9"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
          <polyline points="16 6 12 2 8 6" />
          <line x1="12" x2="12" y1="2" y2="15" />
        </svg>
        <span className="sr-only">Share</span>
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={handleDownload}
        title="Download PDF"
        className="h-9 w-9"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" x2="12" y1="15" y2="3" />
        </svg>
        <span className="sr-only">Download PDF</span>
      </Button>
    </div>
  );
}
