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

/* Western grouping — an AED or USD invoice reads "One Million", not "Ten Lakh". */
function internationalWords(n) {
  const billion = Math.floor(n / 1_000_000_000);
  const million = Math.floor((n % 1_000_000_000) / 1_000_000);
  const thousand= Math.floor((n % 1_000_000)     / 1_000);
  const rest    = n % 1_000;

  let r = "";
  if (billion)  r += below1000(billion)  + " Billion ";
  if (million)  r += below1000(million)  + " Million ";
  if (thousand) r += below1000(thousand) + " Thousand ";
  if (rest)     r += below1000(rest);
  return r.trim();
}

/**
 * @param amount  the number to spell out
 * @param opts.system  "indian" (Lakh/Crore, the default) or "international" (Million/Billion)
 * @param opts.unit    currency word placed in front, e.g. "Rupees" / "Dirhams" / "Dollars"
 */
export function numberToWords(amount, opts = {}) {
  if (!amount || isNaN(amount)) return "";
  const n = Math.round(Number(amount));
  const unit = opts.unit ? opts.unit + " " : "";
  if (n === 0) return unit + "Zero Only";

  let result;
  if (opts.system === "international") {
    result = internationalWords(n);
  } else {
    const crore   = Math.floor(n / 10_000_000);
    const lakh    = Math.floor((n % 10_000_000) / 100_000);
    const thousand= Math.floor((n % 100_000)    / 1_000);
    const rest    = n % 1_000;

    result = "";
    if (crore)    result += below1000(crore)  + " Crore ";
    if (lakh)     result += below100(lakh)    + " Lakh ";
    if (thousand) result += below1000(thousand) + " Thousand ";
    if (rest)     result += below1000(rest);
  }

  return unit + result.trim() + " Only";
}
