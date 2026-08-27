import React from "react";
import { Zap, Printer, RotateCcw, Download } from "lucide-react";
import { Button } from "./ui/button";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function Header({ totalBill, amountPaid, balance, onReset }) {
  const fmt = (n) => `\u20B9${Number(n || 0).toLocaleString("en-IN")}`;
  const status = balance <= 0 && totalBill > 0 ? "PAID" : balance > 0 && amountPaid > 0 ? "PARTIAL" : "UNPAID";
  const statusColor = status === "PAID" ? "bg-emerald-600" : status === "PARTIAL" ? "bg-amber-500" : "bg-rose-600";

  const downloadPdf = async () => {
    const el = document.getElementById("bill-preview");
    if (!el) return;
    const canvas = await html2canvas(el, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
      logging: false,
    });
    const imgData = canvas.toDataURL("image/jpeg", 0.95);
    const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    const pageW = pdf.internal.pageSize.getWidth();
    const pageH = pdf.internal.pageSize.getHeight();
    const imgW = pageW;
    const imgH = (canvas.height * imgW) / canvas.width;

    if (imgH <= pageH) {
      pdf.addImage(imgData, "JPEG", 0, 0, imgW, imgH);
    } else {
      // multi-page
      let position = 0;
      let heightLeft = imgH;
      while (heightLeft > 0) {
        pdf.addImage(imgData, "JPEG", 0, position, imgW, imgH);
        heightLeft -= pageH;
        if (heightLeft > 0) {
          pdf.addPage();
          position -= pageH;
        }
      }
    }
    pdf.save("JDB-Bill.pdf");
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
          <Button variant="outline" size="sm" onClick={() => window.print()}>
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
