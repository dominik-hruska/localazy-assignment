<template>
  <section class="flex flex-col gap-8">
    <div
      class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div class="flex flex-col gap-2">
        <p
          class="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
          Task Radar
        </p>
        <h1 class="text-3xl font-semibold text-slate-900">Tasks</h1>
        <p class="max-w-xl text-sm text-slate-500">
          Scan the latest work, filter by status, and open the right task in
          seconds.
        </p>
      </div>

      <div class="flex flex-wrap items-center gap-3">
        <div
          v-if="viewMode === TasksViewMode.List"
          class="flex flex-wrap gap-2">
          <AtomButton
            v-for="filter in filters"
            :key="filter.value"
            :active="store.statusFilter === filter.value"
            @click="store.setFilter(filter.value)">
            {{ filter.label }}
          </AtomButton>
        </div>
        <div
          class="flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 p-1">
          <AtomButton
            tone="indigo"
            :active="viewMode === TasksViewMode.List"
            class="px-3 py-1 text-xs"
            @click="viewMode = TasksViewMode.List">
            List
          </AtomButton>
          <AtomButton
            tone="indigo"
            :active="viewMode === TasksViewMode.Board"
            class="px-3 py-1 text-xs"
            @click="viewMode = TasksViewMode.Board">
            Board
          </AtomButton>
        </div>
      </div>
    </div>

    <div class="rounded-2xl border border-slate-200 bg-white/80 p-4">
      <p
        class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
        New task
      </p>
      <div class="mt-3 flex flex-col gap-3 sm:flex-row sm:items-start">
        <div class="flex flex-col gap-1 sm:flex-1">
          <AtomInput
            v-model="newTitle"
            placeholder="Add a new task title"
            :max-length="TASK_TITLE_MAX_LENGTH"
            @keyup.enter="handleCreate" />
          <div class="flex items-center justify-between text-xs">
            <p class="text-slate-500">
              <span v-if="titleError" class="text-rose-600">
                {{ titleError }}
              </span>
            </p>
            <p class="text-slate-400">
              {{ newTitle.length }}/{{ TASK_TITLE_MAX_LENGTH }}
            </p>
          </div>
        </div>
        <MoleculeButton
          :active="true"
          :loading="isCreating"
          :disabled="!canCreate"
          @click="handleCreate">
          {{ isCreating ? "Adding" : "Add task" }}
        </MoleculeButton>
      </div>
      <p v-if="createErrorMessage" class="mt-2 text-sm text-rose-600">
        {{ createErrorMessage }}
      </p>
    </div>

    <div v-if="pending" class="grid gap-4">
      <div
        v-for="skeleton in 4"
        :key="skeleton"
        class="animate-pulse rounded-2xl border border-slate-200 bg-white p-5">
        <div class="flex items-start justify-between gap-4">
          <div class="flex flex-col gap-3">
            <div class="h-3 w-24 rounded-full bg-slate-200" />
            <div class="h-5 w-48 rounded-full bg-slate-200" />
          </div>
          <div class="h-6 w-20 rounded-full bg-slate-200" />
        </div>
      </div>
    </div>

    <div
      v-else-if="error"
      class="rounded-2xl border border-rose-200 bg-rose-50 px-5 py-6">
      <p class="text-sm font-semibold text-rose-700">Unable to load tasks.</p>
      <p class="mt-2 text-sm text-rose-600">
        {{ error?.message ?? "Please try again." }}
      </p>
      <button
        type="button"
        class="mt-4 rounded-full border border-rose-300 px-4 py-2 text-sm font-semibold text-rose-700 transition hover:border-rose-400"
        @click="handleRefresh">
        Retry
      </button>
    </div>

    <div
      v-else-if="
        viewMode === TasksViewMode.List && store.hasLoaded && isListEmpty
      "
      class="rounded-2xl border border-dashed border-slate-200 bg-white/70 px-6 py-10 text-center">
      <p class="text-base font-semibold text-slate-900">No tasks found</p>
      <p class="mt-2 text-sm text-slate-500">
        Try a different status or reset the filter.
      </p>
      <button
        v-if="store.statusFilter !== 'all'"
        type="button"
        class="mt-4 rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400"
        @click="store.setFilter('all')">
        Clear filter
      </button>
    </div>

    <div
      v-else-if="
        viewMode === TasksViewMode.Board && store.hasLoaded && isBoardEmpty
      "
      class="rounded-2xl border border-dashed border-slate-200 bg-white/70 px-6 py-10 text-center">
      <p class="text-base font-semibold text-slate-900">No tasks yet</p>
      <p class="mt-2 text-sm text-slate-500">
        New tasks will appear here as soon as they are created.
      </p>
    </div>

    <div v-else class="grid gap-4">
      <div v-if="viewMode === TasksViewMode.List" class="grid gap-4">
        <AtomLink
          v-for="task in store.filteredTasks"
          :key="task.id"
          class="block"
          :to="`/tasks/${task.id}`"
          :aria-label="`View task ${task.id}`">
          <TaskCard
            :task="task"
            :status-label="statusLabels[task.status]"
            :status-class="statusClasses[task.status]">
            <template #actions>
              <AtomButton
                tone="rose"
                class="flex h-8 w-8 items-center justify-center p-0"
                :disabled="isDeleting"
                @click.stop.prevent="openDeleteModal(task)">
                <span class="sr-only">Delete</span>
                <span
                  class="[&>svg]:h-4 [&>svg]:w-4"
                  aria-hidden="true"
                  v-html="trashIcon" />
              </AtomButton>
            </template>
          </TaskCard>
        </AtomLink>
      </div>
      <div v-else class="grid gap-6 lg:grid-cols-3">
        <div
          v-for="column in boardColumns"
          :key="column.status"
          class="rounded-2xl border border-slate-200 bg-white/70 p-4">
          <div class="flex items-center justify-between">
            <p class="text-sm font-semibold text-slate-900">
              {{ statusLabels[column.status] }}
            </p>
            <span
              class="rounded-full border px-2 py-0.5 text-xs font-semibold"
              :class="statusClasses[column.status]">
              {{ column.tasks.length }}
            </span>
          </div>
          <div class="mt-4 grid gap-3">
            <p v-if="column.tasks.length === 0" class="text-sm text-slate-500">
              No tasks here yet.
            </p>
            <AtomLink
              v-for="task in column.tasks"
              :key="task.id"
              class="block"
              :to="`/tasks/${task.id}`"
              :aria-label="`View task ${task.id}`">
              <TaskCard
                :task="task"
                :status-label="statusLabels[task.status]"
                :status-class="statusClasses[task.status]">
                <template #actions>
                  <AtomButton
                    tone="rose"
                    class="flex h-8 w-8 items-center justify-center p-0"
                    :disabled="isDeleting"
                    @click.stop.prevent="openDeleteModal(task)">
                    <span class="sr-only">Delete</span>
                    <span
                      class="[&>svg]:h-4 [&>svg]:w-4"
                      aria-hidden="true"
                      v-html="trashIcon" />
                  </AtomButton>
                </template>
              </TaskCard>
            </AtomLink>
          </div>
        </div>
      </div>
    </div>

    <MoleculeModal
      :open="isDeleteModalOpen"
      title="Delete task"
      description="This action cannot be undone."
      @close="closeDeleteModal">
      <template v-if="deleteTarget">
        <p class="text-sm text-slate-700">
          You are about to delete <strong>Task #{{ deleteTarget.id }}</strong
          >.
        </p>
        <p class="mt-2 text-sm text-slate-600">
          {{ deleteTarget.title }}
        </p>
      </template>

      <p v-if="deleteErrorMessage" class="mt-3 text-sm text-rose-600">
        {{ deleteErrorMessage }}
      </p>

      <template #actions>
        <AtomButton
          :disabled="isDeleting"
          class="px-4 py-2 text-sm"
          @click="closeDeleteModal">
          Cancel
        </AtomButton>
        <MoleculeButton
          tone="rose"
          :active="true"
          :loading="isDeleting"
          @click="confirmDelete">
          {{ isDeleting ? "Deleting" : "Delete" }}
        </MoleculeButton>
      </template>
    </MoleculeModal>
  </section>
