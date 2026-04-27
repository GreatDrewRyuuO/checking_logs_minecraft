"use client";

import { useState } from "react";
import { cn } from "@workspace/ui/lib/utils";
import { LogTypeBadge } from "./LogTypeBadge";
import { LogDataView } from "./LogDataView";
import type { LogEntry } from "@/types/logs";

interface LogRowProps {
  log: LogEntry;
}

function formatTimestamp(ts: number): { date: string; time: string; relative: string } {
  const d = new Date(ts);
  const now = Date.now();
  const diff = now - ts;

  const pad = (n: number) => String(n).padStart(2, "0");
  const date = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const time = `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;

  let relative: string;
  if (diff < 60_000) relative = "just now";
  else if (diff < 3_600_000) relative = `${Math.floor(diff / 60_000)}m ago`;
  else if (diff < 86_400_000) relative = `${Math.floor(diff / 3_600_000)}h ago`;
  else if (diff < 2_592_000_000) relative = `${Math.floor(diff / 86_400_000)}d ago`;
  else relative = `${Math.floor(diff / 2_592_000_000)}mo ago`;

  return { date, time, relative };
}

function getRowAccentClass(logType: string): string {
  const map: Record<string, string> = {
    entity_death: "border-l-red-800/70 hover:border-l-red-600",
    player_death: "border-l-rose-700/70 hover:border-l-rose-500",
    block_break: "border-l-orange-800/70 hover:border-l-orange-600",
    block_place: "border-l-green-800/70 hover:border-l-green-600",
    chat: "border-l-sky-800/70 hover:border-l-sky-600",
    command: "border-l-violet-800/70 hover:border-l-violet-600",
    container_open: "border-l-amber-800/70 hover:border-l-amber-600",
    item_drop: "border-l-yellow-800/70 hover:border-l-yellow-600",
    item_pickup: "border-l-lime-800/70 hover:border-l-lime-600",
    player_join: "border-l-emerald-700/70 hover:border-l-emerald-500",
    player_quit: "border-l-slate-700/70 hover:border-l-slate-500",
    explosion: "border-l-red-700/70 hover:border-l-red-500",
  };
  return map[logType] ?? "border-l-zinc-700/70 hover:border-l-zinc-500";
}

export function LogRow({ log }: LogRowProps) {
  const [expanded, setExpanded] = useState(false);
  const { date, time, relative } = formatTimestamp(log.timestamp);
  const isExpired = Date.now() > log.expires_at;

  return (
    <div
      className={cn(
        "group border-l-2 bg-zinc-950/60 hover:bg-zinc-900/60 transition-colors cursor-pointer",
        "border-b border-zinc-800/50",
        getRowAccentClass(log.log_type),
        log.is_archived && "opacity-60",
        isExpired && "opacity-40"
      )}
      onClick={() => setExpanded((v) => !v)}
    >
      {/* Main row */}
      <div className="flex items-start gap-3 px-4 py-2.5 min-w-0">
        {/* ID */}
        <span className="text-zinc-700 text-[10px] font-mono w-12 shrink-0 pt-px tabular-nums text-right">
          #{log.id}
        </span>

        {/* Timestamp */}
        <div className="shrink-0 w-32 text-right">
          <div className="text-zinc-400 text-[11px] font-mono tabular-nums">
            {time}
          </div>
          <div className="text-zinc-700 text-[10px] font-mono">{date}</div>
        </div>

        {/* Badge */}
        <div className="shrink-0 pt-0.5">
          <LogTypeBadge type={log.log_type} />
        </div>

        {/* Data summary */}
        <div className="flex-1 min-w-0 pt-0.5">
          <LogDataView
            logType={log.log_type}
            data={log.data}
            className={expanded ? "" : "line-clamp-1"}
          />
        </div>

        {/* Right: relative time + indicators */}
        <div className="shrink-0 flex flex-col items-end gap-1">
          <span className="text-zinc-600 text-[10px] font-mono">
            {relative}
          </span>
          <div className="flex gap-1">
            {log.is_archived ? (
              <span className="text-zinc-600 text-[9px] font-mono border border-zinc-700 px-1 rounded">
                ARCHIVED
              </span>
            ) : null}
            {isExpired ? (
              <span className="text-red-900 text-[9px] font-mono border border-red-900/50 px-1 rounded">
                EXPIRED
              </span>
            ) : null}
          </div>
        </div>

        {/* Expand indicator */}
        <span className="text-zinc-700 group-hover:text-zinc-500 text-[10px] font-mono shrink-0 pt-px transition-colors">
          {expanded ? "▲" : "▼"}
        </span>
      </div>

      {/* Expanded detail */}
      {expanded && (
        <div
          className="px-4 pb-3 pt-0 ml-[124px] border-t border-zinc-800/40"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Full data */}
            <div>
              <div className="text-zinc-600 text-[10px] font-mono uppercase tracking-widest mb-1">
                Event Data
              </div>
              <pre className="text-[11px] font-mono text-zinc-400 bg-black/30 rounded p-2 overflow-auto max-h-48">
                {JSON.stringify(log.data, null, 2)}
              </pre>
            </div>

            {/* Metadata */}
            <div className="space-y-1">
              <div className="text-zinc-600 text-[10px] font-mono uppercase tracking-widest mb-1">
                Metadata
              </div>
              <MetaField label="Log ID" value={`#${log.id}`} />
              <MetaField label="Type" value={log.log_type} />
              <MetaField
                label="Timestamp"
                value={`${new Date(log.timestamp).toISOString()} (${log.timestamp})`}
              />
              <MetaField
                label="Expires"
                value={new Date(log.expires_at).toISOString()}
              />
              <MetaField
                label="Archived"
                value={log.is_archived ? "Yes" : "No"}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function MetaField({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2 text-[11px]">
      <span className="text-zinc-600 font-mono shrink-0 w-20">{label}:</span>
      <span className="text-zinc-400 font-mono break-all">{value}</span>
    </div>
  );
}
