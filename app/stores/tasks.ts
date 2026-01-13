import { defineStore } from "pinia";
import type { Task, TaskFilter, TaskStatus } from "~/types/tasks";

export const useTasksStore = defineStore("tasks", () => {
  const tasks = ref<Task[]>([]);
  const statusFilter = ref<TaskFilter>("all");
  const hasLoaded = ref(false);

  const tasksById = computed<Record<number, Task>>(() => {
    return tasks.value.reduce((acc, task) => {
      acc[task.id] = task;
      return acc;
    }, {} as Record<number, Task>);
  });

  const filteredTasks = computed(() => {
    if (statusFilter.value === "all") return tasks.value;
    return tasks.value.filter((task) => task.status === statusFilter.value);
  });

  function setTasks(nextTasks: Task[]) {
    tasks.value = nextTasks;
    hasLoaded.value = true;
  }

  function setFilter(nextFilter: TaskFilter) {
    statusFilter.value = nextFilter;
  }

  return {
    tasks,
    statusFilter,
    hasLoaded,
    tasksById,
    filteredTasks,
    setTasks,
    setFilter,
  };
});
