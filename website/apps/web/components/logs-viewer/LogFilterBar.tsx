"use client";

import { useState, useCallback } from "react";
import { Input } from "@workspace/ui/components/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { Button } from "@workspace/ui/components/button";
import { ALL_LOG_TYPES } from "./LogTypeBadge";
import { MINECRAFT_MOBS, formatMobName } from "@/lib/minecraft-mobs";
import type { LogsQueryParams } from "@/types/logs";

interface LogFilterBarProps {
  onFilterChange: (params: Partial<LogsQueryParams>) => void;
  isLoading?: boolean;
}

const LOG_TYPE_LABELS: Record<string, string> = {
  entity_death: "Entity Death",
  player_death: "Player Death",
  block_break: "Block Break",
  block_place: "Block Place",
  chat: "Chat",
  command: "Command",
  container_open: "Container Open",
  item_drop: "Item Drop",
  item_pickup: "Item Pickup",
  player_join: "Player Join",
  player_quit: "Player Quit",
  sign_text: "Sign Text",
  explosion: "Explosion",
  player_craft: "Player Craft",
};

export function LogFilterBar({ onFilterChange, isLoading }: LogFilterBarProps) {
  const [search, setSearch] = useState("");
  const [logType, setLogType] = useState("all");
  const [archived, setArchived] = useState("active");
  const [entityType, setEntityType] = useState("all");

  const showMobFilter = logType === "entity_death";

  const handleLogTypeChange = useCallback((val: string) => {
    setLogType(val);
    if (val !== "entity_death") setEntityType("all");
  }, []);

  const handleApply = useCallback(() => {
    onFilterChange({
      search: search || undefined,
      log_type: logType === "all" ? undefined : logType,
      entity_type: showMobFilter && entityType !== "all" ? entityType : undefined,
      is_archived:
        archived === "all" ? undefined : archived === "archived" ? true : false,
      page: 1,
    });
  }, [search, logType, entityType, archived, showMobFilter, onFilterChange]);

  const handleReset = useCallback(() => {
    setSearch("");
    setLogType("all");
    setArchived("active");
    setEntityType("all");
    onFilterChange({
      search: undefined,
      log_type: undefined,
      entity_type: undefined,
      is_archived: undefined,
      page: 1,
    });
  }, [onFilterChange]);

  return (
    <div className="flex flex-wrap items-center gap-2 p-3 bg-zinc-900/50 border border-zinc-800 rounded-lg">
      {/* Search */}
      <div className="flex-1 min-w-[160px] max-w-xs">
        <Input
          placeholder="Search player, entity..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleApply()}
          className="h-8 text-xs font-mono bg-zinc-950 border-zinc-700 text-zinc-200 placeholder:text-zinc-600 focus:border-emerald-700"
        />
      </div>

      {/* Log type filter */}
      <Select value={logType} onValueChange={handleLogTypeChange}>
        <SelectTrigger className="h-8 w-[150px] text-xs font-mono bg-zinc-950 border-zinc-700 text-zinc-300">
          <SelectValue placeholder="All types" />
        </SelectTrigger>
        <SelectContent className="bg-zinc-900 border-zinc-700 text-xs font-mono">
          <SelectItem value="all" className="text-zinc-300">
            All types
          </SelectItem>
          {ALL_LOG_TYPES.map((t) => (
            <SelectItem key={t} value={t} className="text-zinc-300">
              {LOG_TYPE_LABELS[t] ?? t}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {showMobFilter && (
        <Select value={entityType} onValueChange={setEntityType}>
          <SelectTrigger className="h-8 w-[160px] text-xs font-mono bg-zinc-950 border-zinc-700 text-zinc-300">
            <SelectValue placeholder="All mobs" />
          </SelectTrigger>
          <SelectContent className="bg-zinc-900 border-zinc-700 text-xs font-mono max-h-72">
            <SelectItem value="all" className="text-zinc-300">
              All mobs
            </SelectItem>
            {Object.entries(MINECRAFT_MOBS).map(([category, mobs]) => (
              <SelectGroup key={category}>
                <SelectLabel className="text-zinc-600 text-[10px] uppercase tracking-widest px-2 py-1">
                  {category}
                </SelectLabel>
                {mobs.map((mob) => (
                  <SelectItem key={mob} value={mob} className="text-zinc-300">
                    {formatMobName(mob)}
                  </SelectItem>
                ))}
              </SelectGroup>
            ))}
          </SelectContent>
        </Select>
      )}

      {/* Archived filter */}
      <Select value={archived} onValueChange={setArchived}>
        <SelectTrigger className="h-8 w-[120px] text-xs font-mono bg-zinc-950 border-zinc-700 text-zinc-300">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="bg-zinc-900 border-zinc-700 text-xs font-mono">
          <SelectItem value="active" className="text-zinc-300">
            Active
          </SelectItem>
          <SelectItem value="archived" className="text-zinc-300">
            Archived
          </SelectItem>
          <SelectItem value="all" className="text-zinc-300">
            All
          </SelectItem>
        </SelectContent>
      </Select>

      <Button
        size="sm"
        onClick={handleApply}
        disabled={isLoading}
        className="h-8 px-3 text-xs font-mono bg-emerald-900/60 hover:bg-emerald-800/60 text-emerald-300 border border-emerald-800/50"
      >
        {isLoading ? "Loading..." : "Apply"}
      </Button>

      <Button
        size="sm"
        variant="ghost"
        onClick={handleReset}
        className="h-8 px-3 text-xs font-mono text-zinc-500 hover:text-zinc-300"
      >
        Reset
      </Button>
    </div>
  );
}