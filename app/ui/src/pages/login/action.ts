import { ActionFunctionArgs, json, redirect } from "react-router-dom";
import { URL_API } from "../../constants";
import { saveSession } from "../../lib/auth";

export async function loginAction({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!username || !password) {
    return json({ error: "Username and password are required" }, { status: 400 });
  }

  const response = await fetch(`${URL_API}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    return json(
      {
        error: error?.message ?? "Invalid username or password",
      },
      { status: response.status }
    );
  }

  const data = await response.json();
  saveSession(data);

  return redirect("/home");
}
