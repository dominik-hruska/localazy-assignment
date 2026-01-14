<template>
  <button
    :type="props.type"
    class="cursor-pointer rounded-full border px-4 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-70"
    :class="toneClasses"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
import type { AtomButtonProps } from "~/types/atoms";

const props = withDefaults(defineProps<AtomButtonProps>(), {
  active: false,
  type: "button",
  tone: "slate",
});

const toneClasses = computed(() => {
  const tones = {
    slate: {
      active: "border-slate-900 bg-slate-900 text-white",
      inactive:
        "border-slate-200 bg-white text-slate-600 hover:border-slate-400 hover:text-slate-900",
    },
    indigo: {
      active: "border-indigo-600 bg-indigo-600 text-white",
      inactive:
        "border-indigo-200 bg-indigo-50 text-indigo-700 hover:border-indigo-300 hover:text-indigo-800",
    },
    rose: {
      active: "border-rose-600 bg-rose-600 text-white",
      inactive:
        "border-rose-200 bg-rose-50 text-rose-700 hover:border-rose-300 hover:text-rose-800",
    },
  } as const;

  const tone = tones[props.tone] ?? tones.slate;
  return props.active ? tone.active : tone.inactive;
});
</script>
