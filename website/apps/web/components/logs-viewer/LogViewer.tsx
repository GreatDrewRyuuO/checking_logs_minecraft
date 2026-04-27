"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { LogFilterBar } from "./LogFilterBar";
import { LogRow } from "./LogRow";
import { LogPagination } from "./LogPagination";
import { LogStats } from "./LogStats";
import type { LogEntry, LogsQueryParams, LogsResponse } from "@/types/logs";

const DEFAULT_PAGE_SIZE = 25;
const AUTO_REFRESH_INTERVAL = 30_000; // 30s

async function fetchLogs(params: LogsQueryParams): Promise<LogsResponse> {
  const query = new URLSearchParams();
  if (params.page) query.set("page", String(params.page));
  if (params.pageSize) query.set("pageSize", String(params.pageSize));
  if (params.log_type) query.set("log_type", params.log_type);
  if (params.search) query.set("search", params.search);
  if (params.entity_type) query.set("entity_type", params.entity_type);
  if (params.is_archived !== undefined)
    query.set("is_archived", String(params.is_archived));

  const res = await fetch(`/api/logs?${query.toString()}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export function LogViewer() {
  const [params, setParams] = useState<LogsQueryParams>({
    page: 1,
    pageSize: DEFAULT_PAGE_SIZE,
    is_archived: false,
  });
  const [data, setData] = useState<LogsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const load = useCallback(
    async (p: LogsQueryParams) => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetchLogs(p);
        setData(res);
        setLastUpdated(new Date());
      } catch (e) {
        setError(String(e));
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    load(params);
  }, [params, load]);

  // Auto-refresh on page 1
  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (params.page === 1) {
      timerRef.current = setInterval(() => load(params), AUTO_REFRESH_INTERVAL);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [params, load]);

  const handleFilterChange = useCallback(
    (newParams: Partial<LogsQueryParams>) => {
      setParams((prev) => ({ ...prev, ...newParams }));
    },
    []
  );

  const handlePageChange = useCallback((page: number) => {
    setParams((prev) => ({ ...prev, page }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-200">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-zinc-950/95 backdrop-blur-sm border-b border-zinc-800">
        <div className="max-w-screen-2xl mx-auto">
          {/* Title bar */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-zinc-800/50">
            <div className="flex gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-600/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-green-600/80" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-zinc-500 font-mono text-xs">
                minecraft@mc.dragonbearsth.online
              </span>
              <span className="text-zinc-700 font-mono text-xs">~</span>
              <span className="text-emerald-400 font-mono text-xs font-semibold">
                ultimatelogger
              </span>
            </div>
            {lastUpdated && (
              <span className="ml-auto text-zinc-700 text-[10px] font-mono">
                updated {lastUpdated.toLocaleTimeString()}
              </span>
            )}
          </div>

          {/* Filter bar */}
          <div className="px-4 py-2">
            <LogFilterBar
              onFilterChange={handleFilterChange}
              isLoading={loading}
            />
          </div>
        </div>
      </div>

      <div className="max-w-screen-2xl mx-auto">
        {/* Stats */}
        {data && (
          <LogStats logs={data.logs} total={data.total} />
        )}

        {/* Loading overlay */}
        {loading && (
          <div className="flex items-center gap-2 px-4 py-2 text-zinc-600 text-xs font-mono border-b border-zinc-800/50">
            <span className="animate-spin inline-block">⟳</span>
            Fetching logs...
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="mx-4 my-3 p-3 bg-red-950/30 border border-red-900/50 rounded text-red-400 text-xs font-mono">
            <span className="text-red-600">ERROR:</span> {error}
          </div>
        )}

        {/* Log list */}
        {data && !error && (
          <>
            {data.logs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-zinc-700 font-mono">
                <span className="text-4xl mb-3">◌</span>
                <span className="text-sm">No logs found</span>
                <span className="text-xs mt-1">
                  Try adjusting filters
                </span>
              </div>
            ) : (
              <div className="border-b border-zinc-800">
                {/* Column headers */}
                <div className="flex items-center gap-3 px-4 py-1.5 bg-zinc-900/30 border-b border-zinc-800/50 text-[10px] font-mono text-zinc-700 uppercase tracking-widest">
                  <span className="w-12 text-right shrink-0">ID</span>
                  <span className="w-32 text-right shrink-0">Timestamp</span>
                  <span className="w-28 shrink-0">Type</span>
                  <span className="flex-1">Data</span>
                  <span className="shrink-0 w-16 text-right">Age</span>
                  <span className="w-4 shrink-0" />
                </div>

                {data.logs.map((log) => (
                  <LogRow key={log.id} log={log} />
                ))}
              </div>
            )}

            {/* Pagination */}
            <LogPagination
              page={data.page}
              totalPages={data.totalPages}
              total={data.total}
              pageSize={data.pageSize}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </div>
    </div>
  );
}
