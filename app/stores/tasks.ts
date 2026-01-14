import { defineStore } from "pinia";
import type { Task, TaskFilter } from "~/types/tasks";

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

  function upsertTask(updatedTask: Task) {
    const index = tasks.value.findIndex((task) => task.id === updatedTask.id);
    if (index === -1) {
      tasks.value = [...tasks.value, updatedTask];
    } else {
      tasks.value[index] = updatedTask;
    }
    hasLoaded.value = true;
  }

  function removeTask(id: number) {
    tasks.value = tasks.value.filter((task) => task.id !== id);
    hasLoaded.value = true;
  }

  return {
    tasks,
    statusFilter,
    hasLoaded,
    tasksById,
    filteredTasks,
    setTasks,
    setFilter,
    upsertTask,
    removeTask,
  };
});
