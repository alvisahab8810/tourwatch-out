const ONES = [
  "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
  "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen",
  "Seventeen", "Eighteen", "Nineteen",
];
const TENS = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

function below100(n) {
  if (n < 20) return ONES[n];
  return TENS[Math.floor(n / 10)] + (n % 10 ? " " + ONES[n % 10] : "");
}
function below1000(n) {
  if (n < 100) return below100(n);
  return ONES[Math.floor(n / 100)] + " Hundred" + (n % 100 ? " " + below100(n % 100) : "");
}

export function numberToWords(amount) {
  if (!amount || isNaN(amount)) return "";
  const n = Math.round(Number(amount));
  if (n === 0) return "Zero Only";

  const crore   = Math.floor(n / 10_000_000);
  const lakh    = Math.floor((n % 10_000_000) / 100_000);
  const thousand= Math.floor((n % 100_000)    / 1_000);
  const rest    = n % 1_000;

  let result = "";
  if (crore)    result += below1000(crore)  + " Crore ";
  if (lakh)     result += below100(lakh)    + " Lakh ";
  if (thousand) result += below1000(thousand) + " Thousand ";
  if (rest)     result += below1000(rest);

  return result.trim() + " Only";
}
