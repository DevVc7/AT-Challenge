import { ActionFunctionArgs, json } from "react-router-dom";
import { URL_API } from "../../constants";
import { getSession } from "../../lib/auth";

export async function homeAction({ request }: ActionFunctionArgs) {
  const session = getSession();

  if (!session?.token) {
    return json({ error: "Not authenticated" }, { status: 401 });
  }

  const formData = await request.formData();
  const payload = {
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    phone: formData.get("phone"),
    username: formData.get("username"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
    referralParentId: formData.get("referralParentId") || null,
  };

  const response = await fetch(`${URL_API}/agents`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    return json(
      {
        error: error?.message ?? "Unable to save agent",
      },
      { status: response.status }
    );
  }

  return json({ success: true });
}
