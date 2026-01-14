<template>
  <header class="border-b border-slate-200/70 bg-white/80 backdrop-blur">
    <div
      class="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-5"
    >
      <AtomLink class="group inline-flex flex-col" to="/">
        <p
          class="text-xs uppercase tracking-[0.2em] text-slate-400 transition group-hover:text-slate-600"
        >
          Taskspace
        </p>
        <p class="text-lg font-semibold text-slate-900">Tasks Dashboard</p>
      </AtomLink>
      <nav class="flex items-center gap-3 text-sm font-medium text-slate-600">
        <AtomLink class="transition hover:text-slate-900" to="/tasks">
          Tasks
        </AtomLink>
        <AtomButton
          tone="rose"
          class="flex items-center gap-2 px-3 py-1 text-xs"
          :disabled="isResetting"
          @click="openResetModal"
        >
          <span
            class="[&>svg]:h-4 [&>svg]:w-4"
            aria-hidden="true"
            v-html="updateIcon"
          />
          Reset
        </AtomButton>
      </nav>
    </div>

    <MoleculeModal
      :open="isResetModalOpen"
      title="Reset tasks"
      description="This will replace the current list with the seed tasks."
      @close="closeResetModal"
    >
      <p class="text-sm text-slate-700">
        This action cannot be undone. All current tasks will be replaced.
      </p>
      <p v-if="resetErrorMessage" class="mt-3 text-sm text-rose-600">
        {{ resetErrorMessage }}
      </p>
      <template #actions>
        <AtomButton
          :disabled="isResetting"
          class="px-4 py-2 text-sm"
          @click="closeResetModal"
        >
          Cancel
        </AtomButton>
        <MoleculeButton
          tone="rose"
          :active="true"
          :loading="isResetting"
          @click="confirmReset"
        >
          {{ isResetting ? "Resetting" : "Reset" }}
        </MoleculeButton>
      </template>
    </MoleculeModal>
  </header>
</template>

<script setup lang="ts">
import AtomLink from "~/components/atoms/AtomLink.vue";
import AtomButton from "~/components/atoms/AtomButton.vue";
import MoleculeButton from "~/components/molecules/MoleculeButton.vue";
import MoleculeModal from "~/components/molecules/MoleculeModal.vue";
import { useTaskReset } from "~/composables/useTaskReset";
import { getErrorMessage } from "~/helpers/error-message";
import type { HeaderProps } from "~/types/components";
import updateIcon from "~/assets/icons/update.svg?raw";

defineProps<HeaderProps>();

const { isResetting, resetError, resetTasks } = useTaskReset();
const isResetModalOpen = ref(false);

const resetErrorMessage = computed(() =>
  getErrorMessage(resetError.value, "Unable to reset tasks.")
);

const openResetModal = () => {
  resetError.value = null;
  isResetModalOpen.value = true;
};

const closeResetModal = () => {
  if (isResetting.value) return;
  resetError.value = null;
  isResetModalOpen.value = false;
};

const confirmReset = async () => {
  if (isResetting.value) return;

  try {
    await resetTasks();
    isResetModalOpen.value = false;
  } catch {
    return;
  }
};
</script>
