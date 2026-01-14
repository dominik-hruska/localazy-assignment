import { promises as fs } from "node:fs";
import { join } from "node:path";
import { TaskStatus } from "~/enums/task-status";
import type { Task } from "~/types/tasks";

const DATA_DIR = join(process.cwd(), "server", "data");
const TASKS_FILE = join(DATA_DIR, "tasks.json");

const SEED_TASKS: Task[] = [
  { id: 1, title: "Prepare release", status: TaskStatus.Done },
  { id: 2, title: "Fix login bug", status: TaskStatus.InProgress },
  { id: 3, title: "Write API docs", status: TaskStatus.Todo },
];

async function ensureDataFile() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.access(TASKS_FILE);
  } catch {
    await fs.writeFile(TASKS_FILE, JSON.stringify(SEED_TASKS, null, 2), "utf8");
  }
}

async function readTasks(): Promise<Task[]> {
  await ensureDataFile();
  const raw = await fs.readFile(TASKS_FILE, "utf8");
  return JSON.parse(raw) as Task[];
}

async function writeTasks(tasks: Task[]): Promise<void> {
  await fs.writeFile(TASKS_FILE, JSON.stringify(tasks, null, 2), "utf8");
}

export async function getTasks(): Promise<Task[]> {
  return readTasks();
}

export async function getTaskById(id: number): Promise<Task | undefined> {
  const tasks = await readTasks();
  return tasks.find((task) => task.id === id);
}

export async function updateTask(
  id: number,
  patch: Partial<Pick<Task, "title" | "status">>,
): Promise<Task | undefined> {
  const tasks = await readTasks();
  const index = tasks.findIndex((task) => task.id === id);
  if (index === -1) return undefined;

  const updated: Task = { ...tasks[index], ...patch };
  tasks[index] = updated;
  await writeTasks(tasks);
  return updated;
}

export async function createTask(
  title: string,
  status: TaskStatus = TaskStatus.Todo,
): Promise<Task> {
  const tasks = await readTasks();
  const nextId =
    tasks.length === 0
      ? 1
      : tasks.reduce((max, task) => Math.max(max, task.id), 0) + 1;
  const newTask: Task = { id: nextId, title, status };
  tasks.push(newTask);
  await writeTasks(tasks);
  return newTask;
}

export async function deleteTask(id: number): Promise<boolean> {
  const tasks = await readTasks();
  const nextTasks = tasks.filter((task) => task.id !== id);

  if (nextTasks.length === tasks.length) {
    return false;
  }

  await writeTasks(nextTasks);
  return true;
}
