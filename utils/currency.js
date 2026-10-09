/**
 * Invoice currencies.
 *
 * The currency is only the denomination of the invoice — amounts are typed in
 * by the admin in that currency and are never converted. Switching the currency
 * changes the symbol and the number grouping, not the numbers themselves.
 */
export const CURRENCIES = {
  INR: { code: "INR", symbol: "₹",   label: "₹ INR",   locale: "en-IN", word: "Rupees",  sub: "Paise",  system: "indian"        },
  AED: { code: "AED", symbol: "AED", label: "AED",     locale: "en-AE", word: "Dirhams", sub: "Fils",   system: "international" },
  USD: { code: "USD", symbol: "$",   label: "$ USD",   locale: "en-US", word: "Dollars", sub: "Cents",  system: "international" },
};

export const CURRENCY_CODES = Object.keys(CURRENCIES);

/** Always returns a currency — anything unknown (or missing) falls back to INR. */
export const curOf = (code) => CURRENCIES[String(code || "INR").toUpperCase()] || CURRENCIES.INR;

/** Just the symbol, for field labels like "Rate (₹)". */
export const curSymbol = (code) => curOf(code).symbol;

/** "12,34,567.00" for INR, "1,234,567.00" for AED/USD. */
export function fmtAmount(n, code, opts = {}) {
  const c = curOf(code);
  return Number(n || 0).toLocaleString(c.locale, {
    minimumFractionDigits: opts.minimumFractionDigits ?? 2,
    maximumFractionDigits: opts.maximumFractionDigits ?? 2,
  });
}

/** "₹ 1,200.00" / "AED 1,200.00" / "$ 1,200.00" */
export function money(n, code, opts = {}) {
  return `${curOf(code).symbol}${opts.tight ? "" : " "}${fmtAmount(n, code, opts)}`;
}
