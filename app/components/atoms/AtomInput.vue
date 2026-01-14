<template>
  <input
    :id="props.id"
    :name="props.name"
    :type="props.type"
    :value="props.modelValue"
    :placeholder="props.placeholder"
    :autocomplete="props.autocomplete"
    :disabled="props.disabled"
    :maxlength="props.maxLength"
    :aria-label="props.ariaLabel"
    class="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm transition focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200 disabled:cursor-not-allowed disabled:opacity-70"
    v-bind="$attrs"
    @input="onInput"
  />
</template>

<script setup lang="ts">
import type { AtomInputEmits, AtomInputProps } from "~/types/atoms";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<AtomInputProps>(), {
  modelValue: "",
  type: "text",
  placeholder: "",
  autocomplete: "off",
});

const emit = defineEmits<AtomInputEmits>();

const onInput = (event: Event) => {
  const target = event.target as HTMLInputElement | null;
  emit("update:modelValue", target?.value ?? "");
};
</script>
