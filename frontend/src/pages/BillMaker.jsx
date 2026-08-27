import React, { useState, useMemo } from "react";
import Header from "../components/Header";
import FormPanel from "../components/FormPanel";
import BillPreview from "../components/BillPreview";
import { defaultData } from "../data/mock";

export default function BillMaker() {
  const [data, setData] = useState(defaultData);

  const totals = useMemo(() => {
    const total = Number(data.amounts.totalBillAmount) || 0;
    const paid = Number(data.amounts.amountPaid) || 0;
    const balance = Math.max(total - paid, 0);
    return { total, paid, balance };
  }, [data]);

  const onReset = () => {
    if (window.confirm("Reset the entire bill to defaults?")) setData(defaultData);
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <Header totalBill={totals.total} amountPaid={totals.paid} balance={totals.balance} onReset={onReset} />
      <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-4 p-4 print:block print:p-0">
        <div className="print:hidden">
          <FormPanel data={data} setData={setData} />
        </div>
        <div>
          <BillPreview data={data} />
        </div>
      </div>
    </div>
  );
}
