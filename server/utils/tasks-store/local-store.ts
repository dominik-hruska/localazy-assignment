import { promises as fs } from "node:fs";
import { join } from "node:path";
import type { Task } from "~/types/tasks";
import { SEED_TASKS } from "./seed";

const DATA_DIR = join(process.cwd(), "server", "data");
const TASKS_FILE = join(DATA_DIR, "tasks.json");

const serializeTasks = (tasks: Task[]) => JSON.stringify(tasks, null, 2);
const parseTasks = (raw: string | null | undefined) =>
  raw ? (JSON.parse(raw) as Task[]) : null;

const ensureDataFile = async () => {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(TASKS_FILE);
  } catch {
    await fs.writeFile(TASKS_FILE, serializeTasks(SEED_TASKS), "utf8");
  }
};

export const readLocalTasks = async (): Promise<Task[]> => {
  await ensureDataFile();
  const raw = await fs.readFile(TASKS_FILE, "utf8");
  return parseTasks(raw) ?? [...SEED_TASKS];
};

export const writeLocalTasks = async (tasks: Task[]): Promise<void> => {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(TASKS_FILE, serializeTasks(tasks), "utf8");
};
