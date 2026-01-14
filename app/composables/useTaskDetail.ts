import type { Ref } from "vue";
import type { Task } from "~/types/tasks";
import type { TaskStatus } from "~/enums/task-status";
import { useTasksStore } from "~/stores/tasks";

export const useTaskDetail = (taskId: Ref<number>) => {
  const store = useTasksStore();
  const key = computed(() => `task:${taskId.value}`);

  const { data, pending, error, refresh } = useAsyncData<Task | null>(
    key,
    () => $fetch<Task>(`/api/tasks/${taskId.value}`),
    {
      watch: [taskId],
      default: () => store.tasksById[taskId.value] ?? null,
    },
  );

  const task = computed<Task | null>(() => data.value ?? null);

  watch(
    data,
    (task) => {
      if (task) {
        store.upsertTask(task);
      }
    },
    { immediate: true },
  );

  const isSaving = ref(false);
  const saveError = ref<Error | null>(null);

  const saveTask = async (patch: { title?: string; status?: TaskStatus }) => {
    isSaving.value = true;
    saveError.value = null;

    try {
      const updated = await $fetch<Task>(`/api/tasks/${taskId.value}`, {
        method: "PUT",
        body: patch,
      });

      data.value = updated;
      store.upsertTask(updated);
      return updated;
    } catch (err) {
      saveError.value = err as Error;
      throw err;
    } finally {
      isSaving.value = false;
    }
  };

  return {
    task,
    pending,
    error,
    refresh,
    isSaving,
    saveError,
    saveTask,
  };
};
