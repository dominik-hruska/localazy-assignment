import type { Task } from "./tasks";

export interface TaskCardProps {
  task: Task;
  statusLabel: string;
  statusClass: string;
}

export interface HeaderProps {}

export interface TaskMetaCardProps {
  label: string;
  value: string;
}

export interface TaskChecklistItem {
  label: string;
  done: boolean;
}

export interface TaskChecklistProps {
  items: TaskChecklistItem[];
}

export interface TaskActivityItem {
  label: string;
  time: string;
}

export interface TaskActivityListProps {
  items: TaskActivityItem[];
}
