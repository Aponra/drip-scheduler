import { NextResponse, type NextRequest } from "next/server";
import { getJob, updateJobStatus } from "@/lib/job-manager";
import {
  toJobResponse,
  VALID_JOB_TRANSITIONS,
  getStatusAfterAction,
  type JobStatus,
} from "@/lib/firestore-schema";
import { getFirebaseDb } from "@/lib/firebase-lazy";

// ─── GET /api/jobs/[jobId] ────────────────────────────────────────────────
// Get job status and progress

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ jobId: string }> },
) {
  const { jobId } = await params;

  if (!jobId) {
    return NextResponse.json({ error: "jobId is required" }, { status: 400 });
  }

  const db = await getFirebaseDb();
  const job = await getJob(db, jobId);

  if (!job) {
    return NextResponse.json({ error: "Job not found" }, { status: 404 });
  }

  return NextResponse.json(toJobResponse(job));
}

// ─── PATCH /api/jobs/[jobId] ──────────────────────────────────────────────
// Pause, resume, or cancel a job

type PatchBody = {
  action?: unknown;
};

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ jobId: string }> },
) {
  const { jobId } = await params;

  if (!jobId) {
    return NextResponse.json({ error: "jobId is required" }, { status: 400 });
  }

  // Parse request body
  let body: PatchBody;
  try {
    body = (await request.json()) as PatchBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const action = typeof body.action === "string" ? body.action : "";

  if (!["pause", "resume", "cancel"].includes(action)) {
    return NextResponse.json(
      { error: 'action must be one of: "pause", "resume", "cancel"' },
      { status: 400 },
    );
  }

  const db = await getFirebaseDb();
  const job = await getJob(db, jobId);

  if (!job) {
    return NextResponse.json({ error: "Job not found" }, { status: 404 });
  }

  // Validate state transition
  const validFromStatuses = VALID_JOB_TRANSITIONS[action];
  if (!validFromStatuses || !validFromStatuses.includes(job.status)) {
    return NextResponse.json(
      {
        error: `Cannot ${action} a job with status "${job.status}"`,
        currentStatus: job.status,
        validFromStatuses,
      },
      { status: 400 },
    );
  }

  // Perform the state transition
  const newStatus = getStatusAfterAction(action as "pause" | "resume" | "cancel");

  await updateJobStatus(db, jobId, newStatus);

  // Refetch to get updated timestamps
  const updatedJob = await getJob(db, jobId);

  return NextResponse.json({
    message: `Job ${action}d successfully`,
    previousStatus: job.status,
    newStatus,
    job: updatedJob ? toJobResponse(updatedJob) : null,
  });
}

// ─── DELETE /api/jobs/[jobId] ─────────────────────────────────────────────
// Cancel and optionally delete a job

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ jobId: string }> },
) {
  const { jobId } = await params;

  if (!jobId) {
    return NextResponse.json({ error: "jobId is required" }, { status: 400 });
  }

  const db = await getFirebaseDb();
  const job = await getJob(db, jobId);

  if (!job) {
    return NextResponse.json({ error: "Job not found" }, { status: 404 });
  }

  // If job is still active, cancel it first
  if (["pending", "running", "paused"].includes(job.status)) {
    await updateJobStatus(db, jobId, "cancelled");
  }

  return NextResponse.json({
    message: "Job cancelled successfully",
    previousStatus: job.status,
    newStatus: "cancelled" as JobStatus,
  });
}
