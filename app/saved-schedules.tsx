"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import {
  deleteSchedule,
  listSchedules,
  type Schedule,
} from "@/lib/schedules";

type Props = {
  onLoad: (schedule: Schedule) => void;
  refreshKey: number;
};

function formatDate(schedule: Schedule): string {
  const date = schedule.createdAt?.toDate();
  if (!date) return "—";
  return date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function SavedSchedules({ onLoad, refreshKey }: Props) {
  const { user } = useAuth();
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    listSchedules(user.uid)
      .then((items) => {
        if (!cancelled) setSchedules(items);
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [user, refreshKey]);

  async function handleDelete(id: string) {
    setDeletingId(id);
    try {
      await deleteSchedule(id);
      setSchedules((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <section className="rounded-xl border border-gray-800 bg-gray-900 shadow-sm transition-shadow hover:shadow-md lg:sticky lg:top-20">
      <div className="flex items-center justify-between border-b border-gray-800 px-6 py-5">
        <h2 className="text-lg font-semibold tracking-tight text-white">
          Saved schedules
        </h2>
        {!loading && !error && schedules.length > 0 && (
          <span className="rounded-full bg-gray-800 px-2 py-0.5 text-xs font-medium tabular-nums text-gray-400">
            {schedules.length}
          </span>
        )}
      </div>

      <div className="px-6 py-5">
        {loading && (
          <ul className="space-y-2">
            {[0, 1].map((i) => (
              <li
                key={i}
                className="flex items-center justify-between gap-3 rounded-lg border border-gray-800 bg-gray-800/60 p-3"
              >
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-1/2 animate-pulse rounded bg-gray-700" />
                  <div className="h-2.5 w-1/3 animate-pulse rounded bg-gray-700" />
                </div>
                <div className="flex gap-2">
                  <div className="h-7 w-14 animate-pulse rounded-md bg-gray-700" />
                  <div className="h-7 w-16 animate-pulse rounded-md bg-gray-700" />
                </div>
              </li>
            ))}
          </ul>
        )}

        {error && (
          <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-400">
            {error}
          </p>
        )}

        {!loading && !error && schedules.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-gray-700 bg-gray-800/50 px-6 py-12 text-center">
            <div className="mb-1 flex h-10 w-10 items-center justify-center rounded-full bg-gray-800 text-purple-400 ring-1 ring-gray-700">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                className="h-5 w-5"
              >
                <path d="M19 21l-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <p className="text-sm font-medium text-gray-300">
              No schedules saved yet
            </p>
            <p className="text-xs text-gray-500">
              Save a schedule to see it here.
            </p>
          </div>
        )}

        {!loading && !error && schedules.length > 0 && (
          <ul className="space-y-2">
            {schedules.map((schedule) => (
              <li
                key={schedule.id}
                className="flex items-center justify-between gap-3 rounded-lg border border-gray-800 bg-gray-800 px-3.5 py-3 transition-all animate-fade-in-up hover:border-gray-700 hover:bg-gray-700"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-white">
                    {schedule.title}
                  </p>
                  <p className="text-xs text-gray-400">
                    {formatDate(schedule)}
                  </p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <button
                    onClick={() => onLoad(schedule)}
                    className="rounded-md border border-gray-700 bg-gray-800 px-2.5 py-1.5 text-xs font-medium text-gray-300 shadow-sm transition-all hover:bg-gray-700 hover:shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900"
                  >
                    Load
                  </button>
                  <button
                    onClick={() => handleDelete(schedule.id)}
                    disabled={deletingId === schedule.id}
                    className="rounded-md px-2.5 py-1.5 text-xs font-medium text-red-400 transition-colors hover:bg-red-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {deletingId === schedule.id ? "Deleting…" : "Delete"}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
