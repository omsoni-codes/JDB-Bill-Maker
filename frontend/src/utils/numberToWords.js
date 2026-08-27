// Convert number to Indian words (rupees)
const ones = [
  "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
  "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen",
];
const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

function twoDigits(n) {
  if (n < 20) return ones[n];
  return tens[Math.floor(n / 10)] + (n % 10 ? " " + ones[n % 10] : "");
}

function threeDigits(n) {
  const h = Math.floor(n / 100);
  const r = n % 100;
  let str = "";
  if (h) str += ones[h] + " Hundred";
  if (r) str += (str ? " " : "") + twoDigits(r);
  return str;
}

export function numberToIndianWords(num) {
  num = Math.floor(Number(num) || 0);
  if (num === 0) return "Rupees Zero Only";
  let result = "";
  const crore = Math.floor(num / 10000000);
  num %= 10000000;
  const lakh = Math.floor(num / 100000);
  num %= 100000;
  const thousand = Math.floor(num / 1000);
  num %= 1000;
  const rest = num;

  if (crore) result += threeDigits(crore) + " Crore ";
  if (lakh) result += twoDigits(lakh) + " Lakh ";
  if (thousand) result += twoDigits(thousand) + " Thousand ";
  if (rest) result += threeDigits(rest);

  return "Rupees " + result.trim() + " Only";
}
