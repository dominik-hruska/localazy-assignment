<template>
  <section class="flex flex-col gap-8">
    <div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div class="flex flex-col gap-2">
        <p
          class="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400"
        >
          Task Radar
        </p>
        <h1 class="text-3xl font-semibold text-slate-900">Tasks</h1>
        <p class="max-w-xl text-sm text-slate-500">
          Scan the latest work, filter by status, and open the right task in
          seconds.
        </p>
      </div>

      <div class="flex flex-wrap items-center gap-3">
        <div v-if="viewMode === TasksViewMode.List" class="flex flex-wrap gap-2">
          <AtomButton
            v-for="filter in filters"
            :key="filter.value"
            :active="store.statusFilter === filter.value"
            @click="store.setFilter(filter.value)"
          >
            {{ filter.label }}
          </AtomButton>
        </div>
        <div class="flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 p-1">
          <AtomButton
            tone="indigo"
            :active="viewMode === TasksViewMode.List"
            class="px-3 py-1 text-xs"
            @click="viewMode = TasksViewMode.List"
          >
            List
          </AtomButton>
          <AtomButton
            tone="indigo"
            :active="viewMode === TasksViewMode.Board"
            class="px-3 py-1 text-xs"
            @click="viewMode = TasksViewMode.Board"
          >
            Board
          </AtomButton>
        </div>
      </div>
    </div>

    <div v-if="pending" class="grid gap-4">
      <div
        v-for="skeleton in 4"
        :key="skeleton"
        class="animate-pulse rounded-2xl border border-slate-200 bg-white p-5"
      >
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
      class="rounded-2xl border border-rose-200 bg-rose-50 px-5 py-6"
    >
      <p class="text-sm font-semibold text-rose-700">Unable to load tasks.</p>
      <p class="mt-2 text-sm text-rose-600">
        {{ error?.message ?? "Please try again." }}
      </p>
      <button
        type="button"
        class="mt-4 rounded-full border border-rose-300 px-4 py-2 text-sm font-semibold text-rose-700 transition hover:border-rose-400"
        @click="handleRefresh"
      >
        Retry
      </button>
    </div>

    <div
      v-else-if="viewMode === TasksViewMode.List && store.hasLoaded && isListEmpty"
      class="rounded-2xl border border-dashed border-slate-200 bg-white/70 px-6 py-10 text-center"
    >
      <p class="text-base font-semibold text-slate-900">No tasks found</p>
      <p class="mt-2 text-sm text-slate-500">
        Try a different status or reset the filter.
      </p>
      <button
        v-if="store.statusFilter !== 'all'"
        type="button"
        class="mt-4 rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400"
        @click="store.setFilter('all')"
      >
        Clear filter
      </button>
    </div>

    <div
      v-else-if="viewMode === TasksViewMode.Board && store.hasLoaded && isBoardEmpty"
      class="rounded-2xl border border-dashed border-slate-200 bg-white/70 px-6 py-10 text-center"
    >
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
          :aria-label="`View task ${task.id}`"
        >
          <TaskCard
            :task="task"
            :status-label="statusLabels[task.status]"
            :status-class="statusClasses[task.status]"
          />
        </AtomLink>
      </div>
      <div v-else class="grid gap-6 lg:grid-cols-3">
        <div
          v-for="column in boardColumns"
          :key="column.status"
          class="rounded-2xl border border-slate-200 bg-white/70 p-4"
        >
          <div class="flex items-center justify-between">
            <p class="text-sm font-semibold text-slate-900">
              {{ statusLabels[column.status] }}
            </p>
            <span
              class="rounded-full border px-2 py-0.5 text-xs font-semibold"
              :class="statusClasses[column.status]"
            >
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
              :aria-label="`View task ${task.id}`"
            >
              <TaskCard
                :task="task"
                :status-label="statusLabels[task.status]"
                :status-class="statusClasses[task.status]"
              />
            </AtomLink>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import AtomButton from "~/components/atoms/AtomButton.vue";
import AtomLink from "~/components/atoms/AtomLink.vue";
import TaskCard from "~/components/TaskCard.vue";
import {
  TASK_FILTERS,
  TASK_STATUS_CLASSES,
  TASK_STATUS_LABELS,
} from "~/constants/tasks";
import { useTasksList } from "~/composables/useTasksList";
import { TaskStatus } from "~/enums/task-status";
import { TasksViewMode } from "~/enums/tasks-view-mode";
import type { TaskBoardColumn } from "~/types/tasks";

const { pending, error, refresh, store } = useTasksList();

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
</script>
