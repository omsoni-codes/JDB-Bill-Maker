import React from "react";
import { Zap, Printer, RotateCcw, Download } from "lucide-react";
import { Button } from "./ui/button";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

// Compute the current payment status from totals
function computeStatus(totalBill, amountPaid, balance) {
  if (totalBill > 0 && balance <= 0) return "PAID";
  if (amountPaid > 0 && balance > 0) return "PARTIAL";
  return "UNPAID";
}

const STATUS_COLORS = {
  PAID: "bg-emerald-600",
  PARTIAL: "bg-amber-500",
  UNPAID: "bg-rose-600",
};

export default function Header({ totalBill, amountPaid, balance, onReset }) {
  const fmt = (n) => `\u20B9${Number(n || 0).toLocaleString("en-IN")}`;
  const status = computeStatus(totalBill, amountPaid, balance);
  const statusColor = STATUS_COLORS[status];

  const generateFittedPdf = async () => {
    const el = document.getElementById("bill-preview");
    if (!el) return null;
    const canvas = await html2canvas(el, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: "#ffffff",
      logging: false,
      letterRendering: true,
      windowWidth: el.scrollWidth,
      windowHeight: el.scrollHeight,
    });
    const imgData = canvas.toDataURL("image/jpeg", 0.95);
    const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    const pageW = pdf.internal.pageSize.getWidth();
    const pageH = pdf.internal.pageSize.getHeight();

    const margin = 6;
    const maxW = pageW - margin * 2;
    const maxH = pageH - margin * 2;
    const imgRatio = canvas.width / canvas.height;
    const boxRatio = maxW / maxH;

    let imgW, imgH;
    if (imgRatio > boxRatio) {
      imgW = maxW;
      imgH = maxW / imgRatio;
    } else {
      imgH = maxH;
      imgW = maxH * imgRatio;
    }

    const x = (pageW - imgW) / 2;
    const y = (pageH - imgH) / 2;
    pdf.addImage(imgData, "JPEG", x, y, imgW, imgH);
    return pdf;
  };

  const downloadPdf = async () => {
    const pdf = await generateFittedPdf();
    if (pdf) pdf.save("JDB-Bill.pdf");
  };

  // Direct browser print — scales the bill to fit ONE A4 page, then calls window.print()
  const printBill = () => {
    const el = document.getElementById("bill-preview");
    if (!el) return;

    // A4 portrait usable area with 8mm margins: 210-16=194mm wide, 297-16=281mm tall
    // Convert mm to px at 96dpi: 1mm = 3.7795px
    const MM = 3.7795;
    const maxHeightPx = 281 * MM;
    const maxWidthPx = 194 * MM;

    const rect = el.getBoundingClientRect();
    const scaleH = maxHeightPx / rect.height;
    const scaleW = maxWidthPx / rect.width;
    const scale = Math.min(1, scaleH, scaleW);

    el.setAttribute("data-print-scale", String(scale));
    el.style.setProperty("--print-scale", String(scale));

    // Trigger print
    setTimeout(() => {
      window.print();
      // Cleanup after
      setTimeout(() => {
        el.style.removeProperty("--print-scale");
        el.removeAttribute("data-print-scale");
      }, 500);
    }, 50);
  };

  return (
    <div className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200 shadow-sm print:hidden">
      <div className="flex items-center justify-between px-6 py-3 max-w-[1600px] mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-md">
            <Zap className="w-5 h-5 text-white" fill="white" />
          </div>
          <div>
            <div className="font-bold text-slate-900 leading-tight tracking-wide">JDB ELECTRICALS</div>
            <div className="text-[11px] text-slate-500 tracking-wide">Bill & Payment Receipt Maker</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={onReset}>
            <RotateCcw className="w-4 h-4 mr-1.5" /> Reset
          </Button>
          <Button variant="outline" size="sm" onClick={printBill}>
            <Printer className="w-4 h-4 mr-1.5" /> Print
          </Button>
          <Button size="sm" onClick={downloadPdf} className="bg-slate-900 hover:bg-slate-800">
            <Download className="w-4 h-4 mr-1.5" /> Download PDF
          </Button>
        </div>
      </div>
      <div className="border-t border-amber-100 bg-amber-50/70">
        <div className="flex flex-wrap items-center justify-between px-6 py-2 max-w-[1600px] mx-auto text-sm gap-x-8 gap-y-1">
          <div className="flex flex-wrap gap-x-8 gap-y-1 text-slate-700">
            <span className="flex items-center gap-1.5">
              <span className="text-[11px] text-slate-500 uppercase tracking-wider">Total</span>
              <strong className="text-slate-900">{fmt(totalBill)}</strong>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="text-[11px] text-slate-500 uppercase tracking-wider">Paid</span>
              <strong className="text-emerald-700">{fmt(amountPaid)}</strong>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="text-[11px] text-slate-500 uppercase tracking-wider">Balance</span>
              <strong className="text-rose-700">{fmt(balance)}</strong>
            </span>
          </div>
          <div className={`px-3 py-1 rounded-full text-[11px] font-bold text-white tracking-wider ${statusColor} shadow-sm`}>{status}</div>
        </div>
      </div>
    </div>
  );
}
