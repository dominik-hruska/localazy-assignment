<template>
  <section class="flex flex-col gap-8">
    <div
      v-if="pending"
      class="rounded-2xl border border-slate-200 bg-white p-6">
      <div class="flex flex-wrap items-start justify-between gap-4">
        <div class="flex flex-col gap-3">
          <div class="h-3 w-24 rounded-full bg-slate-200"></div>
          <div class="h-6 w-64 rounded-full bg-slate-200"></div>
        </div>
        <div class="h-6 w-24 rounded-full bg-slate-200"></div>
      </div>
    </div>

    <div v-else-if="task" class="flex flex-col gap-8">
      <div
        class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div class="flex flex-col gap-2">
          <p
            class="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
            Focus Brief
          </p>
          <h1 class="text-3xl font-semibold text-slate-900">Task detail</h1>
          <p class="max-w-xl text-sm text-slate-500">
            Dive into context, ownership, and progress at a glance.
          </p>
        </div>

        <AtomLink
          class="text-sm font-semibold text-slate-600 transition hover:text-slate-900"
          to="/tasks">
          Back to tasks
        </AtomLink>
      </div>

      <div class="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
      <div class="rounded-2xl border border-slate-200 bg-white p-6">
        <div class="flex flex-wrap items-start justify-between gap-4">
          <div class="flex flex-col gap-2">
            <p
              class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              Task #{{ task.id }}
            </p>
            <h2 class="text-2xl font-semibold text-slate-900">
              {{ task.title }}
            </h2>
          </div>
          <span
            class="rounded-full border px-3 py-1 text-xs font-semibold"
            :class="statusClasses[task.status]">
            {{ statusLabels[task.status] }}
          </span>
        </div>

        <p class="mt-4 text-sm text-slate-600">
          {{ detail?.summary }}
        </p>

        <div class="mt-6 grid gap-4 sm:grid-cols-2">
          <TaskMetaCard
            v-for="card in metaCards"
            :key="card.label"
            :label="card.label"
            :value="card.value" />
          <div class="rounded-xl bg-slate-50 p-4">
            <p
              class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              Progress
            </p>
            <div class="mt-3 h-2 rounded-full bg-white">
              <div
                class="h-full rounded-full bg-slate-900"
                :style="{ width: `${detail?.progress ?? 0}%` }"></div>
            </div>
            <p class="mt-2 text-xs text-slate-500">
              {{ detail?.progress }}% complete
            </p>
          </div>
        </div>

        <div class="mt-6">
          <p
            class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            Tags
          </p>
          <div class="mt-3 flex flex-wrap gap-2">
            <span
              v-for="tag in detail?.tags ?? []"
              :key="tag"
              class="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600">
              {{ tag }}
            </span>
          </div>
        </div>
      </div>

      <div class="flex flex-col gap-4">
        <TaskChecklist :items="detail?.checklist ?? []" />
        <TaskActivityList :items="detail?.activity ?? []" />
      </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { Task, TaskStatus } from "~/types/tasks";
import type { TaskMetaCardProps } from "~/types/components";
import AtomLink from "~/components/atoms/AtomLink.vue";
import TaskActivityList from "~/components/TaskActivityList.vue";
import TaskChecklist from "~/components/TaskChecklist.vue";
import TaskMetaCard from "~/components/TaskMetaCard.vue";

definePageMeta({
  middleware: ["task-id"],
});

const route = useRoute();
const taskId = computed(() => {
  const rawId = route.params.id;
  return Number(Array.isArray(rawId) ? rawId[0] : rawId);
});

const { data: task, pending, error } = useAsyncData<Task>(
  "task-detail",
  () => $fetch<Task>(`/api/tasks/${taskId.value}`),
  { watch: [taskId] },
);

watch(
  error,
  (err) => {
    if (err?.statusCode === 404 || err?.statusCode === 400) {
      navigateTo("/404");
    }
  },
  { immediate: true }
);

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

const statusProgress: Record<TaskStatus, number> = {
  todo: 15,
  "in-progress": 60,
  done: 100,
};

const detail = computed(() => {
  if (!task.value) return null;

  const current = task.value;
  const seed = hash(`${current.title}-${current.id}`);
  const focus = getFocus(current.title);

  const summaryTemplates = [
    `Focused on ${focus} work to keep delivery stable and predictable.`,
    `This task captures the next steps for ${focus.toLowerCase()} readiness.`,
    `A scoped item to move ${focus.toLowerCase()} forward with clear ownership.`,
  ];

  const owner = pick(
    ["Ava Petrova", "Liam Novak", "Maya Chen", "Jonas Varga", "Elena Ruiz"],
    seed + 2
  );

  const project = pick(
    ["Core Platform", "Release Ops", "Developer Experience", "Quality Signals"],
    seed + 4
  );

  const priority = pick(["Low", "Medium", "High", "Critical"], seed + 6);
  const estimate = `${(seed % 5) + 1} day${seed % 5 === 0 ? "" : "s"}`;
  const dueDate = formatDate(addDays(new Date(), (seed % 12) + 3));
  const tags = pickMany(
    ["Stability", "Documentation", "UX polish", "Release", "Integration", "QA"],
    3,
    seed
  );

  const checklistBase = [
    `Align ${focus.toLowerCase()} requirements`,
    "Review dependencies and risks",
    "Share update in weekly sync",
    "Validate acceptance criteria",
  ];

  const doneCount =
    current.status === "done"
      ? checklistBase.length
      : current.status === "todo"
      ? 0
      : (seed % (checklistBase.length - 1)) + 1;

  const checklist = checklistBase.map((label, index) => ({
    label,
    done: index < doneCount,
  }));

  const activity = [
    {
      label: `${owner} updated the status`,
      time: `${(seed % 3) + 1}h ago`,
    },
    {
      label: "Checklist refined",
      time: `${(seed % 4) + 2}h ago`,
    },
    {
      label: `Scope aligned with ${project}`,
      time: `${(seed % 5) + 1}d ago`,
    },
  ];

  return {
    summary: pick(summaryTemplates, seed),
    owner,
    project,
    priority,
    dueDate,
    estimate,
    tags,
    checklist,
    activity,
    progress: statusProgress[current.status],
  };
});

const metaCards = computed<TaskMetaCardProps[]>(() => {
  if (!detail.value) return [];

  return [
    { label: "Project", value: detail.value.project },
    { label: "Owner", value: detail.value.owner },
    { label: "Priority", value: detail.value.priority },
    { label: "Due date", value: detail.value.dueDate },
    { label: "Estimate", value: detail.value.estimate },
  ];
});

function hash(input: string) {
  return [...input].reduce((acc, char) => acc + char.charCodeAt(0), 0);
}

function pick<T>(list: T[], seed: number) {
  return list[Math.abs(seed) % list.length];
}

function pickMany<T>(list: T[], count: number, seed: number) {
  const pool = [...list];
  const result: T[] = [];
  let index = Math.abs(seed);

  while (pool.length > 0 && result.length < count) {
    index = (index + 3) % pool.length;
    result.push(pool.splice(index, 1)[0]);
  }

  return result;
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function addDays(date: Date, days: number) {
  return new Date(date.getTime() + days * 24 * 60 * 60 * 1000);
}

function getFocus(title: string) {
  const lower = title.toLowerCase();

  if (lower.includes("release")) return "Release readiness";
  if (lower.includes("bug")) return "Stability improvements";
  if (lower.includes("doc")) return "Documentation rollout";

  return "Delivery planning";
}
</script>
