const ADMIN_EMAIL = "admin@tourwatchout.com";
const ADMIN_PASSWORD = "admin123";
const AUTH_KEY = "tw_admin_auth";

export function login(email, password) {
  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    const payload = { email, loggedIn: true, ts: Date.now() };
    localStorage.setItem(AUTH_KEY, JSON.stringify(payload));
    return true;
  }
  return false;
}

export function logout() {
  localStorage.removeItem(AUTH_KEY);
}

export function isAuthenticated() {
  if (typeof window === "undefined") return false;
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    if (!raw) return false;
    const payload = JSON.parse(raw);
    return payload.loggedIn === true;
  } catch {
    return false;
  }
}
