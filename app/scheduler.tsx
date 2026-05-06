"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { useAuth } from "@/lib/auth-context";
import { saveSchedule, type Schedule } from "@/lib/schedules";
import SavedSchedules from "./saved-schedules";

// Build prose-friendly drip segments from the original text.
// - Paragraphs are split on blank lines.
// - Each paragraph is split into sentences on `. ! ?` boundaries followed by whitespace.
// - Sentences within a paragraph join with a single space; paragraphs separate with "\n\n".
// Concatenating all returned segments reproduces a clean essay-style document.
function buildExportSegments(originalText: string): string[] {
  const paragraphs = originalText
    .split(/\n\s*\n+/)
    .map((p) => p.replace(/\s+/g, " ").trim())
    .filter((p) => p.length > 0);

  const segments: string[] = [];
  paragraphs.forEach((para, paraIdx) => {
    const isLastPara = paraIdx === paragraphs.length - 1;
    const sentences = para
      .split(/(?<=[.!?])\s+/)
      .map((s) => s.trim())
      .filter(Boolean);

    sentences.forEach((sentence, sIdx) => {
      const isLastSentence = sIdx === sentences.length - 1;
      const suffix = isLastSentence
        ? isLastPara
          ? ""
          : "\n\n"
        : " ";
      segments.push(sentence + suffix);
    });
  });
  return segments;
}

function splitIntoChunks(text: string, chunkSize: number): string[] {
  if (!text || chunkSize <= 0) return [];
  const words = text.split(/\s+/).filter(Boolean);
  const chunks: string[] = [];
  let current = "";

  for (const word of words) {
    if (current && (current.length + 1 + word.length) > chunkSize) {
      chunks.push(current);
      current = word;
    } else {
      current = current ? current + " " + word : word;
    }
  }
  if (current) chunks.push(current);
  return chunks;
}

type SaveStatus =
  | { kind: "idle" }
  | { kind: "saving" }
  | { kind: "success" }
  | { kind: "error"; message: string };

type ExportStatus =
  | { kind: "idle" }
  | { kind: "creating" }
  | {
      kind: "writing";
      documentUrl: string;
      documentId: string;
      written: number;
      total: number;
    }
  | {
      kind: "stopping";
      documentUrl: string;
      documentId: string;
      written: number;
      total: number;
    }
  | { kind: "done"; documentUrl: string; written: number; total: number }
  | { kind: "stopped"; documentUrl: string; written: number; total: number }
  | { kind: "error"; message: string; documentUrl?: string };

const DURATION_PRESETS = [
  { key: "30m", label: "30 min", seconds: 1800 },
  { key: "1h", label: "1 hr", seconds: 3600 },
  { key: "2h", label: "2 hrs", seconds: 7200 },
  { key: "6h", label: "6 hrs", seconds: 21600 },
  { key: "12h", label: "12 hrs", seconds: 43200 },
  { key: "1d", label: "1 day", seconds: 86400 },
  { key: "3d", label: "3 days", seconds: 259200 },
  { key: "1w", label: "1 week", seconds: 604800 },
] as const;

type PresetKey = (typeof DURATION_PRESETS)[number]["key"];
type DurationKey = PresetKey | "custom";

const PRESET_BY_KEY: Record<PresetKey, number> = DURATION_PRESETS.reduce(
  (acc, p) => {
    acc[p.key] = p.seconds;
    return acc;
  },
  {} as Record<PresetKey, number>,
);

function findPresetForDuration(totalSeconds: number): PresetKey | null {
  const match = DURATION_PRESETS.find((p) => p.seconds === totalSeconds);
  return match ? match.key : null;
}

