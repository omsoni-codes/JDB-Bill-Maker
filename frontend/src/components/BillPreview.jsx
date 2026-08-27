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
    <div
      id="bill-preview"
      className="bg-white shadow-xl rounded-lg mx-auto max-w-[900px] overflow-hidden ring-1 ring-slate-200 print:shadow-none print:max-w-none print:ring-0 print:rounded-none"
    >
      {/* Letterhead */}
      <div className="bg-gradient-to-b from-amber-100 to-amber-50 border-b-[6px] border-double border-amber-800 px-8 py-6">
        <div
          className="text-center text-sm text-amber-900 font-semibold tracking-wide mb-3"
          style={{ fontFamily: "'Noto Serif Devanagari', serif" }}
        >
          {"\u0965 \u091c\u092f \u0926\u0947\u0935 \u092c\u093e\u092c\u093e \u0965"}
        </div>
        <div className="flex items-center gap-6">
          <img
            src={LOGO_URL}
            alt="JDB Electricals logo"
            className="w-24 h-24 object-contain drop-shadow-sm shrink-0"
          />
          <div className="flex-1 text-center">
            <h1
              className="text-[42px] font-extrabold tracking-[0.15em] text-slate-900 leading-none"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {data.letterhead.firmName}
            </h1>
            <div className="text-xs text-slate-700 mt-2 italic">{data.letterhead.subLine}</div>
            <div className="text-sm font-semibold text-slate-800 mt-2">
              {data.letterhead.proprietor} <span className="mx-1 text-slate-400">|</span> {data.letterhead.designation}
            </div>
            <div className="text-xs text-slate-700 mt-1">{data.letterhead.address}</div>
          </div>
          <div className="w-24 shrink-0" />
        </div>
      </div>

      {/* Contact table */}
      <table className="w-full text-[11px] border-collapse">
        <tbody>
          <tr className="border-b border-slate-200">
            <td className="px-4 py-2 font-semibold bg-slate-50 border-r border-slate-200 w-[14%] text-slate-700 uppercase tracking-wide">Phone (Off.)</td>
            <td className="px-4 py-2 border-r border-slate-200 w-[36%] text-slate-800">{data.letterhead.phoneOff || "\u2014"}</td>
            <td className="px-4 py-2 font-semibold bg-slate-50 border-r border-slate-200 w-[14%] text-slate-700 uppercase tracking-wide">Mobile</td>
            <td className="px-4 py-2 text-slate-800">{[data.letterhead.mobile1, data.letterhead.mobile2].filter(Boolean).join(", ") || "\u2014"}</td>
          </tr>
          <tr>
            <td className="px-4 py-2 font-semibold bg-slate-50 border-r border-slate-200 text-slate-700 uppercase tracking-wide">E-mail</td>
            <td className="px-4 py-2 border-r border-slate-200 text-slate-800">{data.letterhead.email || "\u2014"}</td>
            <td className="px-4 py-2 font-semibold bg-slate-50 border-r border-slate-200 text-slate-700 uppercase tracking-wide">GSTIN</td>
            <td className="px-4 py-2 text-slate-800">{data.letterhead.gstin || "\u2014"}</td>
          </tr>
        </tbody>
      </table>

      {/* BILL heading */}
      <div className="relative flex items-center justify-center bg-gradient-to-r from-slate-900 to-slate-800 text-white px-6 py-3">
        <div className="tracking-[0.6em] font-bold text-lg">B I L L</div>
        <div
          className={`absolute right-5 top-1/2 -translate-y-1/2 px-3 py-1 rounded-full text-[11px] font-bold ${statusColor} shadow-md`}
        >
          {statusLabel}
        </div>
      </div>

      {/* Party + Bill details */}
      <div className="grid grid-cols-2 border-b border-slate-200">
        <div className="px-6 py-4 border-r border-slate-200 text-sm">
          <div className="text-[11px] text-slate-500 uppercase tracking-wider">To,</div>
          <div className="font-semibold text-slate-900 mt-0.5">{data.bill.partyName || "\u2014"}</div>
          {data.bill.partyAddress && (
            <div className="text-slate-700 whitespace-pre-line mt-0.5 leading-snug">{data.bill.partyAddress}</div>
          )}
          {data.bill.partyGstin && (
            <div className="text-xs text-slate-600 mt-1">
              <span className="font-semibold">GSTIN:</span> {data.bill.partyGstin}
            </div>
          )}
          <div className="mt-3 text-sm text-slate-700">
            <span className="font-semibold">Kind Attn. :</span> {data.bill.kindAttn || "\u2014"}
          </div>
        </div>
        <div className="px-6 py-4 text-sm space-y-1.5">
          <div className="flex">
            <span className="w-32 font-semibold text-slate-700">Bill No.</span>
            <span className="text-slate-900">{data.bill.billNo || "\u2014"}</span>
          </div>
          <div className="flex">
            <span className="w-32 font-semibold text-slate-700">Bill Date</span>
            <span className="text-slate-900">{formatDate(data.bill.billDate)}</span>
          </div>
          <div className="flex">
            <span className="w-32 font-semibold text-slate-700">Order Dated</span>
            <span className="text-slate-900">{formatDate(data.bill.orderDate)}</span>
          </div>
          {data.bill.dueDate && (
            <div className="flex">
              <span className="w-32 font-semibold text-slate-700">Payment Due</span>
              <span className="text-slate-900">{formatDate(data.bill.dueDate)}</span>
            </div>
          )}
        </div>
      </div>

      {data.bill.workDescription && (
        <div className="px-6 py-2.5 text-sm border-b border-slate-200 bg-amber-50/40">
          <span className="font-semibold text-slate-700">Work / Site: </span>
          <span className="text-slate-800">{data.bill.workDescription}</span>
        </div>
      )}

      {/* Amount summary */}
      <div className="px-6 py-6">
        <div className="rounded-xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="grid grid-cols-3 divide-x divide-slate-200">
            <div className="p-5 bg-gradient-to-br from-rose-50 to-white">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span className="text-[11px] text-slate-600 uppercase tracking-wider font-semibold">Total Bill</span>
                <span className="ml-auto px-1.5 py-0.5 rounded text-[9px] font-bold bg-rose-100 text-rose-700 border border-rose-200">
                  UNPAID
                </span>
              </div>
              <div className="mt-3 text-2xl font-extrabold text-slate-900 tracking-tight">₹ {fmtInr(total)}</div>
            </div>
            <div className="p-5 bg-gradient-to-br from-emerald-50 to-white">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="text-[11px] text-slate-600 uppercase tracking-wider font-semibold">Amount Paid</span>
                <span className="ml-auto px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">
                  PAID
                </span>
              </div>
              <div className="mt-3 text-2xl font-extrabold text-emerald-700 tracking-tight">₹ {fmtInr(paid)}</div>
            </div>
            <div className="p-5 bg-gradient-to-br from-amber-50 to-white">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                <span className="text-[11px] text-slate-600 uppercase tracking-wider font-semibold">Balance Due</span>
                <span className="ml-auto px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-200 text-amber-800 border border-amber-300">
                  DUE
                </span>
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
      <div className="grid grid-cols-2 border-t border-slate-200">
        <div className="px-6 py-4 border-r border-slate-200">
          <div className="inline-block bg-slate-900 text-white px-3 py-1 text-[10px] font-bold tracking-[0.15em] rounded">
            BANK DETAILS FOR PAYMENT
          </div>
          <div className="mt-3 text-sm space-y-1 text-slate-800 leading-relaxed">
            {data.bank.holder ? (
              <>
                <div>
                  <span className="font-semibold text-slate-700">A/C Holder:</span> {data.bank.holder}
                </div>
                <div>
                  <span className="font-semibold text-slate-700">Bank:</span> {data.bank.bankName}
                  {data.bank.branch && ` \u2014 ${data.bank.branch}`}
                </div>
                <div>
                  <span className="font-semibold text-slate-700">A/C No:</span> {data.bank.accountNumber}
                </div>
                <div>
                  <span className="font-semibold text-slate-700">IFSC:</span> {data.bank.ifsc}
                </div>
                {data.bank.upi && (
                  <div>
                    <span className="font-semibold text-slate-700">UPI:</span> {data.bank.upi}
                  </div>
                )}
              </>
            ) : (
              <div className="text-slate-500 text-xs italic">Add your bank / UPI details in the form.</div>
            )}
          </div>
        </div>
        <div className="px-6 py-4">
          <div className="inline-block bg-slate-900 text-white px-3 py-1 text-[10px] font-bold tracking-[0.15em] rounded">
            TERMS & NOTES
          </div>
          <ul className="mt-3 list-disc pl-5 text-xs text-slate-700 space-y-1 leading-relaxed">
            {notesList.map((line, i) => (
              <li key={i}>{line}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Signatures */}
      <div className="grid grid-cols-2 px-8 pt-24 pb-10 gap-10 relative">
        <div className="flex flex-col justify-end">
          <div className="border-t border-slate-400 pt-1.5 text-xs text-slate-700 text-center">
            {data.notes.signatureLabel}
          </div>
        </div>
        <div className="relative flex flex-col justify-end">
          <img
            src={SEAL_URL}
            alt="JDB Electricals Seal"
            className="absolute -top-20 left-1/2 -translate-x-1/2 w-32 h-32 object-contain opacity-80 pointer-events-none select-none"
            style={{ transform: "translateX(-50%) rotate(-10deg)" }}
          />
          <div className="border-t border-slate-400 pt-1.5 text-center">
            <div className="text-xs text-slate-700">Authorised Signatory</div>
            <div className="text-xs mt-1 text-slate-800">
              For <span className="font-bold">{data.notes.companyName}</span>
            </div>
            <div className="text-[10px] text-slate-600">
              {data.letterhead.subLine.split("\u2022")[0].trim()}
            </div>
            <div className="text-xs font-bold mt-0.5 text-slate-900">{data.letterhead.proprietor}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
