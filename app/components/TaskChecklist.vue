<template>
  <div class="rounded-2xl border border-slate-200 bg-white p-5">
    <p class="text-sm font-semibold text-slate-900">Checklist</p>
    <div class="mt-4 flex flex-col gap-3">
      <div v-for="item in items" :key="item.label" class="flex items-center gap-3 text-sm">
        <span
          class="h-2 w-2 rounded-full"
          :class="item.done ? 'bg-emerald-500' : 'bg-slate-300'"
        ></span>
        <span
          :class="item.done ? 'text-slate-500 line-through' : 'text-slate-700'"
        >
          {{ item.label }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TaskChecklistProps } from "~/types/components";

defineProps<TaskChecklistProps>();
</script>
