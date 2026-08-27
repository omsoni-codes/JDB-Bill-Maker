import React from "react";
import { LOGO_URL, SEAL_URL } from "../data/mock";
import { numberToIndianWords } from "../utils/numberToWords";
import { AlertCircle, CheckCircle2, Clock } from "lucide-react";

function formatDate(iso) {
  if (!iso) return "\u2014";
  const d = new Date(iso);
  if (isNaN(d)) return iso;
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yy = d.getFullYear();
  return `${dd}/${mm}/${yy}`;
}

function fmtInr(n) {
  return Number(n || 0).toLocaleString("en-IN");
}

export default function BillPreview({ data }) {
  const total = Number(data.amounts.totalBillAmount) || 0;
  const paid = Number(data.amounts.amountPaid) || 0;
  const balance = Math.max(total - paid, 0);
  const isPaid = balance <= 0 && total > 0;
  const isPartial = paid > 0 && balance > 0;

  const statusLabel = isPaid ? "PAID" : isPartial ? "PARTIAL" : "UNPAID";
  const statusColor = isPaid ? "bg-emerald-600" : isPartial ? "bg-amber-500" : "bg-rose-600";

  const notesList = (data.notes.lines || "").split("\n").filter((l) => l.trim().length);

  return (
    <div id="bill-preview" className="bg-white shadow-xl rounded-lg mx-auto max-w-[900px] overflow-hidden ring-1 ring-slate-200 print:shadow-none print:max-w-none print:ring-0 print:rounded-none">
      {/* Header/Letterhead */}
      <div className="bg-gradient-to-b from-amber-100 to-amber-50 border-b-[6px] border-double border-amber-800 px-6 py-5 text-center">
        <div className="text-sm text-amber-900 font-semibold tracking-wide" style={{ fontFamily: "'Noto Serif Devanagari', serif" }}>
          {"\u0965 \u091c\u092f \u0926\u0947\u0935 \u092c\u093e\u092c\u093e \u0965"}
        </div>
        <div className="flex items-center justify-center gap-5 mt-2">
          <img src={LOGO_URL} alt="JDB Electricals logo" className="w-20 h-20 object-contain drop-shadow-sm" />
          <div>
            <h1 className="text-4xl font-extrabold tracking-[0.15em] text-slate-900" style={{ fontFamily: "'Playfair Display', serif" }}>
              {data.letterhead.firmName}
            </h1>
            <div className="text-xs text-slate-700 mt-1 italic">{data.letterhead.subLine}</div>
            <div className="text-sm font-semibold text-slate-800 mt-1">
              {data.letterhead.proprietor} — {data.letterhead.designation}
            </div>
            <div className="text-xs text-slate-700">{data.letterhead.address}</div>
          </div>
        </div>
      </div>

      {/* Contact table */}
      <table className="w-full text-xs border-collapse">
        <tbody>
          <tr className="border-b border-slate-300">
            <td className="px-3 py-1.5 font-semibold bg-slate-50 border-r border-slate-300 w-[15%]">Phone (Off.)</td>
            <td className="px-3 py-1.5 border-r border-slate-300 w-[35%]">{data.letterhead.phoneOff || "\u2014"}</td>
            <td className="px-3 py-1.5 font-semibold bg-slate-50 border-r border-slate-300 w-[15%]">Mobile</td>
            <td className="px-3 py-1.5">{[data.letterhead.mobile1, data.letterhead.mobile2].filter(Boolean).join(", ")}</td>
          </tr>
          <tr>
            <td className="px-3 py-1.5 font-semibold bg-slate-50 border-r border-slate-300">E-mail</td>
            <td className="px-3 py-1.5 border-r border-slate-300">{data.letterhead.email || "\u2014"}</td>
            <td className="px-3 py-1.5 font-semibold bg-slate-50 border-r border-slate-300">GSTIN</td>
            <td className="px-3 py-1.5">{data.letterhead.gstin || "\u2014"}</td>
          </tr>
        </tbody>
      </table>

      {/* BILL heading */}
      <div className="flex items-center justify-between bg-gradient-to-r from-slate-900 to-slate-800 text-white px-5 py-2.5">
        <div className="tracking-[0.6em] font-bold text-lg">B I L L</div>
        <div className={`px-3 py-1 rounded-full text-xs font-bold ${statusColor} shadow-md`}>{statusLabel}</div>
      </div>

      {/* Party + Bill No */}
      <div className="grid grid-cols-2 border-b border-slate-300">
        <div className="px-4 py-3 border-r border-slate-300 text-sm">
          <div className="text-slate-600">To,</div>
          <div className="font-semibold text-slate-900">{data.bill.partyName || "\u2014"}</div>
          {data.bill.partyAddress && <div className="text-slate-700 whitespace-pre-line">{data.bill.partyAddress}</div>}
          {data.bill.partyGstin && <div className="text-xs text-slate-600 mt-1">GSTIN: {data.bill.partyGstin}</div>}
          <div className="mt-2">Kind Attn. :- {data.bill.kindAttn || "\u2014"}</div>
        </div>
        <div className="px-4 py-3 text-sm space-y-1">
          <div><span className="font-semibold">Bill No.:-</span> {data.bill.billNo || "\u2014"}</div>
          <div><span className="font-semibold">Bill Date:-</span> {formatDate(data.bill.billDate)}</div>
          <div><span className="font-semibold">Your Order Dated:-</span> {formatDate(data.bill.orderDate)}</div>
          {data.bill.dueDate && <div><span className="font-semibold">Payment Due:-</span> {formatDate(data.bill.dueDate)}</div>}
        </div>
      </div>

      {data.bill.workDescription && (
        <div className="px-4 py-2 text-sm border-b border-slate-300 bg-amber-50/40">
          <span className="font-semibold">Work / Site: </span>{data.bill.workDescription}
        </div>
      )}

      {/* Amount Summary (replaces items) */}
      <div className="px-6 py-6">
        <div className="rounded-xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="grid grid-cols-3 divide-x divide-slate-200">
            <div className="p-5 bg-gradient-to-br from-rose-50 to-white">
              <div className="flex items-center gap-2 text-slate-600 text-xs uppercase tracking-wider font-semibold">
                <AlertCircle className="w-4 h-4 text-rose-600" />
                Total Bill
                <span className="ml-auto px-1.5 py-0.5 rounded text-[9px] font-bold bg-rose-100 text-rose-700 border border-rose-200">UNPAID</span>
              </div>
              <div className="mt-3 text-2xl font-extrabold text-slate-900 tracking-tight">₹ {fmtInr(total)}</div>
            </div>
            <div className="p-5 bg-gradient-to-br from-emerald-50 to-white">
              <div className="flex items-center gap-2 text-slate-600 text-xs uppercase tracking-wider font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Amount Paid
                <span className="ml-auto px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">PAID</span>
              </div>
              <div className="mt-3 text-2xl font-extrabold text-emerald-700 tracking-tight">₹ {fmtInr(paid)}</div>
            </div>
            <div className="p-5 bg-gradient-to-br from-amber-50 to-white">
              <div className="flex items-center gap-2 text-slate-600 text-xs uppercase tracking-wider font-semibold">
                <Clock className="w-4 h-4 text-amber-600" />
                Balance Due
                <span className="ml-auto px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-200 text-amber-800 border border-amber-300">DUE</span>
              </div>
              <div className="mt-3 text-2xl font-extrabold text-rose-700 tracking-tight">₹ {fmtInr(balance)}</div>
            </div>
          </div>
        </div>

        <div className="mt-4 text-sm text-slate-700">
          <span className="font-semibold">Balance in words: </span>
          <span className="italic">{numberToIndianWords(balance)}</span>
        </div>
      </div>

      {/* Bank + Notes */}
      <div className="grid grid-cols-2 border-t border-slate-300">
        <div className="px-4 py-3 border-r border-slate-300">
          <div className="bg-slate-900 text-white px-3 py-1.5 text-xs font-bold tracking-wider inline-block rounded">BANK DETAILS FOR PAYMENT</div>
          <div className="mt-2 text-sm space-y-0.5">
            {data.bank.holder ? (
              <>
                <div><span className="font-semibold">A/C Holder:</span> {data.bank.holder}</div>
                <div><span className="font-semibold">Bank:</span> {data.bank.bankName} {data.bank.branch && `\u2014 ${data.bank.branch}`}</div>
                <div><span className="font-semibold">A/C No:</span> {data.bank.accountNumber}</div>
                <div><span className="font-semibold">IFSC:</span> {data.bank.ifsc}</div>
                {data.bank.upi && <div><span className="font-semibold">UPI:</span> {data.bank.upi}</div>}
              </>
            ) : (
              <div className="text-slate-500 text-xs italic">Add your bank / UPI details in the form.</div>
            )}
          </div>
        </div>
        <div className="px-4 py-3">
          <div className="text-sm font-bold text-slate-900">Terms & Notes</div>
          <ul className="list-disc pl-5 text-xs text-slate-700 mt-1 space-y-0.5">
            {notesList.map((line, i) => <li key={i}>{line}</li>)}
          </ul>
        </div>
      </div>

      {/* Signatures */}
      <div className="grid grid-cols-2 px-6 pt-20 pb-8 gap-8 relative">
        <div>
          <div className="border-t border-slate-400 pt-1 text-xs text-slate-700">{data.notes.signatureLabel}</div>
        </div>
        <div className="text-right relative">
          <img
            src={SEAL_URL}
            alt="JDB Electricals Seal"
            className="absolute -top-16 right-16 w-32 h-32 object-contain opacity-80 pointer-events-none select-none"
            style={{ transform: "rotate(-12deg)" }}
          />
          <div className="border-t border-slate-400 pt-1 text-xs text-slate-700">Authorised Signatory</div>
          <div className="text-xs mt-1">For <span className="font-bold">{data.notes.companyName}</span></div>
          <div className="text-[10px] text-slate-600">{data.letterhead.subLine.split("\u2022")[0].trim()}</div>
          <div className="text-xs font-bold mt-1">{data.letterhead.proprietor}</div>
        </div>
      </div>
    </div>
  );
}
