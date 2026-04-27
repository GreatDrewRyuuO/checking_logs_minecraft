"use client";

import { Button } from "@workspace/ui/components/button";
import { cn } from "@workspace/ui/lib/utils";

interface PaginationProps {
  page: number;
  totalPages: number;
  total: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export function LogPagination({
  page,
  totalPages,
  total,
  pageSize,
  onPageChange,
}: PaginationProps) {
  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);

  const pages = (() => {
    const arr: (number | "...")[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) arr.push(i);
    } else {
      arr.push(1);
      if (page > 3) arr.push("...");
      for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
        arr.push(i);
      }
      if (page < totalPages - 2) arr.push("...");
      arr.push(totalPages);
    }
    return arr;
  })();

  return (
    <div className="flex items-center justify-between px-4 py-2 border-t border-zinc-800 bg-zinc-950/50">
      <span className="text-zinc-600 text-[11px] font-mono">
        {total === 0 ? "No logs" : `${start}–${end} of ${total.toLocaleString()} logs`}
      </span>

      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="h-7 px-2 text-xs font-mono text-zinc-500 hover:text-zinc-200 disabled:opacity-30"
        >
          ←
        </Button>

        {pages.map((p, i) =>
          p === "..." ? (
            <span key={`e${i}`} className="text-zinc-700 text-xs px-1">
              ···
            </span>
          ) : (
            <Button
              key={p}
              variant="ghost"
              size="sm"
              onClick={() => onPageChange(p as number)}
              className={cn(
                "h-7 w-7 p-0 text-xs font-mono",
                p === page
                  ? "bg-emerald-900/40 text-emerald-300 border border-emerald-800/50"
                  : "text-zinc-500 hover:text-zinc-200"
              )}
            >
              {p}
            </Button>
          )
        )}

        <Button
          variant="ghost"
          size="sm"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="h-7 px-2 text-xs font-mono text-zinc-500 hover:text-zinc-200 disabled:opacity-30"
        >
          →
        </Button>
      </div>
    </div>
  );
}
