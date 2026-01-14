<template>
  <section class="flex flex-col gap-10">
    <div
      class="rounded-3xl border border-slate-200 bg-white/80 p-8 shadow-sm sm:p-10"
    >
      <p
        class="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400"
      >
        Tasks Dashboard
      </p>
      <h1 class="mt-4 text-4xl font-semibold text-slate-900 sm:text-5xl">
        Keep delivery on track.
      </h1>
      <p class="mt-4 max-w-2xl text-base text-slate-600">
        Monitor active work, stay aligned on priorities, and keep the team
        moving with a clear overview of task status.
      </p>
      <div class="mt-6 flex flex-wrap items-center gap-3">
        <AtomLink
          class="rounded-full border border-slate-900 bg-slate-900 px-5 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-lg"
          to="/tasks"
        >
          View tasks
        </AtomLink>
      </div>
    </div>

    <div class="grid gap-4 sm:grid-cols-3">
      <div
        v-for="stat in stats"
        :key="stat.label"
        class="rounded-2xl border border-slate-200 bg-white p-6"
      >
        <p
          class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400"
        >
          {{ stat.label }}
        </p>
        <p class="mt-3 text-3xl font-semibold text-slate-900">
          {{ stat.value }}
        </p>
        <p class="mt-2 text-sm text-slate-500">{{ stat.caption }}</p>
      </div>
    </div>

    <div
      class="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 sm:flex-row sm:items-center sm:justify-between"
    >
      <div>
        <p class="text-sm font-semibold text-slate-900">Today's focus</p>
        <p class="mt-2 text-sm text-slate-500">
          Prioritize tasks that unblock release readiness and share clear
          progress updates with stakeholders.
        </p>
      </div>
      <AtomLink
        class="w-fit rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400"
        to="/tasks"
      >
        Open task list
      </AtomLink>
    </div>
  </section>
</template>

<script setup lang="ts">
import AtomLink from "~/components/atoms/AtomLink.vue";
import { useTasksList } from "~/composables/useTasksList";
import { TaskStatus } from "~/enums/task-status";

const { store } = useTasksList();

const totalTasks = computed(() => store.tasks.length);
const completedTasks = computed(
  () => store.tasks.filter((task) => task.status === TaskStatus.Done).length,
);
const completionRate = computed(() => {
  if (totalTasks.value === 0) return 0;
  return Math.round((completedTasks.value / totalTasks.value) * 100);
});

const activeTasksValue = computed(() =>
  store.hasLoaded ? totalTasks.value.toString() : "—",
);
const completionRateValue = computed(() =>
  store.hasLoaded ? `${completionRate.value}%` : "—",
);

const stats = computed(() => [
  {
    label: "Active tasks",
    value: activeTasksValue.value,
    caption: "Across product and platform.",
  },
  {
    label: "Completion rate",
    value: completionRateValue.value,
    caption: "Based on current tasks.",
  },
  {
    label: "Next milestone",
    value: "Fri, 16",
    caption: "Release readiness check.",
  },
]);
</script>