</template>

<script setup lang="ts">
import AtomButton from "~/components/atoms/AtomButton.vue";
import AtomInput from "~/components/atoms/AtomInput.vue";
import AtomLink from "~/components/atoms/AtomLink.vue";
import MoleculeButton from "~/components/molecules/MoleculeButton.vue";
import MoleculeModal from "~/components/molecules/MoleculeModal.vue";
import TaskCard from "~/components/TaskCard.vue";
import {
  TASK_FILTERS,
  TASK_STATUS_CLASSES,
  TASK_STATUS_LABELS,
} from "~/constants/tasks";
import { useTaskCreate } from "~/composables/useTaskCreate";
import { useTaskDelete } from "~/composables/useTaskDelete";
import { useTasksList } from "~/composables/useTasksList";
import { TaskStatus } from "~/enums/task-status";
import { TasksViewMode } from "~/enums/tasks-view-mode";
import { getErrorMessage } from "~/helpers/error-message";
import type { Task, TaskBoardColumn } from "~/types/tasks";
import trashIcon from "~/assets/icons/trash.svg?raw";
import { TASK_TITLE_MAX_LENGTH } from "#shared/constants/tasks";

const { pending, error, refresh, store } = useTasksList();
const { isCreating, createError, createTask } = useTaskCreate();
const { isDeleting, deleteError, deleteTask } = useTaskDelete();

