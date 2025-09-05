import { Chip } from "@nextui-org/react";
import { useEffect, useState } from "react";
import statusController from "../controllers/status-controller";

type Status = "running" | "failed" | "loading";

export function ApiStatus() {
  const [status, setStatus] = useState<Status>("loading");

  useEffect(() => {
    const getStatus = async () => {
      const statusDotNet = await statusController.getStatus();
      console.log(statusDotNet);
      setStatus(statusDotNet !== "running" ? "failed" : "running");
    };

    getStatus();
  }, []);

  const statusToColor = (status: Status) => {
    const colors = {
      running: "success",
      failed: "danger",
      loading: "warning",
    } as const;

    return colors[status];
  };

  return (
    <div className="flex gap-4">
      <Chip variant="dot" color={statusToColor(status)}>
        dotnet
      </Chip>
    </div>
  );
}
