import React from "react";
import { Zap, Printer, RotateCcw } from "lucide-react";
import { Button } from "./ui/button";

export default function Header({ totalBill, amountPaid, balance, onReset }) {
  const fmt = (n) => `\u20B9${Number(n || 0).toLocaleString("en-IN")}`;
  const status = balance <= 0 && totalBill > 0 ? "PAID" : balance > 0 && amountPaid > 0 ? "PARTIAL" : "UNPAID";
  const statusColor = status === "PAID" ? "bg-emerald-600" : status === "PARTIAL" ? "bg-amber-500" : "bg-rose-600";

  return (
    <div className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm print:hidden">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-md">
            <Zap className="w-5 h-5 text-white" fill="white" />
          </div>
          <div>
            <div className="font-bold text-slate-900 leading-tight">JDB ELECTRICALS</div>
            <div className="text-xs text-slate-500">Bill & Payment Receipt Maker</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={onReset}>
            <RotateCcw className="w-4 h-4 mr-1" /> Reset
          </Button>
          <Button size="sm" onClick={() => window.print()} className="bg-slate-900 hover:bg-slate-800">
            <Printer className="w-4 h-4 mr-1" /> Print / PDF
          </Button>
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-between px-4 py-2 bg-amber-50 border-t border-amber-100 text-sm gap-x-6 gap-y-1">
        <div className="flex flex-wrap gap-x-6 gap-y-1 text-slate-700">
          <span>Total Bill: <strong className="text-slate-900">{fmt(totalBill)}</strong></span>
          <span>Amount Paid: <strong className="text-emerald-700">{fmt(amountPaid)}</strong></span>
          <span>Balance: <strong className="text-rose-700">{fmt(balance)}</strong></span>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${statusColor}`}>{status}</div>
      </div>
    </div>
  );
}
