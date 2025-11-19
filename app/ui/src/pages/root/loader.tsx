import { LoaderFunctionArgs, redirect } from "react-router-dom";

export function rootLoader({ request: _ }: LoaderFunctionArgs) {
  // TODO: implement authentication
  const isAuthenticated = false;

  const pathname = new URL(_.url).pathname;
  const redirectTo = isAuthenticated ? "/home" : "/login";

  if (pathname === redirectTo) {
    return null;
  }

  return isAuthenticated ? null : redirect(redirectTo);
}
