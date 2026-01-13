<template>
  <section class="flex flex-col gap-8">
    <div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div class="flex flex-col gap-2">
        <p class="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
          Feature A
        </p>
        <h1 class="text-3xl font-semibold text-slate-900">Tasks</h1>
        <p class="max-w-xl text-sm text-slate-500">
          Track tasks from a JSON-backed store, filter them by status, and keep the UI
          responsive with clear loading and empty states.
        </p>
      </div>

      <div class="flex flex-wrap gap-2">
        <AtomButton
          v-for="filter in filters"
          :key="filter.value"
          :active="store.statusFilter === filter.value"
          @click="store.setFilter(filter.value)"
        >
          {{ filter.label }}
        </AtomButton>
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
            <div class="h-3 w-24 rounded-full bg-slate-200"></div>
            <div class="h-5 w-48 rounded-full bg-slate-200"></div>
          </div>
          <div class="h-6 w-20 rounded-full bg-slate-200"></div>
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
        @click="refresh"
      >
        Retry
      </button>
    </div>

    <div
      v-else-if="store.filteredTasks.length === 0"
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

    <div v-else class="grid gap-4">
      <TaskCard
        v-for="task in store.filteredTasks"
        :key="task.id"
        :task="task"
        :status-label="statusLabels[task.status]"
        :status-class="statusClasses[task.status]"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import AtomButton from "~/components/atoms/AtomButton.vue";
import TaskCard from "~/components/TaskCard.vue";
import type { TaskFilterOption, TaskStatus } from "~/types/tasks";
import { useTasksList } from "~/composables/useTasksList";

const { pending, error, refresh, store } = useTasksList();

const filters: TaskFilterOption[] = [
  { value: "all", label: "All" },
  { value: "todo", label: "Todo" },
  { value: "in-progress", label: "In progress" },
  { value: "done", label: "Done" },
];

const statusLabels: Record<TaskStatus, string> = {
  todo: "Todo",
  "in-progress": "In progress",
  done: "Done",
};

const statusClasses: Record<TaskStatus, string> = {
  todo: "border-amber-200 bg-amber-50 text-amber-700",
  "in-progress": "border-sky-200 bg-sky-50 text-sky-700",
  done: "border-emerald-200 bg-emerald-50 text-emerald-700",
};
</script>