function formatInterval(seconds: number): string {
  if (!isFinite(seconds) || seconds <= 0) return "—";
  if (seconds < 60) return `${Math.round(seconds)}s`;
  if (seconds < 3600) {
    const m = Math.floor(seconds / 60);
    const s = Math.round(seconds - m * 60);
    return s > 0 ? `${m}m ${s}s` : `${m}m`;
  }
  const h = Math.floor(seconds / 3600);
  const m = Math.round((seconds - h * 3600) / 60);
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

const inputClass =
  "w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 shadow-sm transition-all focus-visible:border-purple-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/20";

const labelClass =
  "block text-xs font-medium uppercase tracking-wide text-gray-500 mb-1.5";

const cardClass =
  "rounded-2xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md";

type Props = {
  docsConnected?: boolean;
};

export default function Scheduler({ docsConnected = false }: Props) {
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [chunkSize, setChunkSize] = useState(100);
  const [selectedDuration, setSelectedDuration] = useState<DurationKey>("1h");
  const [customInterval, setCustomInterval] = useState(5);
  const [isRunning, setIsRunning] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>({ kind: "idle" });
  const [refreshKey, setRefreshKey] = useState(0);
  const [exportStatus, setExportStatus] = useState<ExportStatus>({
    kind: "idle",
  });
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const successTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const exportStoppedRef = useRef(false);
  const exportSleepCancelRef = useRef<(() => void) | null>(null);

  const chunks = useMemo(
    () => splitIntoChunks(text, chunkSize),
    [text, chunkSize],
  );

  const intervalSeconds = useMemo(() => {
    if (selectedDuration === "custom") {
      return Math.max(1, Math.floor(customInterval));
    }
    const total = PRESET_BY_KEY[selectedDuration];
    if (chunks.length === 0) {
      // Fall back to a reasonable default until chunks are computed.
      return Math.max(1, Math.floor(total / 60));
    }
    return Math.max(1, Math.floor(total / chunks.length));
  }, [selectedDuration, customInterval, chunks.length]);

  useEffect(() => {
    if (!isRunning) return;

    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => {
        if (prev + 1 >= chunks.length) {
          clearInterval(timerRef.current!);
          setIsRunning(false);
          return chunks.length;
        }
        return prev + 1;
      });
    }, intervalSeconds * 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, intervalSeconds, chunks.length]);

  // Reset sent counter when inputs change so it never shows stale or out-of-bounds counts.
  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsRunning(false);
    setCurrentIndex(0);
  }, [text, chunkSize, intervalSeconds]);

  useEffect(() => {
    return () => {
      if (successTimerRef.current) clearTimeout(successTimerRef.current);
      // Cancel any in-flight export sleep on unmount.
      exportStoppedRef.current = true;
      exportSleepCancelRef.current?.();
    };
  }, []);

  function handleStart() {
    if (chunks.length === 0) return;
    setCurrentIndex(1);
    setIsRunning(true);
  }

  function handleStop() {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsRunning(false);
  }

  async function handleSave() {
    if (!user || !title.trim() || chunks.length === 0) return;
    if (successTimerRef.current) clearTimeout(successTimerRef.current);
    setSaveStatus({ kind: "saving" });
    try {
      await saveSchedule(user.uid, {
        title: title.trim(),
        originalText: text,
        chunks,
        chunkSize,
        interval: intervalSeconds,
      });
      setRefreshKey((k) => k + 1);
      setSaveStatus({ kind: "success" });
      successTimerRef.current = setTimeout(() => {
        setSaveStatus({ kind: "idle" });
      }, 2500);
    } catch (err) {
      setSaveStatus({
        kind: "error",
        message: err instanceof Error ? err.message : "Failed to save",
      });
    }
  }

  function cancellableSleep(ms: number): Promise<void> {
    return new Promise<void>((resolve) => {
      const id = setTimeout(() => {
        exportSleepCancelRef.current = null;
        resolve();
      }, ms);
      exportSleepCancelRef.current = () => {
        clearTimeout(id);
        exportSleepCancelRef.current = null;
        resolve();
      };
    });
  }

  function handleStopExport() {
    exportStoppedRef.current = true;
    exportSleepCancelRef.current?.();
    setExportStatus((prev) => {
      if (prev.kind === "writing") {
        return { ...prev, kind: "stopping" };
      }
      return prev;
    });
  }

  async function handleExport() {
    if (!docsConnected || chunks.length === 0) return;

    const snapshot = buildExportSegments(text);
    if (snapshot.length === 0) return;
    const total = snapshot.length;
    const intervalMs = Math.max(0, intervalSeconds) * 1000;
    const exportTitle = title.trim();

    exportStoppedRef.current = false;
    exportSleepCancelRef.current = null;
    setExportStatus({ kind: "creating" });

    let documentId: string;
    let documentUrl: string;
    try {
      const res = await fetch("/api/google-docs/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: exportTitle }),
      });
      const data = (await res.json().catch(() => null)) as
        | { documentId?: string; documentUrl?: string; error?: string }
        | null;
      if (!res.ok || !data?.documentId || !data?.documentUrl) {
        throw new Error(
          data?.error ?? `Failed to create document (HTTP ${res.status})`,
        );
      }
      documentId = data.documentId;
      documentUrl = data.documentUrl;
    } catch (err) {
      setExportStatus({
        kind: "error",
        message:
          err instanceof Error ? err.message : "Failed to create document",
      });
      return;
    }

    if (exportStoppedRef.current) {
      setExportStatus({ kind: "stopped", documentUrl, written: 0, total });
      return;
    }

    setExportStatus({
      kind: "writing",
      documentUrl,
      documentId,
      written: 0,
      total,
    });

    for (let i = 0; i < total; i++) {
      if (exportStoppedRef.current) {
        setExportStatus({
          kind: "stopped",
          documentUrl,
          written: i,
          total,
        });
        return;
      }

      if (i > 0 && intervalMs > 0) {
        await cancellableSleep(intervalMs);
        if (exportStoppedRef.current) {
          setExportStatus({
            kind: "stopped",
            documentUrl,
            written: i,
            total,
          });
          return;
        }
      }

      try {
        const res = await fetch("/api/google-docs/append", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ documentId, text: snapshot[i] }),
        });
        if (!res.ok) {
          const data = (await res.json().catch(() => null)) as
            | { error?: string }
            | null;
          throw new Error(
            data?.error ?? `Append failed (HTTP ${res.status})`,
          );
        }
        setExportStatus({
          kind: "writing",
          documentUrl,
          documentId,
          written: i + 1,
          total,
        });
      } catch (err) {
        setExportStatus({
          kind: "error",
          documentUrl,
          message: err instanceof Error ? err.message : "Append failed",
        });
        return;
      }
    }

    setExportStatus({ kind: "done", documentUrl, written: total, total });
  }

  function handleLoad(schedule: Schedule) {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsRunning(false);
    setCurrentIndex(0);
    setTitle(schedule.title);
    setText(schedule.originalText);
    setChunkSize(schedule.chunkSize);

    // Back-compute the duration from the saved interval × chunks.
    const totalSeconds = schedule.interval * schedule.chunks.length;
    const matchedPreset = findPresetForDuration(totalSeconds);
    if (matchedPreset) {
      setSelectedDuration(matchedPreset);
    } else {
      setSelectedDuration("custom");
      setCustomInterval(schedule.interval);
    }
  }

  const sentCount = Math.min(currentIndex, chunks.length);
  const isSaving = saveStatus.kind === "saving";
  const canSave = !isSaving && title.trim().length > 0 && chunks.length > 0;
  const isExporting =
    exportStatus.kind === "creating" ||
    exportStatus.kind === "writing" ||
    exportStatus.kind === "stopping";

  return (
    <div className="space-y-6">
      <section className={cardClass}>
        <div className="border-b border-gray-100 px-6 py-5">
          <h2 className="text-base font-semibold text-gray-900">
            New schedule
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Paste your text, pick a total duration, and let it drip.
          </p>
        </div>

        <div className="space-y-6 px-6 py-6">
          <div>
            <label className={labelClass}>Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Name this schedule"
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Total duration</label>
            <div className="flex flex-wrap gap-2">
              {DURATION_PRESETS.map((preset) => {
                const isActive = selectedDuration === preset.key;
                return (
                  <button
                    key={preset.key}
                    type="button"
                    onClick={() => setSelectedDuration(preset.key)}
                    className={
                      isActive
                        ? "inline-flex items-center rounded-full bg-purple-600 px-3.5 py-1.5 text-sm font-medium text-white shadow-sm transition-all hover:-translate-y-px hover:bg-purple-700 hover:shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2"
                        : "inline-flex items-center rounded-full border border-gray-200 bg-white px-3.5 py-1.5 text-sm font-medium text-gray-700 shadow-sm transition-all hover:-translate-y-px hover:bg-gray-50 hover:shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2"
                    }
                  >
                    {preset.label}
                  </button>
                );
              })}
              <button
                type="button"
                onClick={() => setSelectedDuration("custom")}
                className={
                  selectedDuration === "custom"
                    ? "inline-flex items-center rounded-full bg-purple-600 px-3.5 py-1.5 text-sm font-medium text-white shadow-sm transition-all hover:-translate-y-px hover:bg-purple-700 hover:shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2"
                    : "inline-flex items-center rounded-full border border-gray-200 bg-white px-3.5 py-1.5 text-sm font-medium text-gray-700 shadow-sm transition-all hover:-translate-y-px hover:bg-gray-50 hover:shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2"
                }
              >
                Custom
              </button>
            </div>

            {selectedDuration === "custom" && (
              <div className="mt-3 max-w-xs animate-fade-in-up">
                <label className={labelClass}>
                  Custom interval (seconds per chunk)
                </label>
                <input
                  type="number"
                  min={1}
                  value={customInterval}
                  onChange={(e) =>
                    setCustomInterval(Math.max(1, Number(e.target.value) || 1))
                  }
                  className={inputClass}
                />
              </div>
            )}

            {chunks.length > 0 && (
              <p className="mt-3 text-xs text-gray-500">
                Estimated drip interval:{" "}
                <span className="font-medium text-gray-700 tabular-nums">
                  {formatInterval(intervalSeconds)}
                </span>{" "}
                per chunk · {chunks.length} chunk
                {chunks.length === 1 ? "" : "s"}
              </p>
            )}
          </div>

          <div>
            <label className={labelClass}>Insert text</label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={10}
              placeholder="Paste your text here..."
              className={`${inputClass} resize-y leading-relaxed`}
            />
          </div>

          <div>
            <label className={labelClass}>Chunk size (chars)</label>
            <input
              type="number"
              value={chunkSize}
              onChange={(e) =>
                setChunkSize(Math.max(1, Number(e.target.value) || 1))
              }
              min={1}
              className={`${inputClass} max-w-xs`}
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <button
              onClick={handleStart}
              disabled={isRunning || chunks.length === 0}
              className="inline-flex items-center rounded-lg bg-purple-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:-translate-y-px hover:bg-purple-700 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-purple-600 disabled:hover:shadow-sm"
            >
              Start Dripping
            </button>
            {isRunning && (
              <button
                onClick={handleStop}
                className="inline-flex items-center rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:-translate-y-px hover:bg-red-700 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
              >
                Stop
              </button>
            )}
            <button
              onClick={handleSave}
              disabled={!canSave}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition-all hover:-translate-y-px hover:bg-gray-50 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-white disabled:hover:shadow-sm"
            >
              {isSaving && (
                <span className="h-3.5 w-3.5 rounded-full border-2 border-gray-300 border-t-gray-700 animate-spin" />
              )}
              {isSaving ? "Saving…" : "Save Schedule"}
            </button>

            <button
              onClick={handleExport}
              disabled={!docsConnected || chunks.length === 0 || isExporting}
              title={
                docsConnected
                  ? "Export this schedule to Google Docs"
                  : "Connect Google Docs to enable export"
              }
              className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition-all hover:-translate-y-px hover:bg-gray-50 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-white disabled:hover:shadow-sm"
            >
              {isExporting ? (
                <span className="h-3.5 w-3.5 rounded-full border-2 border-gray-300 border-t-purple-600 animate-spin" />
              ) : (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  className="h-4 w-4 text-purple-600"
                >
                  <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
                  <path d="M14 3v5h5" />
                  <path d="M9 13h6" />
                  <path d="M9 17h6" />
                </svg>
              )}
              {exportStatus.kind === "creating"
                ? "Creating doc…"
                : exportStatus.kind === "writing"
                  ? "Writing to Google Docs…"
                  : exportStatus.kind === "stopping"
                    ? "Stopping…"
                    : "Export to Google Docs"}
            </button>

            {(exportStatus.kind === "writing" ||
              exportStatus.kind === "stopping") && (
              <button
                onClick={handleStopExport}
                disabled={exportStatus.kind === "stopping"}
                className="inline-flex items-center rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:-translate-y-px hover:bg-red-700 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Stop Google Docs Writing
              </button>
            )}

            {saveStatus.kind === "success" && (
              <span className="animate-fade-in-up inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                Saved successfully
              </span>
            )}
            {saveStatus.kind === "error" && (
              <span className="animate-fade-in-up inline-flex items-center rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-medium text-red-700">
                {saveStatus.message}
              </span>
            )}
          </div>

          {(exportStatus.kind === "writing" ||
            exportStatus.kind === "stopping" ||
            exportStatus.kind === "done" ||
            exportStatus.kind === "stopped" ||
            (exportStatus.kind === "error" && exportStatus.documentUrl)) && (
            <div className="animate-fade-in-up rounded-lg border border-purple-100 bg-purple-50/60 px-4 py-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="min-w-0 text-sm text-gray-700">
                  {exportStatus.kind === "writing" && (
                    <span>
                      Writing to Google Docs:{" "}
                      <span className="font-semibold tabular-nums text-gray-900">
                        {exportStatus.written} / {exportStatus.total}
                      </span>{" "}
                      sentences
                    </span>
                  )}
                  {exportStatus.kind === "stopping" && (
                    <span>
                      Stopping… ({exportStatus.written} /{" "}
                      {exportStatus.total} written)
                    </span>
                  )}
                  {exportStatus.kind === "done" && (
                    <span className="font-medium text-emerald-700">
                      Exported successfully — {exportStatus.total} sentences
                      written.
                    </span>
                  )}
                  {exportStatus.kind === "stopped" && (
                    <span className="font-medium text-amber-700">
                      Stopped at {exportStatus.written} /{" "}
                      {exportStatus.total} sentences. Document was kept.
                    </span>
                  )}
                  {exportStatus.kind === "error" &&
                    exportStatus.documentUrl && (
                      <span className="font-medium text-red-700">
                        {exportStatus.message}
                      </span>
                    )}
                </div>
                {"documentUrl" in exportStatus && exportStatus.documentUrl && (
                  <a
                    href={exportStatus.documentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex shrink-0 items-center gap-1.5 rounded-md border border-purple-200 bg-white px-3 py-1.5 text-xs font-semibold text-purple-700 shadow-sm transition-all hover:-translate-y-px hover:bg-purple-50 hover:shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-1"
                  >
                    Open Google Doc
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                      className="h-3 w-3"
                    >
                      <path d="M14 3h7v7" />
                      <path d="M10 14L21 3" />
                      <path d="M21 14v7H3V3h7" />
                    </svg>
                  </a>
                )}
              </div>
            </div>
          )}

          {exportStatus.kind === "error" && !exportStatus.documentUrl && (
            <div className="animate-fade-in-up rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-medium text-red-700 break-words">
              {exportStatus.message}
            </div>
          )}
        </div>
      </section>

      {sentCount > 0 && (
        <section className={`${cardClass} animate-fade-in`}>
          <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
            <h2 className="text-base font-semibold text-gray-900">Sent</h2>
            <span className="text-sm tabular-nums text-gray-500">
              {sentCount} / {chunks.length}
            </span>
          </div>
          <ul className="divide-y divide-gray-100">
            {chunks.slice(0, sentCount).map((chunk, i) => (
              <li
                key={i}
                className="flex gap-3 px-6 py-3.5 text-sm text-gray-800 animate-fade-in-up"
              >
                <span className="font-mono text-xs text-gray-400">
                  #{i + 1}
                </span>
                <span className="flex-1">{chunk}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {chunks.length > 0 && sentCount === 0 && (
        <section className={`${cardClass} animate-fade-in`}>
          <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
            <h2 className="text-base font-semibold text-gray-900">Preview</h2>
            <span className="text-sm tabular-nums text-gray-500">
              {chunks.length} chunks
            </span>
          </div>
          <ul className="divide-y divide-gray-100">
            {chunks.map((chunk, i) => (
              <li
                key={i}
                className="flex gap-3 px-6 py-3.5 text-sm text-gray-800"
              >
                <span className="font-mono text-xs text-gray-400">
                  #{i + 1}
                </span>
                <span className="flex-1">{chunk}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <SavedSchedules onLoad={handleLoad} refreshKey={refreshKey} />
    </div>
  );
}
