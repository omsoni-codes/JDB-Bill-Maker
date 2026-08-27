import React, { useState, useMemo } from "react";
import Header from "../components/Header";
import FormPanel from "../components/FormPanel";
import BillPreview from "../components/BillPreview";
import DraftsPanel from "../components/DraftsPanel";
import { Toaster } from "../components/ui/toaster";
import { defaultData } from "../data/mock";

export default function BillMaker() {
  const [data, setData] = useState(defaultData);

  const totals = useMemo(() => {
    const total = Number(data.amounts.totalBillAmount) || 0;
    const payments = Array.isArray(data.amounts.payments) ? data.amounts.payments : [];
    const paid = payments.reduce((s, p) => s + (Number(p.amount) || 0), 0);
    const balance = Math.max(total - paid, 0);
    return { total, paid, balance };
  }, [data.amounts.totalBillAmount, data.amounts.payments]);

  const onReset = () => {
    if (window.confirm("Reset the entire bill to defaults?")) setData(defaultData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50/40 via-slate-100 to-slate-200">
      <Header totalBill={totals.total} amountPaid={totals.paid} balance={totals.balance} onReset={onReset} />
      <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-6 p-6 print:block print:p-0 max-w-[1600px] mx-auto">
        <div className="print:hidden space-y-4">
          <DraftsPanel data={data} setData={setData} />
          <FormPanel data={data} setData={setData} />
        </div>
        <div>
          <BillPreview data={data} />
        </div>
      </div>
      <Toaster />
    </div>
  );
}
