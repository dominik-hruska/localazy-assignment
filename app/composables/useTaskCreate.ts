import type { Task, TaskCreateInput } from "~/types/tasks";
import { useTasksStore } from "~/stores/tasks";

export const useTaskCreate = () => {
  const store = useTasksStore();
  const isCreating = ref(false);
  const createError = ref<unknown>(null);

  const createTask = async (payload: TaskCreateInput) => {
    isCreating.value = true;
    createError.value = null;

    try {
      const created = await $fetch<Task>("/api/tasks", {
        method: "POST",
        body: payload,
      });
      store.upsertTask(created);
      return created;
    } catch (error) {
      createError.value = error;
      throw error;
    } finally {
      isCreating.value = false;
    }
  };

  return {
    isCreating,
    createError,
    createTask,
  };
};
