import { NavBar, Page } from "../../components";
import { ReferralTable } from "./referral-table";
import { AddReferralModal } from "./add_referral_modal";
import { useLoaderData } from "react-router-dom";
import type { AgentReferral } from "../../models";

export function HomePage() {
  const data = useLoaderData() as AgentReferral[];

  const handleLogout = () => {}

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
