export type AuthAgent = {
  id: string;
  fullName: string;
  username: string;
  phone?: string | null;
  status: "active" | "inactive" | string;
};

export type AuthSession = {
  token: string;
  agent: AuthAgent;
};

const AUTH_KEY = "ars:auth";

export function saveSession(session: AuthSession) {
  localStorage.setItem(AUTH_KEY, JSON.stringify(session));
}

export function getSession(): AuthSession | null {
  const raw = localStorage.getItem(AUTH_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as AuthSession;
  } catch {
    localStorage.removeItem(AUTH_KEY);
    return null;
  }
}

export function clearSession() {
  localStorage.removeItem(AUTH_KEY);
}

