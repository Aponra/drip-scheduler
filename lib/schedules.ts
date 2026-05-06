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
  const ref = await addDoc(collection(db, COLLECTION), {
    ...draft,
    userId,
    createdAt: serverTimestamp(),
  });
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
