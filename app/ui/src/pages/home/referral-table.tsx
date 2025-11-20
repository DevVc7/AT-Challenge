import React, { useState } from "react";
import { Button } from "@nextui-org/react";
import {
  AddUserIcon,
  CellProps,
  DeleteIcon,
  EyeIcon,
  Table,
  TableColumn,
} from "../../components";
import { AgentReferral } from "../../models";
import { getSession } from "../../lib/auth";
import { useNavigate } from "react-router-dom";
import { TABLE_FIELD_DETAIL } from "../../components/table/utils";
import { URL_API } from "../../constants";

const columns: TableColumn<AgentReferral>[] = [
  { field: "fullName", title: "NAMES", cell: NameCell },
  { field: "username", title: "USERNAME" },
  { field: "phone", title: "PHONE" },
  { field: "status", title: "STATUS", cell: StatusCell },
  { title: "ACTIONS", cell: ActionCell },
];

function NameCell({ dataItem }: CellProps<AgentReferral>) {
  const indent = (dataItem.level || 0) * 24;
  return (
    <div style={{ paddingLeft: `${indent}px` }} className="font-medium">
      {dataItem.fullName}
    </div>
  );
}

function StatusCell({ dataItem }: CellProps<AgentReferral>) {
  return (
    <span className={`px-2 py-1 rounded text-xs ${
      dataItem.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
    }`}>
      {dataItem.status}
    </span>
  );
}

interface ReferralTableProps {
  data: AgentReferral[];
}

export function ReferralTable({ data }: ReferralTableProps) {
  return (
    <Table
      columns={columns}
      data={data}
      dataItemKey="id"
      detail={ReferralDetail}
    />
  );
}

function ActionCell({ dataItem, rowIndex, onChange }: CellProps<AgentReferral>) {
  const navigate = useNavigate();

  const handleView = () => {
    onChange({ rowIndex, field: TABLE_FIELD_DETAIL, value: !(dataItem as any)[TABLE_FIELD_DETAIL] });
  };

  const handleAdd = () => {
    // Open the global AddReferralModal and pass the parent id via a window event
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("openAddReferral", { detail: { parentId: dataItem.id } }));
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this agent and all its referrals?")) return;

    const session = getSession();
    if (!session?.token) return navigate("/login");

    try {
      const res = await fetch(`${URL_API}/agents/${dataItem.id}`, {
        method: "DELETE",
        headers: { 
          Authorization: `Bearer ${session.token}`,
          "Content-Type": "application/json"
        },
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        const errorMessage = err?.message ?? `Unable to delete agent (${res.status})`;
        alert(errorMessage);
        return;
      }

      // Refresh the page to show updated data
      window.location.reload();
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error("Delete error:", e);
      alert("Failed to delete agent. Please check the console for details.");
    }
  };

  return (
    <>
      <Button className="mr-2" variant="flat" isIconOnly onPress={handleView}>
        <EyeIcon />
      </Button>
      <Button className="mr-2" variant="flat" isIconOnly onPress={handleAdd}>
        <AddUserIcon />
      </Button>
      <Button variant="flat" isIconOnly onPress={handleDelete}>
        <DeleteIcon />
      </Button>
    </>
  );
}

function ReferralDetail({ dataItem }: { dataItem: AgentReferral }) {
  if (!dataItem.referrals || dataItem.referrals.length === 0) {
    return (
      <div className="p-4 bg-gray-50 rounded-lg text-center text-gray-500">
        No referrals
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-50 rounded-lg">
      <div className="mb-3 pb-2 border-b border-gray-300 grid grid-cols-4 gap-4 text-xs font-semibold text-gray-600 uppercase">
        <div>NAMES</div>
        <div>USERNAME</div>
        <div>PHONE</div>
        <div>STATUS</div>
      </div>
      <div className="space-y-2">
        {dataItem.referrals.map((referral) => (
          <ReferralRow 
            key={`${dataItem.id}-${referral.id}`} 
            referral={referral} 
            level={dataItem.level + 1} 
          />
        ))}
      </div>
    </div>
  );
}

// Global state to preserve expansion across re-renders
const expansionState = new Map<string, boolean>();

function ReferralRow({ referral, level }: { referral: AgentReferral; level: number }) {
  const navigate = useNavigate();
  const expansionKey = referral.id;
  const [isExpanded, setIsExpanded] = useState(() => expansionState.get(expansionKey) || false);
  const hasReferrals = referral.referrals && referral.referrals.length > 0;
  
  // Sync state with global map
  React.useEffect(() => {
    expansionState.set(expansionKey, isExpanded);
  }, [isExpanded, expansionKey]);

  const handleView = () => {
    if (hasReferrals) {
      setIsExpanded(!isExpanded);
    }
  };

  const handleAdd = () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("openAddReferral", { detail: { parentId: referral.id } }));
    }
  };

  const handleDelete = async () => {
    const message = hasReferrals
      ? `Are you sure you want to delete ${referral.fullName} and all ${referral.referrals.length} referral(s)?`
      : `Are you sure you want to delete ${referral.fullName}?`;
    
    if (!confirm(message)) return;

    const session = getSession();
    if (!session?.token) return navigate("/login");

    try {
      const res = await fetch(`${URL_API}/agents/${referral.id}`, {
        method: "DELETE",
        headers: { 
          Authorization: `Bearer ${session.token}`,
          "Content-Type": "application/json"
        },
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        const errorMessage = err?.message ?? `Unable to delete agent (${res.status})`;
        alert(errorMessage);
        return;
      }

      // Refresh the page to show updated data
      window.location.reload();
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error("Delete error:", e);
      alert("Failed to delete agent. Please check the console for details.");
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="flex items-center gap-4 p-3">
        <div className="flex-1 grid grid-cols-4 gap-4">
          <div className="font-medium">{referral.fullName}</div>
          <div className="text-gray-700">{referral.username}</div>
          <div className="text-gray-700">{referral.phone || "-"}</div>
          <div>
            <span
              className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                referral.status === "active"
                  ? "bg-green-100 text-green-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {referral.status}
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="flat"
            isIconOnly
            size="sm"
            onPress={handleView}
            isDisabled={!hasReferrals}
            title={hasReferrals ? `View ${referral.referrals.length} referral(s)` : "No referrals"}
          >
            <EyeIcon />
          </Button>
          <Button
            variant="flat"
            isIconOnly
            size="sm"
            onPress={handleAdd}
            title="Add referral"
          >
            <AddUserIcon />
          </Button>
          <Button
            variant="flat"
            isIconOnly
            size="sm"
            color="danger"
            onPress={handleDelete}
            title="Delete agent and referrals"
          >
            <DeleteIcon />
          </Button>
        </div>
      </div>
      {isExpanded && hasReferrals && (
        <div className="border-t border-gray-200 bg-gray-50 p-3">
          <div className="mb-2 pb-2 border-b border-gray-300 grid grid-cols-4 gap-4 text-xs font-semibold text-gray-600 uppercase">
            <div>NAMES</div>
            <div>USERNAME</div>
            <div>PHONE</div>
            <div>STATUS</div>
          </div>
          <div className="space-y-2">
            {referral.referrals.map((child) => (
              <ReferralRow key={child.id} referral={child} level={level + 1} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
