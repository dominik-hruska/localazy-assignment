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

export type TaskDetail = {
  summary: string;
  owner: string;
  project: string;
  priority: string;
  dueDate: string;
  estimate: string;
  tags: string[];
  checklist: Array<{ label: string; done: boolean }>;
  activity: Array<{ label: string; time: string }>;
  progress: number;
};
