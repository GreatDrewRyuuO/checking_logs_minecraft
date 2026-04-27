"use client";

import type { ReactNode } from "react";
import { cn } from "@workspace/ui/lib/utils";
import type { LogData, LogType } from "@/types/logs";

interface LogDataViewProps {
  logType: LogType;
  data: LogData;
  className?: string;
}

function str(v: unknown): string {
  return typeof v === "string" || typeof v === "number" || typeof v === "boolean"
    ? String(v)
    : JSON.stringify(v) ?? "";
}

function DataField({
  label,
  value,
  highlight,
  mono,
}: {
  label: string;
  value: ReactNode;
  highlight?: boolean;
  mono?: boolean;
}) {
  return (
    <div className="flex items-start gap-2 min-w-0">
      <span className="text-zinc-600 text-[11px] font-mono shrink-0 pt-px">
        {label}:
      </span>
      <span
        className={cn(
          "text-[11px] truncate",
          mono ? "font-mono" : "",
          highlight ? "text-amber-300 font-semibold" : "text-zinc-300"
        )}
      >
        {value}
      </span>
    </div>
  );
}

function LocationDisplay({
  world,
  x,
  y,
  z,
}: {
  world: string;
  x: number;
  y: number;
  z: number;
}) {
  const worldColor =
    world === "world"
      ? "text-green-400"
      : world === "world_nether"
      ? "text-red-400"
      : world === "world_the_end"
      ? "text-purple-400"
      : "text-sky-400";

  return (
    <div className="flex items-center gap-1 flex-wrap">
      <span className={cn("text-[11px] font-mono font-semibold", worldColor)}>
        [{world}]
      </span>
      <span className="text-zinc-500 text-[11px] font-mono">
        X: <span className="text-zinc-200">{Math.round(x)}</span> Y:{" "}
        <span className="text-zinc-200">{Math.round(y)}</span> Z:{" "}
        <span className="text-zinc-200">{Math.round(z)}</span>
      </span>
    </div>
  );
}

export function LogDataView({ logType, data, className }: LogDataViewProps) {
  const d = data as Record<string, unknown>;

  const hasLocation =
    typeof d.location_world === "string" &&
    typeof d.location_x === "number" &&
    typeof d.location_y === "number" &&
    typeof d.location_z === "number";

  return (
    <div className={cn("space-y-1", className)}>
      {/* Entity / Block type */}
      {d.entity_type != null && (
        <DataField
          label="Entity"
          value={str(d.entity_type).replace(/_/g, " ")}
          highlight
          mono
        />
      )}
      {d.block_type != null && (
        <DataField
          label="Block"
          value={str(d.block_type).replace(/_/g, " ")}
          highlight
          mono
        />
      )}

      {/* Player info */}
      {d.player_name != null && (
        <DataField label="Player" value={str(d.player_name)} highlight />
      )}
      {d.killer_name != null && (
        <DataField label="Killed by" value={str(d.killer_name)} highlight />
      )}

      {/* Chat / command message */}
      {d.message != null && (
        <DataField
          label="Message"
          value={
            <span className="text-sky-300 italic">
              &ldquo;{str(d.message)}&rdquo;
            </span>
          }
        />
      )}

      {/* Death message */}
      {d.death_message != null && (
        <DataField
          label="Cause"
          value={<span className="text-red-300">{str(d.death_message)}</span>}
        />
      )}

      {/* EXP dropped */}
      {typeof d.dropped_exp === "number" && d.dropped_exp > 0 && (
        <DataField
          label="EXP"
          value={
            <span className="text-lime-400 font-semibold">
              +{d.dropped_exp}
            </span>
          }
          mono
        />
      )}

      {/* Item info */}
      {d.item_type != null && (
        <DataField
          label="Item"
          value={str(d.item_type).replace(/_/g, " ")}
          mono
        />
      )}
      {d.amount != null && (
        <DataField label="Amount" value={`×${str(d.amount)}`} mono />
      )}

      {/* Location */}
      {hasLocation && (
        <div className="flex items-start gap-2">
          <span className="text-zinc-600 text-[11px] font-mono shrink-0 pt-px">
            Loc:
          </span>
          <LocationDisplay
            world={d.location_world as string}
            x={d.location_x as number}
            y={d.location_y as number}
            z={d.location_z as number}
          />
        </div>
      )}

      {/* Fallback raw JSON for uncommon types */}
      {!["entity_death", "player_death", "block_break", "block_place", "chat"].includes(
        logType
      ) && (
        <details className="group">
          <summary className="text-zinc-600 text-[11px] font-mono cursor-pointer hover:text-zinc-400 select-none">
            raw data ▸
          </summary>
          <pre className="mt-1 text-[10px] font-mono text-zinc-500 overflow-auto max-h-32 bg-black/30 rounded p-2">
            {JSON.stringify(data, null, 2)}
          </pre>
        </details>
      )}
    </div>
  );
}
