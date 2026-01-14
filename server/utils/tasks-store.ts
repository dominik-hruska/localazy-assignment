import { TaskStatus } from "~/enums/task-status";
import type { Task } from "~/types/tasks";
import { readLocalTasks, writeLocalTasks } from "./tasks-store/local-store";
import {
  readNetlifyTasks,
  writeNetlifyTasks,
} from "./tasks-store/netlify-store";
import { SEED_TASKS } from "./tasks-store/seed";

const isNetlifyRuntime =
  Boolean(process.env.NETLIFY) || Boolean(process.env.NETLIFY_LOCAL);

let useMemoryStore = false;
let memoryTasks: Task[] | null = null;

const cloneTasks = (tasks: Task[]) => tasks.map((task) => ({ ...task }));

const initMemoryStore = (tasks: Task[] = SEED_TASKS) => {
  useMemoryStore = true;
  memoryTasks = cloneTasks(tasks);
};

async function readTasks(): Promise<Task[]> {
  if (useMemoryStore) {
    if (!memoryTasks) initMemoryStore();
    return cloneTasks(memoryTasks ?? []);
  }

  try {
    return isNetlifyRuntime ? await readNetlifyTasks() : await readLocalTasks();
  } catch {
    initMemoryStore();
    return cloneTasks(memoryTasks ?? []);
  }
}

async function writeTasks(tasks: Task[]): Promise<void> {
  if (useMemoryStore) {
    memoryTasks = cloneTasks(tasks);
    return;
  }

  try {
    if (isNetlifyRuntime) {
      await writeNetlifyTasks(tasks);
    } else {
      await writeLocalTasks(tasks);
    }
  } catch {
    initMemoryStore(tasks);
  }
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
