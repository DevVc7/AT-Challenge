import { NavBar, Page } from "../../components";
import { ReferralTable } from "./referral-table";
import { AddReferralModal } from "./add_referral_modal";
import { useLoaderData, useNavigate } from "react-router-dom";
import type { AgentReferral } from "../../models";
import { clearSession } from "../../lib/auth";

export function HomePage() {
  const data = useLoaderData() as AgentReferral[];
  const navigate = useNavigate();

  const handleLogout = () => {
    clearSession();
    navigate("/login");
  };

  return (
    <Page className="p-8">
      <NavBar onLogout={handleLogout} />

      <div className="flex justify-end">
        <AddReferralModal />
      </div>

      <div className="grow">
        <ReferralTable data={data} />
      </div>
    </Page>
  );
}
