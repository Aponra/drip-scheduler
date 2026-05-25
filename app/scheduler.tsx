"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { saveSchedule, type Schedule } from "@/lib/schedules";
import {
  documentToBlocks,
  documentToPlainText,
  plainTextToDocument,
} from "@/lib/doc-model";
import {
  buildBulletsRequest,
  prepareBlockExport,
  type GDocsRequest,
} from "@/lib/google-docs-builder";
import { validateSession, type ValidationResult } from "@/lib/session-validator";
import { RATE_LIMITS } from "@/lib/rate-limit-config";
import SavedSchedules from "./saved-schedules";
import RichEditor, { type EditorHandle } from "./editor";

// ─────────────────────────────────────────────────────────────────────────────
// Document parsing helpers (client-side; libs are dynamically imported so they
// don't bloat the initial bundle). For .docx we now extract HTML so the
// rich-text editor can preserve bold/italic/headings/lists from the source.
// ─────────────────────────────────────────────────────────────────────────────

const ALLOWED_EXTENSIONS = ["txt", "md", "docx", "pdf"] as const;
const MAX_FILE_SIZE_BYTES = 25 * 1024 * 1024; // 25 MB
const MAX_FILE_SIZE_LABEL = "25 MB";

function fileExtension(name: string): string {
  const i = name.lastIndexOf(".");
  return i >= 0 ? name.slice(i + 1).toLowerCase() : "";
}

type ParsedFile =
  | { kind: "html"; html: string; plainText: string }
  | { kind: "text"; text: string };