const newTitle = ref("");
const hasTouchedTitle = ref(false);

watch(newTitle, (value) => {
  if (createError.value) {
    createError.value = null;
  }
  hasTouchedTitle.value = value.length > 0;
});

const viewMode = useState<TasksViewMode>(
  "tasksViewMode",
  () => TasksViewMode.List
);

const handleRefresh = () => {
  refresh();
};

const filters = TASK_FILTERS;
const statusLabels = TASK_STATUS_LABELS;
const statusClasses = TASK_STATUS_CLASSES;
const boardStatuses: TaskStatus[] = [
  TaskStatus.Todo,
  TaskStatus.InProgress,
  TaskStatus.Done,
];

const boardColumns = computed<TaskBoardColumn[]>(() =>
  boardStatuses.map((status) => ({
    status,
    tasks: store.tasks.filter((task) => task.status === status),
  }))
);

const isListEmpty = computed(() => store.filteredTasks.length === 0);
const isBoardEmpty = computed(() => store.tasks.length === 0);

const normalizedTitle = computed(() =>
  newTitle.value.trim().slice(0, TASK_TITLE_MAX_LENGTH)
);
const titleError = computed(() => {
  if (!hasTouchedTitle.value) return "";
  if (normalizedTitle.value.length === 0) {
    return "Title cannot be empty.";
  }
  return "";
});

const canCreate = computed(
  () => normalizedTitle.value.length > 0 && !isCreating.value
);

const createErrorMessage = computed(() =>
  getErrorMessage(createError.value, "Unable to create task.")
);

const handleCreate = async () => {
  hasTouchedTitle.value = true;
  if (!canCreate.value) return;

  try {
    await createTask({ title: normalizedTitle.value, status: TaskStatus.Todo });
    newTitle.value = "";
    hasTouchedTitle.value = false;
  } catch {
    return;
  }
};

const deleteTarget = ref<Task | null>(null);
const isDeleteModalOpen = computed(() => !!deleteTarget.value);

const deleteErrorMessage = computed(() =>
  getErrorMessage(deleteError.value, "Unable to delete task.")
);

const openDeleteModal = (task: Task) => {
  deleteError.value = null;
  deleteTarget.value = task;
};

const closeDeleteModal = () => {
  if (isDeleting.value) return;
  deleteError.value = null;
  deleteTarget.value = null;
};

const confirmDelete = async () => {
  if (!deleteTarget.value || isDeleting.value) return;

  try {
    await deleteTask(deleteTarget.value.id);
    deleteTarget.value = null;
  } catch {
    return;
  }
};
</script>
