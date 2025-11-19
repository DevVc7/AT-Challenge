export type Agent = {
  id: string;
  firstName?: string;
  lastName?: string;
  fullName: string;
  username: string;
  phone?: string | null;
  status: "active" | "inactive" | string;
  referralParentId?: string | null;
};

export type AgentReferral = Agent & {
  level: number;
  referrals: AgentReferral[];
};