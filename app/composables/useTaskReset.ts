import type { Task } from "~/types/tasks";
import { useTasksStore } from "~/stores/tasks";

export const useTaskReset = () => {
  const store = useTasksStore();
  const isResetting = ref(false);
  const resetError = ref<unknown>(null);

  const resetTasks = async () => {
    isResetting.value = true;
    resetError.value = null;

    try {
      const tasks = await $fetch<Task[]>("/api/tasks/reset", {
        method: "POST",
      });
      store.setTasks(tasks);
      return tasks;
    } catch (error) {
      resetError.value = error;
      throw error;
    } finally {
      isResetting.value = false;
    }
  };

  return {
    isResetting,
    resetError,
    resetTasks,
  };
};
