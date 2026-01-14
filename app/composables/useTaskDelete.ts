import { useTasksStore } from "~/stores/tasks";

export const useTaskDelete = () => {
  const store = useTasksStore();
  const isDeleting = ref(false);
  const deleteError = ref<unknown>(null);

  const deleteTask = async (id: number) => {
    isDeleting.value = true;
    deleteError.value = null;

    try {
      await $fetch(`/api/tasks/${id}`, { method: "DELETE" });
      store.removeTask(id);
      return true;
    } catch (error) {
      deleteError.value = error;
      throw error;
    } finally {
      isDeleting.value = false;
    }
  };

  return {
    isDeleting,
    deleteError,
    deleteTask,
  };
};
