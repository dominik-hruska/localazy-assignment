import type { Task } from "./tasks";

export interface TaskCardProps {
  task: Task;
  statusLabel: string;
  statusClass: string;
}

export interface HeaderProps {}
