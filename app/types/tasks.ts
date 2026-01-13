export type TaskStatus = "todo" | "in-progress" | "done";

export type Task = {
  id: number;
  title: string;
  status: TaskStatus;
};

export type TaskFilter = TaskStatus | "all";

export type TaskFilterOption = {
  value: TaskFilter;
  label: string;
};
