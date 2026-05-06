import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  serverTimestamp,
  where,
  type Timestamp,
} from "firebase/firestore";
import { db } from "./firebase";

export type ScheduleDraft = {
  title: string;
  originalText: string;
  chunks: string[];
  chunkSize: number;
  interval: number;
  // TipTap JSON document. Optional for backward compatibility with schedules
  // saved before the rich editor was added.
  document?: object | null;
};

export type Schedule = ScheduleDraft & {
  id: string;
  userId: string;
  createdAt: Timestamp | null;
};

const COLLECTION = "schedules";

export async function saveSchedule(
  userId: string,
  draft: ScheduleDraft,
): Promise<string> {
  const payload: Record<string, unknown> = {
    title: draft.title,
    originalText: draft.originalText,
    chunks: draft.chunks,
    chunkSize: draft.chunkSize,
    interval: draft.interval,
    userId,
    createdAt: serverTimestamp(),
  };
  // Only include `document` when present so older schedules don't add a null field.
  if (draft.document !== undefined && draft.document !== null) {
    payload.document = draft.document;
  }
  const ref = await addDoc(collection(db, COLLECTION), payload);
  return ref.id;
}

export async function listSchedules(userId: string): Promise<Schedule[]> {
  const q = query(collection(db, COLLECTION), where("userId", "==", userId));
  const snapshot = await getDocs(q);
  const schedules = snapshot.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id,
      title: data.title,
      originalText: data.originalText,
      chunks: data.chunks,
      chunkSize: data.chunkSize,
      interval: data.interval,
      userId: data.userId,
      createdAt: (data.createdAt as Timestamp | null) ?? null,
      document:
        typeof data.document === "object" && data.document !== null
          ? (data.document as object)
          : null,
    } satisfies Schedule;
  });

  schedules.sort((a, b) => {
    const aMs = a.createdAt?.toMillis() ?? 0;
    const bMs = b.createdAt?.toMillis() ?? 0;
    return bMs - aMs;
  });

  return schedules;
}

export async function deleteSchedule(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTION, id));
}
