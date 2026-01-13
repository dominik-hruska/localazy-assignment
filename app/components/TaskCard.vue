<template>
  <div
    class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
    <div class="flex flex-wrap items-start justify-between gap-4">
      <div class="flex flex-col gap-2">
        <p
          class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
          Task #{{ task.id }}
        </p>
        <h2 class="text-lg font-semibold text-slate-900">{{ task.title }}</h2>
      </div>
      <span
        class="rounded-full border px-3 py-1 text-xs font-semibold"
        :class="statusClass">
        {{ statusLabel }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TaskCardProps } from "~/types/components";

defineProps<TaskCardProps>();
</script>
