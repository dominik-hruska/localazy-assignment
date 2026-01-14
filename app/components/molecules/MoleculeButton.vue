<template>
  <AtomButton
    v-bind="attrs"
    :type="props.type"
    :active="props.active"
    :disabled="isDisabled"
    class="inline-flex items-center gap-2 disabled:cursor-not-allowed disabled:border-slate-300 disabled:bg-slate-300 disabled:text-slate-50"
    @click="handleClick"
  >
    <span
      v-if="props.loading"
      class="h-4 w-4 animate-spin rounded-full border-2 border-current/40 border-t-current"
    />
    <span><slot /></span>
  </AtomButton>
</template>

<script setup lang="ts">
import type { MoleculeButtonProps } from "~/types/components";
import AtomButton from "~/components/atoms/AtomButton.vue";

defineOptions({ inheritAttrs: false });

const attrs = useAttrs();
const emit = defineEmits<{
  (event: "click", value: MouseEvent): void;
}>();

const props = withDefaults(defineProps<MoleculeButtonProps>(), {
  loading: false,
  disabled: false,
  active: false,
  type: "button",
});

const isDisabled = computed(() => props.disabled || props.loading);

const handleClick = (event: MouseEvent) => {
  emit("click", event);
};
</script>
