import type { Metadata } from "next";
import { LogViewer } from "@/components/logs-viewer/LogViewer";

export const metadata: Metadata = {
  title: "DragonBears MC — Server Logs",
  description: "Minecraft server activity logs for mc.dragonbearsth.online",
};

export default function LogsPage() {
  return <LogViewer />;
}
