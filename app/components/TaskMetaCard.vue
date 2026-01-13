<template>
  <div class="rounded-xl bg-slate-50 p-4">
    <p class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
      {{ label }}
    </p>
    <p class="mt-2 text-sm font-semibold text-slate-900">
      {{ value }}
    </p>
  </div>
</template>

<script setup lang="ts">
import type { TaskMetaCardProps } from "~/types/components";

defineProps<TaskMetaCardProps>();
</script>
