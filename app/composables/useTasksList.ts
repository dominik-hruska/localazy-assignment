import type { Task } from "~/types/tasks";
import { useTasksStore } from "~/stores/tasks";

const TASKS_KEY = "tasks";

export const useTasksList = () => {
  const store = useTasksStore();

  const { data, pending, error, refresh } = useAsyncData<Task[]>(
    TASKS_KEY,
    async () => {
      return $fetch<Task[]>("/api/tasks");
    },
    {
      default: () => store.tasks,
    },
  );

  watch(
    data,
    (tasks) => {
      if (tasks) {
        store.setTasks(tasks);
      }
    },
    { immediate: true },
  );

  return {
    data,
    pending,
    error,
    refresh,
    store,
  };
};