async function parseFile(file: File): Promise<ParsedFile> {
  const ext = fileExtension(file.name);
  if (!ALLOWED_EXTENSIONS.includes(ext as (typeof ALLOWED_EXTENSIONS)[number])) {
    throw new Error(
      `Unsupported file type${ext ? ` (.${ext})` : ""}. Use .txt, .md, .docx, or .pdf.`,
    );
  }
  if (file.size > MAX_FILE_SIZE_BYTES) {
    throw new Error(`File is larger than ${MAX_FILE_SIZE_LABEL}.`);
  }

  if (ext === "txt" || ext === "md") {
    return { kind: "text", text: await file.text() };
  }

  if (ext === "docx") {
    const mammoth = await import("mammoth");
    const arrayBuffer = await file.arrayBuffer();
    // convertToHtml preserves bold/italic/headings/lists from the .docx;
    // mammoth strips most exotic styling.
    const result = await mammoth.convertToHtml({ arrayBuffer });
    const plain = (
      await mammoth.extractRawText({ arrayBuffer })
    ).value;
    return { kind: "html", html: result.value, plainText: plain };
  }

  if (ext === "pdf") {
    const pdfjs = await import("pdfjs-dist");
    try {
      pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`;
    } catch {
      // ignore — some bundles already preconfigure a worker
    }
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
    const pages: string[] = [];
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const items = content.items.flatMap((it) => {
        const str = (it as { str?: unknown }).str;
        return typeof str === "string" ? [str] : [];
      });
      pages.push(items.join(" "));
    }
    return { kind: "text", text: pages.join("\n\n") };
  }

  throw new Error("Unsupported file type.");
}

// ─────────────────────────────────────────────────────────────────────────────
// Local-side chunking (for the Sent/Preview cards in the UI). Operates on the
// plain-text projection of the rich document.
// ─────────────────────────────────────────────────────────────────────────────

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
      jobId: string;
      written: number;
      total: number;
      failed: number;
    }
  | {
      kind: "stopping";
      documentUrl: string;
      documentId: string;
      jobId: string;
      written: number;
      total: number;
      failed: number;
    }
  | {
      kind: "done";
      documentUrl: string;
      jobId?: string;
      written: number;
      total: number;
      failed: number;
    }
  | {
      kind: "stopped";
      documentUrl: string;
      jobId?: string;
      written: number;
      total: number;
      failed: number;
    }
  | { kind: "error"; message: string; documentUrl?: string; jobId?: string };

type UploadStatus =
  | { kind: "idle" }
  | { kind: "parsing"; filename: string }
  | { kind: "success"; filename: string }
  | { kind: "error"; message: string };

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
  "w-full rounded-lg border border-gray-700 bg-gray-800 px-3.5 py-2.5 text-sm text-white placeholder-gray-500 shadow-sm transition-all focus-visible:border-purple-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/20";

const labelClass =
  "block text-xs font-medium uppercase tracking-wide text-gray-400 mb-1.5";

const cardClass =
  "rounded-2xl border border-gray-800 bg-gray-900 shadow-sm transition-shadow hover:shadow-md";

const GOOGLE_DOC_BODY_START = 1;

// Session storage key for draft from landing page (must match hero-client.tsx)
const DRAFT_KEY = "schedulerDraft";

// Map hero durations to scheduler preset keys
const HERO_DURATION_MAP: Record<string, PresetKey> = {
  "30 min": "30m",
  "1 hour": "1h",
  "2 hours": "2h",
  "6 hours": "6h",
  "1 day": "1d",
  "1 week": "1w",
};

type Props = {
  docsConnected?: boolean;
};

export default function Scheduler({ docsConnected = false }: Props) {
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  // Two synchronized projections of the rich editor content.
  const [docJson, setDocJson] = useState<object | null>(null);
  const [plainText, setPlainText] = useState("");
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
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>({
    kind: "idle",
  });
  const [isDraggingFile, setIsDraggingFile] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const editorRef = useRef<EditorHandle | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const successTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const uploadSuccessTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const exportStoppedRef = useRef(false);
  const exportSleepCancelRef = useRef<(() => void) | null>(null);
  const draftRestoredRef = useRef(false);
  const jobPollingRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Restore draft from landing page on mount
  useEffect(() => {
    if (draftRestoredRef.current) return;
    draftRestoredRef.current = true;

    try {
      const saved = sessionStorage.getItem(DRAFT_KEY);
      if (!saved) return;

      const draft = JSON.parse(saved) as {
        text?: string;
        duration?: string;
        timestamp?: number;
      };

      // Only restore if draft is less than 1 hour old
      const maxAge = 60 * 60 * 1000; // 1 hour
      if (draft.timestamp && Date.now() - draft.timestamp > maxAge) {
        sessionStorage.removeItem(DRAFT_KEY);
        return;
      }

      // Restore duration immediately
      if (draft.duration && HERO_DURATION_MAP[draft.duration]) {
        setSelectedDuration(HERO_DURATION_MAP[draft.duration]);
      }

      // Restore text with a small delay to ensure editor is mounted
      if (draft.text) {
        setPlainText(draft.text);
        const doc = plainTextToDocument(draft.text);
        setDocJson(doc);

        // Wait for editor to mount, then set content
        const trySetText = (attempts: number) => {
          if (editorRef.current) {
            editorRef.current.setText(draft.text!);
          } else if (attempts < 10) {
            setTimeout(() => trySetText(attempts + 1), 100);
          }
        };
        setTimeout(() => trySetText(0), 100);
      }

      // Clear the draft after restoring
      sessionStorage.removeItem(DRAFT_KEY);
    } catch {
      // sessionStorage may be unavailable or JSON invalid; ignore
    }
  }, []);

  const chunks = useMemo(
    () => splitIntoChunks(plainText, chunkSize),
    [plainText, chunkSize],
  );

  const intervalSeconds = useMemo(() => {
    if (selectedDuration === "custom") {
      return Math.max(1, Math.floor(customInterval));
    }
    const total = PRESET_BY_KEY[selectedDuration];
    if (chunks.length === 0) {
      return Math.max(1, Math.floor(total / 60));
    }
    return Math.max(1, Math.floor(total / chunks.length));
  }, [selectedDuration, customInterval, chunks.length]);

  // Session validation for rate limiting
  const sessionValidation = useMemo((): ValidationResult | null => {
    if (chunks.length === 0) return null;

    // Calculate total duration based on selection
    let durationSeconds: number;
    if (selectedDuration === "custom") {
      durationSeconds = customInterval * chunks.length;
    } else {
      durationSeconds = PRESET_BY_KEY[selectedDuration];
    }

    return validateSession(chunks.length, durationSeconds);
  }, [chunks.length, selectedDuration, customInterval]);

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
  }, [plainText, chunkSize, intervalSeconds]);

  useEffect(() => {
    return () => {
      if (successTimerRef.current) clearTimeout(successTimerRef.current);
      if (uploadSuccessTimerRef.current)
        clearTimeout(uploadSuccessTimerRef.current);
      if (jobPollingRef.current) clearTimeout(jobPollingRef.current);
      exportStoppedRef.current = true;
      exportSleepCancelRef.current?.();
    };
  }, []);

  function handleEditorChange({
    json,
    plainText: pt,
  }: {
    json: object;
    plainText: string;
  }) {
    setDocJson(json);
    setPlainText(pt);
  }

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
        originalText: plainText,
        chunks,
        chunkSize,
        interval: intervalSeconds,
        document: docJson,
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

  // ─── Job-based Export Functions ────────────────────────────────────────

  function stopJobPolling() {
    if (jobPollingRef.current) {
      clearTimeout(jobPollingRef.current);
      jobPollingRef.current = null;
    }
  }

  async function pollJobStatus(jobId: string) {
    try {
      const res = await fetch(`/api/jobs/${jobId}`);
      if (!res.ok) {
        const error = await res.json().catch(() => ({ error: "Failed to fetch job status" }));
        throw new Error(error.error || `HTTP ${res.status}`);
      }

      const job = await res.json();
      const { status, documentUrl, progress, lastError } = job;

      // Update export status based on job status
      switch (status) {
        case "pending":
        case "running":
          setExportStatus({
            kind: "writing",
            documentUrl,
            documentId: job.documentId,
            jobId,
            written: progress.written,
            total: progress.total,
            failed: progress.failed,
          });
          // Continue polling
          jobPollingRef.current = setTimeout(() => pollJobStatus(jobId), 3000);
          break;

        case "paused":
          setExportStatus({
            kind: "stopping",
            documentUrl,
            documentId: job.documentId,
            jobId,
            written: progress.written,
            total: progress.total,
            failed: progress.failed,
          });
          break;

        case "completed":
          setExportStatus({
            kind: "done",
            documentUrl,
            jobId,
            written: progress.written,
            total: progress.total,
            failed: progress.failed,
          });
          stopJobPolling();
          break;

        case "cancelled":
          setExportStatus({
            kind: "stopped",
            documentUrl,
            jobId,
            written: progress.written,
            total: progress.total,
            failed: progress.failed,
          });
          stopJobPolling();
          break;

        case "failed":
          setExportStatus({
            kind: "error",
            message: lastError || "Job failed",
            documentUrl,
            jobId,
          });
          stopJobPolling();
          break;

        default:
          // Unknown status, keep polling
          jobPollingRef.current = setTimeout(() => pollJobStatus(jobId), 5000);
      }
    } catch (err) {
      console.error("[job-polling] Error:", err);
      // Retry polling on error
      jobPollingRef.current = setTimeout(() => pollJobStatus(jobId), 5000);
    }
  }

  async function handleStopExport() {
    const currentStatus = exportStatus;
    if (currentStatus.kind !== "writing" && currentStatus.kind !== "stopping") {
      return;
    }

    const jobId = currentStatus.jobId;

    // Update UI immediately
    setExportStatus({
      ...currentStatus,
      kind: "stopping",
    });

    try {
      const res = await fetch(`/api/jobs/${jobId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "cancel" }),
      });

      if (!res.ok) {
        const error = await res.json().catch(() => ({ error: "Failed to cancel job" }));
        console.error("[handleStopExport] Error:", error.error);
      }

      // Stop polling - the last poll will update the final status
      stopJobPolling();

      // Set stopped status
      setExportStatus({
        kind: "stopped",
        documentUrl: currentStatus.documentUrl,
        jobId,
        written: currentStatus.written,
        total: currentStatus.total,
        failed: currentStatus.failed,
      });
    } catch (err) {
      console.error("[handleStopExport] Error:", err);
      // Still mark as stopped locally
      setExportStatus({
        kind: "stopped",
        documentUrl: currentStatus.documentUrl,
        jobId,
        written: currentStatus.written,
        total: currentStatus.total,
        failed: currentStatus.failed,
      });
    }
  }

  async function handleExport() {
    if (!docsConnected || chunks.length === 0) return;
    if (!user) return;

    // Validate session before starting
    if (sessionValidation && !sessionValidation.valid) {
      setExportStatus({
        kind: "error",
        message: sessionValidation.error || "Session validation failed",
      });
      return;
    }

    // Build document JSON
    const sourceJson = docJson ?? plainTextToDocument(plainText);
    const exportTitle = title.trim() || "Docs Version History Export";

    // Calculate duration in seconds
    let durationSeconds: number;
    if (selectedDuration === "custom") {
      durationSeconds = customInterval * chunks.length;
    } else {
      durationSeconds = PRESET_BY_KEY[selectedDuration];
    }

    // Stop any existing polling
    stopJobPolling();
    exportStoppedRef.current = false;
    setExportStatus({ kind: "creating" });

    try {
      // Create job via API
      const res = await fetch("/api/jobs/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.uid,
          title: exportTitle,
          document: sourceJson,
          durationSeconds,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || `Failed to create job (HTTP ${res.status})`);
      }

      const { jobId, documentId, documentUrl, job } = data;

      // Set initial writing status
      setExportStatus({
        kind: "writing",
        documentUrl,
        documentId,
        jobId,
        written: 0,
        total: job.progress.total,
        failed: 0,
      });

      // Start polling for job status
      jobPollingRef.current = setTimeout(() => pollJobStatus(jobId), 2000);

    } catch (err) {
      setExportStatus({
        kind: "error",
        message: err instanceof Error ? err.message : "Failed to create export job",
      });
    }
  }

  function handleLoad(schedule: Schedule) {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsRunning(false);
    setCurrentIndex(0);
    setTitle(schedule.title);
    setChunkSize(schedule.chunkSize);

    if (schedule.document && typeof schedule.document === "object") {
      // Rich-content schedule: load the JSON into the editor.
      editorRef.current?.setJson(schedule.document);
      setDocJson(schedule.document);
      setPlainText(documentToPlainText(schedule.document));
    } else {
      // Legacy plain-text schedule: hydrate the editor with paragraphs.
      editorRef.current?.setText(schedule.originalText);
      const doc = plainTextToDocument(schedule.originalText);
      setDocJson(doc);
      setPlainText(schedule.originalText);
    }

    const totalSeconds = schedule.interval * schedule.chunks.length;
    const matchedPreset = findPresetForDuration(totalSeconds);
    if (matchedPreset) {
      setSelectedDuration(matchedPreset);
    } else {
      setSelectedDuration("custom");
      setCustomInterval(schedule.interval);
    }
  }

  // ────────────── Upload / import ──────────────

  async function ingestFile(file: File) {
    if (uploadSuccessTimerRef.current)
      clearTimeout(uploadSuccessTimerRef.current);
    setUploadStatus({ kind: "parsing", filename: file.name });
    try {
      const parsed = await parseFile(file);
      if (parsed.kind === "html") {
        // .docx via mammoth: feed HTML to the editor so formatting is preserved.
        editorRef.current?.setHtml(parsed.html);
        // Plain text projection follows the editor onUpdate; but seed it now
        // so the chunk count line updates immediately for fast first paint.
        setPlainText(
          parsed.plainText.replace(/\r\n/g, "\n").replace(/\r/g, "\n"),
        );
      } else {
        const normalized = parsed.text
          .replace(/\r\n/g, "\n")
          .replace(/\r/g, "\n");
        editorRef.current?.setText(normalized);
        setPlainText(normalized);
      }
      setUploadStatus({ kind: "success", filename: file.name });
      uploadSuccessTimerRef.current = setTimeout(() => {
        setUploadStatus({ kind: "idle" });
      }, 4000);
    } catch (err) {
      setUploadStatus({
        kind: "error",
        message: err instanceof Error ? err.message : "Failed to import file",
      });
    }
  }

  function handleFileInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) ingestFile(file);
    e.target.value = "";
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDraggingFile(false);
    const file = e.dataTransfer.files?.[0];
    if (file) ingestFile(file);
  }

  function handleDragOver(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDraggingFile(true);
  }

  function handleDragLeave(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDraggingFile(false);
  }

  function openFilePicker() {
    fileInputRef.current?.click();
  }

  // ────────────── Derived flags ──────────────

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
        <div className="border-b border-gray-800 px-6 py-5">
          <h2 className="text-base font-semibold text-white">
            New schedule
          </h2>
          <p className="mt-1 text-sm text-gray-400">
            Write or import a document, pick a total duration, and schedule it.
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
                        ? "inline-flex items-center rounded-full bg-purple-600 px-3.5 py-1.5 text-sm font-medium text-white shadow-sm transition-all hover:-translate-y-px hover:bg-purple-700 hover:shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900"
                        : "inline-flex items-center rounded-full border border-gray-700 bg-gray-800 px-3.5 py-1.5 text-sm font-medium text-gray-300 shadow-sm transition-all hover:-translate-y-px hover:bg-gray-700 hover:shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900"
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
                    ? "inline-flex items-center rounded-full bg-purple-600 px-3.5 py-1.5 text-sm font-medium text-white shadow-sm transition-all hover:-translate-y-px hover:bg-purple-700 hover:shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900"
                    : "inline-flex items-center rounded-full border border-gray-700 bg-gray-800 px-3.5 py-1.5 text-sm font-medium text-gray-300 shadow-sm transition-all hover:-translate-y-px hover:bg-gray-700 hover:shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900"
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
              <p className="mt-3 text-xs text-gray-400">
                Estimated interval:{" "}
                <span className="font-medium text-gray-200 tabular-nums">
                  {formatInterval(intervalSeconds)}
                </span>{" "}
                per chunk · {chunks.length} chunk
                {chunks.length === 1 ? "" : "s"}
              </p>
            )}

            {/* Session Validation Display */}
            {sessionValidation && (
              <div className="mt-4 rounded-lg border border-gray-700 bg-gray-800/50 p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-medium uppercase tracking-wide text-gray-400">
                    Session Estimate
                  </h4>
                  {sessionValidation.valid ? (
                    sessionValidation.stats.isSafe ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-400">
                        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Safe
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-xs font-medium text-amber-400">
                        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        Warning
                      </span>
                    )
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-red-500/10 px-2 py-0.5 text-xs font-medium text-red-400">
                      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Invalid
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-500">Blocks:</span>
                    <span className="ml-2 font-medium text-gray-200 tabular-nums">
                      {sessionValidation.stats.totalBlocks}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Duration:</span>
                    <span className="ml-2 font-medium text-gray-200">
                      {sessionValidation.stats.estimatedDuration.display}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Write Rate:</span>
                    <span className={`ml-2 font-medium tabular-nums ${
                      sessionValidation.stats.isSafe
                        ? "text-emerald-400"
                        : sessionValidation.stats.isAllowed
                          ? "text-amber-400"
                          : "text-red-400"
                    }`}>
                      ~{Math.round(sessionValidation.stats.writesPerMinute)}/min
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Limit:</span>
                    <span className="ml-2 font-medium text-gray-200">
                      {RATE_LIMITS.SAFE_WRITES_PER_MINUTE}/min
                    </span>
                  </div>
                </div>

                {/* Warnings */}
                {sessionValidation.warnings.length > 0 && (
                  <div className="mt-3 rounded border border-amber-500/30 bg-amber-500/10 px-3 py-2">
                    {sessionValidation.warnings.map((warning, i) => (
                      <p key={i} className="text-xs text-amber-400">
                        {warning}
                      </p>
                    ))}
                  </div>
                )}

                {/* Error */}
                {!sessionValidation.valid && sessionValidation.error && (
                  <div className="mt-3 rounded border border-red-500/30 bg-red-500/10 px-3 py-2">
                    <p className="text-xs text-red-400">{sessionValidation.error}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Upload zone */}
          <div>
            <label className={labelClass}>Import a document (optional)</label>
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={openFilePicker}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  openFilePicker();
                }
              }}
              className={
                "flex cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed px-6 py-6 text-center transition-all " +
                (isDraggingFile
                  ? "border-purple-400 bg-purple-500/10"
                  : "border-gray-700 bg-gray-800/40 hover:border-purple-500 hover:bg-purple-500/10")
              }
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-purple-500/20 text-purple-400">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  className="h-5 w-5"
                >
                  <path d="M12 3v12" />
                  <path d="M7 8l5-5 5 5" />
                  <path d="M5 21h14" />
                </svg>
              </div>
              <p className="text-sm font-medium text-gray-200">
                Drop a file here, or click to browse
              </p>
              <p className="text-xs text-gray-400">
                .txt, .md, .docx, .pdf · up to {MAX_FILE_SIZE_LABEL}
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".txt,.md,.docx,.pdf,text/plain,text/markdown,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/pdf"
                className="hidden"
                onChange={handleFileInputChange}
              />
            </div>

            {uploadStatus.kind === "parsing" && (
              <div className="mt-2 inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-1 text-xs font-medium text-purple-400">
                <span className="h-3 w-3 rounded-full border-2 border-purple-400/30 border-t-purple-400 animate-spin" />
                Parsing {uploadStatus.filename}…
              </div>
            )}
            {uploadStatus.kind === "success" && (
              <div className="mt-2 animate-fade-in-up inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.25"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  className="h-3 w-3"
                >
                  <path d="M20 6L9 17l-5-5" />
                </svg>
                Imported {uploadStatus.filename}
              </div>
            )}
            {uploadStatus.kind === "error" && (
              <div className="mt-2 animate-fade-in-up inline-flex max-w-full items-start rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs font-medium text-red-400 break-words whitespace-normal">
                {uploadStatus.message}
              </div>
            )}
          </div>

          <div>
            <label className={labelClass}>Document</label>
            <RichEditor
              ref={editorRef}
              onChange={handleEditorChange}
              placeholder="Write here, or import a document above…"
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
              Start Scheduling
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
              className="inline-flex items-center gap-2 rounded-lg border border-gray-700 bg-gray-800 px-4 py-2.5 text-sm font-medium text-gray-300 shadow-sm transition-all hover:-translate-y-px hover:bg-gray-700 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900 disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-gray-800 disabled:hover:shadow-sm"
            >
              {isSaving && (
                <span className="h-3.5 w-3.5 rounded-full border-2 border-gray-300 border-t-gray-700 animate-spin" />
              )}
              {isSaving ? "Saving…" : "Save Schedule"}
            </button>

            <button
              onClick={handleExport}
              disabled={!docsConnected || chunks.length === 0 || isExporting || (sessionValidation !== null && !sessionValidation.valid)}
              title={
                !docsConnected
                  ? "Connect Google Docs to enable export"
                  : sessionValidation && !sessionValidation.valid
                    ? "Session parameters are invalid - check the validation above"
                    : "Export this schedule to Google Docs"
              }
              className="inline-flex items-center gap-2 rounded-lg border border-gray-700 bg-gray-800 px-4 py-2.5 text-sm font-medium text-gray-300 shadow-sm transition-all hover:-translate-y-px hover:bg-gray-700 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900 disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-gray-800 disabled:hover:shadow-sm"
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

            <Link
              href="/ai-detector"
              className="inline-flex items-center gap-2 rounded-lg border border-purple-500/30 bg-gradient-to-r from-purple-500/10 to-fuchsia-500/10 px-4 py-2.5 text-sm font-medium text-purple-400 shadow-sm transition-all hover:-translate-y-px hover:from-purple-500/20 hover:to-fuchsia-500/20 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                className="h-4 w-4"
              >
                <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z" />
                <path d="M5 19l1 3 1-3 3-1-3-1-1-3-1 3-3 1 3 1z" />
              </svg>
              AI Detector & Rewriter
            </Link>

            {saveStatus.kind === "success" && (
              <span className="animate-fade-in-up inline-flex items-center rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
                Saved successfully
              </span>
            )}
            {saveStatus.kind === "error" && (
              <span className="animate-fade-in-up inline-flex items-center rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1 text-xs font-medium text-red-400">
                {saveStatus.message}
              </span>
            )}
          </div>

          {(exportStatus.kind === "writing" ||
            exportStatus.kind === "stopping" ||
            exportStatus.kind === "done" ||
            exportStatus.kind === "stopped" ||
            (exportStatus.kind === "error" && exportStatus.documentUrl)) && (
            <div className="animate-fade-in-up rounded-lg border border-purple-500/30 bg-purple-500/10 px-4 py-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="min-w-0 text-sm text-gray-300">
                  {exportStatus.kind === "writing" && (
                    <span>
                      Writing to Google Docs:{" "}
                      <span className="font-semibold tabular-nums text-white">
                        {exportStatus.written} / {exportStatus.total}
                      </span>{" "}
                      blocks
                      {exportStatus.failed > 0 && (
                        <span className="ml-2 text-amber-400">
                          · {exportStatus.failed} failed
                        </span>
                      )}
                    </span>
                  )}
                  {exportStatus.kind === "stopping" && (
                    <span>
                      Stopping… ({exportStatus.written} /{" "}
                      {exportStatus.total} written
                      {exportStatus.failed > 0
                        ? `, ${exportStatus.failed} failed`
                        : ""}
                      )
                    </span>
                  )}
                  {exportStatus.kind === "done" &&
                    (exportStatus.failed === 0 ? (
                      <span className="font-medium text-emerald-400">
                        Exported successfully — {exportStatus.total} blocks
                        written.
                      </span>
                    ) : (
                      <span className="font-medium text-amber-400">
                        Exported with {exportStatus.failed} error
                        {exportStatus.failed === 1 ? "" : "s"} —{" "}
                        {exportStatus.written} of {exportStatus.total}{" "}
                        blocks written.
                      </span>
                    ))}
                  {exportStatus.kind === "stopped" && (
                    <span className="font-medium text-amber-400">
                      Stopped at {exportStatus.written} /{" "}
                      {exportStatus.total} blocks
                      {exportStatus.failed > 0
                        ? ` (${exportStatus.failed} failed)`
                        : ""}
                      . Document was kept.
                    </span>
                  )}
                  {exportStatus.kind === "error" &&
                    exportStatus.documentUrl && (
                      <span className="font-medium text-red-400">
                        {exportStatus.message}
                      </span>
                    )}
                </div>
                {"documentUrl" in exportStatus && exportStatus.documentUrl && (
                  <a
                    href={exportStatus.documentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex shrink-0 items-center gap-1.5 rounded-md border border-purple-500/30 bg-gray-800 px-3 py-1.5 text-xs font-semibold text-purple-400 shadow-sm transition-all hover:-translate-y-px hover:bg-gray-700 hover:shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-1 focus-visible:ring-offset-gray-900"
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
            <div className="animate-fade-in-up rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm font-medium text-red-400 break-words">
              {exportStatus.message}
            </div>
          )}
        </div>
      </section>

      {sentCount > 0 && (
        <section className={`${cardClass} animate-fade-in`}>
          <div className="flex items-center justify-between border-b border-gray-800 px-6 py-5">
            <h2 className="text-base font-semibold text-white">Sent</h2>
            <span className="text-sm tabular-nums text-gray-400">
              {sentCount} / {chunks.length}
            </span>
          </div>
          <ul className="divide-y divide-gray-800">
            {chunks.slice(0, sentCount).map((chunk, i) => (
              <li
                key={i}
                className="flex gap-3 px-6 py-3.5 text-sm text-gray-300 animate-fade-in-up"
              >
                <span className="font-mono text-xs text-gray-500">
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
          <div className="flex items-center justify-between border-b border-gray-800 px-6 py-5">
            <h2 className="text-base font-semibold text-white">Preview</h2>
            <span className="text-sm tabular-nums text-gray-400">
              {chunks.length} chunks
            </span>
          </div>
          <ul className="divide-y divide-gray-800">
            {chunks.map((chunk, i) => (
              <li
                key={i}
                className="flex gap-3 px-6 py-3.5 text-sm text-gray-300"
              >
                <span className="font-mono text-xs text-gray-500">
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
