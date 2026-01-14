import type { TaskFilterOption } from "~/types/tasks";
import { TaskStatus } from "~/enums/task-status";

export const TASK_FILTERS: TaskFilterOption[] = [
  { value: "all", label: "All" },
  { value: TaskStatus.Todo, label: "Todo" },
  { value: TaskStatus.InProgress, label: "In progress" },
  { value: TaskStatus.Done, label: "Done" },
];

export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  [TaskStatus.Todo]: "Todo",
  [TaskStatus.InProgress]: "In progress",
  [TaskStatus.Done]: "Done",
};

export const TASK_STATUS_CLASSES: Record<TaskStatus, string> = {
  [TaskStatus.Todo]: "border-amber-200 bg-amber-50 text-amber-700",
  [TaskStatus.InProgress]: "border-sky-200 bg-sky-50 text-sky-700",
  [TaskStatus.Done]: "border-emerald-200 bg-emerald-50 text-emerald-700",
};

export const TASK_STATUS_PROGRESS: Record<TaskStatus, number> = {
  [TaskStatus.Todo]: 15,
  [TaskStatus.InProgress]: 60,
  [TaskStatus.Done]: 100,
};
