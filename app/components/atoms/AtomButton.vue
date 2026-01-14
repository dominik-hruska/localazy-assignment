<template>
  <button
    :type="props.type"
    class="cursor-pointer rounded-full border px-4 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-70"
    :class="
      props.active
        ? 'border-slate-900 bg-slate-900 text-white'
        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-400 hover:text-slate-900'
    "
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
import type { AtomButtonProps } from "~/types/atoms";

const props = withDefaults(defineProps<AtomButtonProps>(), {
  active: false,
  type: "button",
});
</script>
