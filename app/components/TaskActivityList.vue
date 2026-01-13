<template>
  <div class="rounded-2xl border border-slate-200 bg-white p-5">
    <p class="text-sm font-semibold text-slate-900">Recent activity</p>
    <div class="mt-4 flex flex-col gap-3">
      <div v-for="event in items" :key="event.label">
        <p class="text-sm font-semibold text-slate-900">{{ event.label }}</p>
        <p class="text-xs text-slate-400">{{ event.time }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TaskActivityListProps } from "~/types/components";

defineProps<TaskActivityListProps>();
</script>
