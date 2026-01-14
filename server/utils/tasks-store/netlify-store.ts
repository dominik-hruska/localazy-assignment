import type { Task } from "~/types/tasks";
import { SEED_TASKS } from "./seed";

const BLOB_STORE = "tasks";
const BLOB_KEY = "tasks.json";

const serializeTasks = (tasks: Task[]) => JSON.stringify(tasks, null, 2);
const parseTasks = (raw: string | null | undefined) =>
  raw ? (JSON.parse(raw) as Task[]) : null;

const getBlobStore = async () => {
  const { getStore } = await import("@netlify/blobs");
  return getStore(BLOB_STORE);
};

export const readNetlifyTasks = async (): Promise<Task[]> => {
  const store = await getBlobStore();
  const raw = await store.get(BLOB_KEY, { type: "text" });
  const parsed = parseTasks(raw);
  if (parsed) return parsed;

  await store.set(BLOB_KEY, serializeTasks(SEED_TASKS));
  return [...SEED_TASKS];
};

export const writeNetlifyTasks = async (tasks: Task[]): Promise<void> => {
  const store = await getBlobStore();
  await store.set(BLOB_KEY, serializeTasks(tasks));
};
