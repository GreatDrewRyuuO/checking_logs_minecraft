"use client";

import { cn } from "@workspace/ui/lib/utils";
import type { LogType } from "@/types/logs";

interface LogTypeBadgeProps {
  type: LogType;
  className?: string;
}

const LOG_TYPE_CONFIG: Record<
  string,
  { label: string; color: string; icon: string }
> = {
  entity_death: {
    label: "Entity Death",
    color: "bg-red-950/60 text-red-300 border-red-800/50",
    icon: "☠",
  },
  player_death: {
    label: "Player Death",
    color: "bg-rose-950/60 text-rose-300 border-rose-800/50",
    icon: "💀",
  },
  block_break: {
    label: "Block Break",
    color: "bg-orange-950/60 text-orange-300 border-orange-800/50",
    icon: "⛏",
  },
  block_place: {
    label: "Block Place",
    color: "bg-green-950/60 text-green-300 border-green-800/50",
    icon: "🧱",
  },
  chat: {
    label: "Chat",
    color: "bg-sky-950/60 text-sky-300 border-sky-800/50",
    icon: "💬",
  },
  command: {
    label: "Command",
    color: "bg-violet-950/60 text-violet-300 border-violet-800/50",
    icon: "/",
  },
  container_open: {
    label: "Container",
    color: "bg-amber-950/60 text-amber-300 border-amber-800/50",
    icon: "📦",
  },
  item_drop: {
    label: "Item Drop",
    color: "bg-yellow-950/60 text-yellow-300 border-yellow-800/50",
    icon: "⬇",
  },
  item_pickup: {
    label: "Item Pickup",
    color: "bg-lime-950/60 text-lime-300 border-lime-800/50",
    icon: "⬆",
  },
  player_join: {
    label: "Join",
    color: "bg-emerald-950/60 text-emerald-300 border-emerald-800/50",
    icon: "→",
  },
  player_quit: {
    label: "Quit",
    color: "bg-slate-800/60 text-slate-400 border-slate-700/50",
    icon: "←",
  },
  sign_text: {
    label: "Sign",
    color: "bg-teal-950/60 text-teal-300 border-teal-800/50",
    icon: "📋",
  },
  explosion: {
    label: "Explosion",
    color: "bg-red-950/60 text-red-400 border-red-700/50",
    icon: "💥",
  },
    player_craft: {
    label: "Player Craft",
    color: "bg-blue-950/60 text-blue-300 border-blue-800/50",
    icon: "⚒",
  },
};

const DEFAULT_CONFIG = {
  label: "Unknown",
  color: "bg-zinc-900/60 text-zinc-400 border-zinc-700/50",
  icon: "?",
};

export function LogTypeBadge({ type, className }: LogTypeBadgeProps) {
  const config = LOG_TYPE_CONFIG[type] ?? {
    ...DEFAULT_CONFIG,
    label: type.replace(/_/g, " "),
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 rounded border text-xs font-mono font-semibold tracking-wide uppercase",
        config.color,
        className
      )}
    >
      <span className="text-[10px]">{config.icon}</span>
      {config.label}
    </span>
  );
}

export function getLogTypeConfig(type: LogType) {
  return LOG_TYPE_CONFIG[type] ?? { ...DEFAULT_CONFIG, label: type };
}

export const ALL_LOG_TYPES = Object.keys(LOG_TYPE_CONFIG);
