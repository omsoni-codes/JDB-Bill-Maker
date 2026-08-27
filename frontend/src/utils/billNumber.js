// Generate next bill number based on fiscal year (April-March in India)
// Format: JDB/YY-YY/NN where YY-YY = current fiscal year

export function getFiscalYear(date = new Date()) {
  const y = date.getFullYear();
  const m = date.getMonth(); // 0-indexed
  // Fiscal year in India starts in April
  const startYear = m >= 3 ? y : y - 1;
  const endYear = startYear + 1;
  return `${String(startYear).slice(-2)}-${String(endYear).slice(-2)}`;
}

export function parseBillNumber(billNo) {
  // Match pattern JDB/25-26/07
  const m = /^([A-Z]+)\/(\d{2}-\d{2})\/(\d+)$/i.exec(billNo || "");
  if (!m) return null;
  return { prefix: m[1].toUpperCase(), fy: m[2], seq: parseInt(m[3], 10) };
}

export function nextBillNumber(existingBillNos = [], opts = {}) {
  const prefix = opts.prefix || "JDB";
  const fy = opts.fiscalYear || getFiscalYear();
  let maxSeq = 0;
  for (const b of existingBillNos) {
    const p = parseBillNumber(b);
    if (p && p.fy === fy && p.prefix === prefix && p.seq > maxSeq) {
      maxSeq = p.seq;
    }
  }
  const next = maxSeq + 1;
  return `${prefix}/${fy}/${String(next).padStart(2, "0")}`;
}
