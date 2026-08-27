import React from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Plus, Trash2 } from "lucide-react";

function Section({ title, children }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200">
      <div className="px-5 py-3 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white">
        <h3 className="font-semibold text-slate-800 text-xs tracking-[0.15em] uppercase">{title}</h3>
      </div>
      <div className="p-5 space-y-4">{children}</div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-[11px] font-medium text-slate-600 uppercase tracking-wide">{label}</Label>
      {children}
    </div>
  );
}

export default function FormPanel({ data, setData }) {
  const update = (section, key, value) =>
    setData((prev) => ({ ...prev, [section]: { ...prev[section], [key]: value } }));

  return (
    <div className="space-y-4">
      <Section title="Letterhead">
        <div className="grid grid-cols-1 gap-3">
          <Field label="Firm Name">
            <Input value={data.letterhead.firmName} onChange={(e) => update("letterhead", "firmName", e.target.value)} />
          </Field>
          <Field label="Sub-line">
            <Input value={data.letterhead.subLine} onChange={(e) => update("letterhead", "subLine", e.target.value)} />
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Proprietor">
            <Input value={data.letterhead.proprietor} onChange={(e) => update("letterhead", "proprietor", e.target.value)} />
          </Field>
          <Field label="Designation">
            <Input value={data.letterhead.designation} onChange={(e) => update("letterhead", "designation", e.target.value)} />
          </Field>
          <Field label="Phone (Off.)">
            <Input value={data.letterhead.phoneOff} onChange={(e) => update("letterhead", "phoneOff", e.target.value)} />
          </Field>
          <Field label="E-mail">
            <Input value={data.letterhead.email} onChange={(e) => update("letterhead", "email", e.target.value)} />
          </Field>
          <Field label="Mobile 1">
            <Input value={data.letterhead.mobile1} onChange={(e) => update("letterhead", "mobile1", e.target.value)} />
          </Field>
          <Field label="Mobile 2">
            <Input value={data.letterhead.mobile2} onChange={(e) => update("letterhead", "mobile2", e.target.value)} />
          </Field>
        </div>
        <Field label="Address">
          <Input value={data.letterhead.address} onChange={(e) => update("letterhead", "address", e.target.value)} />
        </Field>
        <Field label="Our GSTIN">
          <Input placeholder="23XXXXXXXXXXX2X" value={data.letterhead.gstin} onChange={(e) => update("letterhead", "gstin", e.target.value)} />
        </Field>
      </Section>

      <Section title="Bill Details">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Bill No.">
            <Input value={data.bill.billNo} onChange={(e) => update("bill", "billNo", e.target.value)} />
          </Field>
          <Field label="Bill Date">
            <Input type="date" value={data.bill.billDate} onChange={(e) => update("bill", "billDate", e.target.value)} />
          </Field>
          <Field label="Your Order Dated">
            <Input type="date" value={data.bill.orderDate} onChange={(e) => update("bill", "orderDate", e.target.value)} />
          </Field>
          <Field label="Payment Due Date">
            <Input type="date" value={data.bill.dueDate} onChange={(e) => update("bill", "dueDate", e.target.value)} />
          </Field>
        </div>
        <Field label="To (Party Name)">
          <Input value={data.bill.partyName} onChange={(e) => update("bill", "partyName", e.target.value)} />
        </Field>
        <Field label="Party Address / Site">
          <Textarea rows={2} value={data.bill.partyAddress} onChange={(e) => update("bill", "partyAddress", e.target.value)} />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Party GSTIN">
            <Input value={data.bill.partyGstin} onChange={(e) => update("bill", "partyGstin", e.target.value)} />
          </Field>
          <Field label="Kind Attn.">
            <Input value={data.bill.kindAttn} onChange={(e) => update("bill", "kindAttn", e.target.value)} />
          </Field>
        </div>
        <Field label="Work / Site description">
          <Textarea rows={2} value={data.bill.workDescription} onChange={(e) => update("bill", "workDescription", e.target.value)} />
        </Field>
      </Section>

      <Section title="Payments Received">
        <div className="space-y-2">
          <Field label="Total Bill Amount (₹)">
            <Input
              type="number"
              min="0"
              value={data.amounts.totalBillAmount}
              onChange={(e) => update("amounts", "totalBillAmount", parseFloat(e.target.value) || 0)}
            />
          </Field>
        </div>

        <div className="border-t border-slate-200 pt-4 space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-[11px] font-medium text-slate-600 uppercase tracking-wide">
              Payments (Part 1, Part 2, Advance…)
            </Label>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => {
                const list = Array.isArray(data.amounts.payments) ? data.amounts.payments : [];
                const nextNum = list.length + 1;
                const today = new Date().toISOString().slice(0, 10);
                const item = {
                  id: `p_${Date.now()}`,
                  label: `Part ${nextNum}`,
                  date: today,
                  amount: 0,
                };
                update("amounts", "payments", [...list, item]);
              }}
              className="h-7 px-2 text-xs"
            >
              <Plus className="w-3 h-3 mr-1" /> Add payment
            </Button>
          </div>

          {(!data.amounts.payments || data.amounts.payments.length === 0) && (
            <div className="text-xs text-slate-500 italic py-2">
              No payments yet. Click "Add payment" to record Part 1, Part 2, or an advance.
            </div>
          )}

          <div className="space-y-2">
            {(data.amounts.payments || []).map((p, idx) => (
              <div
                key={p.id}
                className="grid grid-cols-[1fr_1fr_1fr_auto] gap-2 items-end p-2 rounded-lg bg-slate-50 border border-slate-200"
              >
                <div className="space-y-1">
                  <div className="text-[10px] text-slate-500 uppercase">Label</div>
                  <Input
                    value={p.label}
                    onChange={(e) => {
                      const list = [...data.amounts.payments];
                      list[idx] = { ...p, label: e.target.value };
                      update("amounts", "payments", list);
                    }}
                    className="h-8 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <div className="text-[10px] text-slate-500 uppercase">Date</div>
                  <Input
                    type="date"
                    value={p.date}
                    onChange={(e) => {
                      const list = [...data.amounts.payments];
                      list[idx] = { ...p, date: e.target.value };
                      update("amounts", "payments", list);
                    }}
                    className="h-8 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <div className="text-[10px] text-slate-500 uppercase">Amount (₹)</div>
                  <Input
                    type="number"
                    min="0"
                    value={p.amount}
                    onChange={(e) => {
                      const list = [...data.amounts.payments];
                      list[idx] = { ...p, amount: parseFloat(e.target.value) || 0 };
                      update("amounts", "payments", list);
                    }}
                    className="h-8 text-xs"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const list = data.amounts.payments.filter((_, i) => i !== idx);
                    update("amounts", "payments", list);
                  }}
                  className="h-8 w-8 flex items-center justify-center rounded text-slate-400 hover:text-rose-600 hover:bg-white transition-colors"
                  aria-label="Remove payment"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="text-xs text-slate-500 pt-1">
            Amount Paid and Balance Due are calculated automatically from the payments above.
          </div>
        </div>
      </Section>

      <Section title="Bank Account (where payment is received)">
        <Field label="Account Holder Name">
          <Input value={data.bank.holder} onChange={(e) => update("bank", "holder", e.target.value)} />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Bank Name">
            <Input value={data.bank.bankName} onChange={(e) => update("bank", "bankName", e.target.value)} />
          </Field>
          <Field label="Branch">
            <Input value={data.bank.branch} onChange={(e) => update("bank", "branch", e.target.value)} />
          </Field>
          <Field label="Account Number">
            <Input value={data.bank.accountNumber} onChange={(e) => update("bank", "accountNumber", e.target.value)} />
          </Field>
          <Field label="IFSC Code">
            <Input value={data.bank.ifsc} onChange={(e) => update("bank", "ifsc", e.target.value)} />
          </Field>
        </div>
        <Field label="UPI ID">
          <Input value={data.bank.upi} onChange={(e) => update("bank", "upi", e.target.value)} />
        </Field>
      </Section>

      <Section title="Notes & Signature">
        <Field label="Notes (one per line)">
          <Textarea rows={4} value={data.notes.lines} onChange={(e) => update("notes", "lines", e.target.value)} />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Customer signature label">
            <Input value={data.notes.signatureLabel} onChange={(e) => update("notes", "signatureLabel", e.target.value)} />
          </Field>
          <Field label="Customer / Company name">
            <Input value={data.notes.companyName} onChange={(e) => update("notes", "companyName", e.target.value)} />
          </Field>
        </div>
      </Section>
    </div>
  );
}
