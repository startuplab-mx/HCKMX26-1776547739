// Client-side auth — MVP with hardcoded credentials and localStorage state.
// Swap `CREDENTIALS` and the storage functions for real API calls later.

const AUTH_KEY = "layers_intel_auth";

export const CREDENTIALS = { username: "1234", password: "1234" };

export function login(username: string, password: string): boolean {
  if (
    username === CREDENTIALS.username &&
    password === CREDENTIALS.password
  ) {
    localStorage.setItem(AUTH_KEY, "true");
    return true;
  }
  return false;
}

export function logout(): void {
  localStorage.removeItem(AUTH_KEY);
}

export function isAuthenticated(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(AUTH_KEY) === "true";
}
