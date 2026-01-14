import { TaskStatus } from "~/enums/task-status";
import type { Task } from "~/types/tasks";

export const SEED_TASKS: Task[] = [
  { id: 1, title: "Prepare release", status: TaskStatus.Done },
  { id: 2, title: "Fix login bug", status: TaskStatus.InProgress },
  { id: 3, title: "Write API docs", status: TaskStatus.Todo },
];
