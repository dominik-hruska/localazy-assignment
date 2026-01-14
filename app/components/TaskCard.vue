<template>
  <div
    class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
  >
    <div class="flex items-start justify-between gap-3">
      <p class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
        Task #{{ task.id }}
      </p>
      <div class="flex items-center gap-2">
        <span
          class="rounded-full border px-3 py-1 text-xs font-semibold"
          :class="statusClass"
        >
          {{ statusLabel }}
        </span>
        <slot name="actions" />
      </div>
    </div>
    <h2 class="mt-3 text-lg font-semibold text-slate-900 line-clamp-2">
      {{ task.title }}
    </h2>
  </div>
</template>

<script setup lang="ts">
import type { TaskCardProps } from "~/types/components";

defineProps<TaskCardProps>();
</script>
