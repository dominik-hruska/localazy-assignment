<template>
  <Teleport to="body">
    <div
      v-if="props.open"
      class="fixed inset-0 z-50 flex items-center justify-center px-4 py-6"
      role="dialog"
      aria-modal="true"
    >
      <div
        class="absolute inset-0 bg-slate-900/50"
        @click="emit('close')"
      />
      <div
        class="relative w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-xl"
      >
        <div class="flex items-start justify-between gap-4">
          <div>
            <p v-if="props.title" class="text-lg font-semibold text-slate-900">
              {{ props.title }}
            </p>
            <p
              v-if="props.description"
              class="mt-2 text-sm text-slate-600"
            >
              {{ props.description }}
            </p>
          </div>
          <button
            type="button"
            class="flex h-8 w-8 cursor-pointer items-center justify-center text-slate-500 transition hover:text-slate-700"
            aria-label="Close modal"
            @click="emit('close')"
          >
            <span class="sr-only">Close</span>
            <span
              class="[&>svg]:h-4 [&>svg]:w-4"
              aria-hidden="true"
              v-html="closeIcon"
            />
          </button>
        </div>

        <div v-if="$slots.default" class="mt-4">
          <slot />
        </div>

        <div
          v-if="$slots.actions"
          class="mt-6 flex flex-wrap items-center justify-end gap-2"
        >
          <slot name="actions" />
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import type { MoleculeModalEmits, MoleculeModalProps } from "~/types/components";
import closeIcon from "~/assets/icons/close.svg?raw";

const props = defineProps<MoleculeModalProps>();
const emit = defineEmits<MoleculeModalEmits>();

const handleKeydown = (event: KeyboardEvent) => {
  if (props.open && event.key === "Escape") {
    emit("close");
  }
};

onMounted(() => {
  window.addEventListener("keydown", handleKeydown);
});

onBeforeUnmount(() => {
  window.removeEventListener("keydown", handleKeydown);
});
</script>
