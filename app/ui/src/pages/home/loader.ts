import { redirect } from "react-router-dom";
import { URL_API } from "../../constants";
import { clearSession, getSession } from "../../lib/auth";
import type { Agent, AgentReferral } from "../../models";

export async function homeLoader() {
  if (typeof window === "undefined") {
    return [];
  }

  const session = getSession();
  if (!session?.token) {
    return redirect("/login");
  }

  const response = await fetch(`${URL_API}/agents`, {
    headers: {
      Authorization: `Bearer ${session.token}`,
    },
  });

  if (response.status === 401) {
    clearSession();
    return redirect("/login");
  }

  if (!response.ok) {
    throw new Error("Failed to load referral data");
  }

  const agents = (await response.json()) as Agent[];
  return buildReferralTree(agents);
}

function buildReferralTree(agents: Agent[]): AgentReferral[] {
  const agentMap = new Map<string, AgentReferral>();
  const roots: AgentReferral[] = [];

  agents.forEach((agent) => {
    agentMap.set(agent.id, {
      ...agent,
      level: 0,
      referrals: [],
    });
  });

  agentMap.forEach((agent) => {
    if (agent.referralParentId) {
      const parent = agentMap.get(agent.referralParentId);
      if (parent) {
        agent.level = parent.level + 1;
        parent.referrals.push(agent);
      } else {
        roots.push(agent);
      }
    } else {
      roots.push(agent);
    }
  });

  return roots;
}