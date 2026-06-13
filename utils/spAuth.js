const SP_AUTH_KEY = "tw_sp_auth";

export function getSPSession() {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SP_AUTH_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch { return null; }
}

export function clearSPSession() {
  if (typeof window !== "undefined") localStorage.removeItem(SP_AUTH_KEY);
}
