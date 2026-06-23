const ADMIN_EMAIL    = "admin@tourwatchout.com";
const ADMIN_PASSWORD = "admin123";
const AUTH_KEY       = "tw_admin_auth";
const SP_AUTH_KEY    = "tw_sp_auth";

export function login(email, password) {
  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    localStorage.setItem(AUTH_KEY, JSON.stringify({ email, loggedIn: true, ts: Date.now() }));
    return true;
  }
  return false;
}

export function logout() {
  localStorage.removeItem(AUTH_KEY);
}

/* Returns true for both admin and salesperson sessions */
export function isAuthenticated() {
  if (typeof window === "undefined") return false;
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    if (raw && JSON.parse(raw).loggedIn === true) return true;
    const spRaw = localStorage.getItem(SP_AUTH_KEY);
    if (spRaw) {
      const { token, salesperson } = JSON.parse(spRaw);
      if (token && salesperson) return true;
    }
  } catch {}
  return false;
}

export function isAdmin() {
  if (typeof window === "undefined") return false;
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    return !!(raw && JSON.parse(raw).loggedIn === true);
  } catch { return false; }
}

/* Returns salesperson object {name, permissions, …} or null if admin/unauthenticated */
export function getSalespersonData() {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SP_AUTH_KEY);
    if (!raw) return null;
    const { token, salesperson } = JSON.parse(raw);
    if (token && salesperson) return salesperson;
  } catch {}
  return null;
}
