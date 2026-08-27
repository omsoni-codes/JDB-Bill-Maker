import React from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";

function Section({ title, children }) {
  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-200 bg-slate-50">
        <h3 className="font-semibold text-slate-800">{title}</h3>
      </div>
      <div className="p-4 space-y-3">{children}</div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div className="space-y-1">
      <Label className="text-xs text-slate-600">{label}</Label>
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

      <Section title="Payment Summary">
        <div className="grid grid-cols-1 gap-3">
          <Field label="Total Bill Amount (₹)">
            <Input type="number" min="0" value={data.amounts.totalBillAmount} onChange={(e) => update("amounts", "totalBillAmount", parseFloat(e.target.value) || 0)} />
          </Field>
          <Field label="Amount Paid (₹)">
            <Input type="number" min="0" value={data.amounts.amountPaid} onChange={(e) => update("amounts", "amountPaid", parseFloat(e.target.value) || 0)} />
          </Field>
          <div className="text-xs text-slate-500">Balance Due auto-calculated as Total Bill − Amount Paid.</div>
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
