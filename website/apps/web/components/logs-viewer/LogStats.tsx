"use client";

import { useEffect, useState } from "react";
import type { LogEntry } from "@/types/logs";

interface LogStatsProps {
  logs: LogEntry[];
  total: number;
}

export function LogStats({ logs, total }: LogStatsProps) {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const recentCount = logs.filter((l) => now - l.timestamp < 3_600_000).length;
  const typeCounts = logs.reduce<Record<string, number>>((acc, l) => {
    acc[l.log_type] = (acc[l.log_type] ?? 0) + 1;
    return acc;
  }, {});

  const topType = Object.entries(typeCounts).sort((a, b) => b[1] - a[1])[0];

  return (
    <div className="flex flex-wrap items-center gap-4 px-4 py-2 bg-zinc-900/30 border-b border-zinc-800/50 text-[11px] font-mono">
      <Stat
        label="Total"
        value={total.toLocaleString()}
        color="text-zinc-300"
      />
      <Stat
        label="Page"
        value={logs.length.toString()}
        color="text-zinc-400"
      />
      <Stat
        label="Recent (1h)"
        value={recentCount.toString()}
        color="text-emerald-400"
      />
      {topType && (
        <Stat
          label="Top type"
          value={`${topType[0].replace(/_/g, " ")} (${topType[1]})`}
          color="text-amber-400"
        />
      )}
      <div className="ml-auto flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        <span className="text-emerald-600">LIVE</span>
        <span className="text-zinc-700">mc.dragonbearsth.online</span>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-zinc-700">{label}:</span>
      <span className={color}>{value}</span>
    </div>
  );
}
