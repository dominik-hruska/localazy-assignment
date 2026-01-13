<template>
  <header class="border-b border-slate-200/70 bg-white/80 backdrop-blur">
    <div class="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-5">
      <AtomLink class="group inline-flex flex-col" to="/">
        <p
          class="text-xs uppercase tracking-[0.2em] text-slate-400 transition group-hover:text-slate-600"
        >
          Taskspace
        </p>
        <p class="text-lg font-semibold text-slate-900">Tasks Dashboard</p>
      </AtomLink>
      <nav class="flex items-center gap-3 text-sm font-medium text-slate-600">
        <AtomLink class="transition hover:text-slate-900" to="/tasks">Tasks</AtomLink>
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
import AtomLink from "~/components/atoms/AtomLink.vue";
import type { HeaderProps } from "~/types/components";

defineProps<HeaderProps>();
</script>
