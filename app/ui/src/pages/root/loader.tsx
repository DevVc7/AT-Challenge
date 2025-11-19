import { LoaderFunctionArgs, redirect } from "react-router-dom";
import { URL_API } from "../../constants";
import { clearSession, getSession, saveSession } from "../../lib/auth";

export async function rootLoader({ request }: LoaderFunctionArgs) {
  const pathname = new URL(request.url).pathname;

  if (typeof window === "undefined") {
    return null;
  }

  let isAuthenticated = false;
  const session = getSession();

  if (session?.token) {
    const res = await fetch(`${URL_API}/auth/me`, {
      headers: {
        Authorization: `Bearer ${session.token}`,
      },
    });

    if (res.ok) {
      const agent = await res.json();
      saveSession({ token: session.token, agent });
      isAuthenticated = true;
    } else {
      clearSession();
    }
  }

  const redirectTo = isAuthenticated ? "/home" : "/login";

  if (pathname === redirectTo) {
    return null;
  }

  return redirect(redirectTo);
}
