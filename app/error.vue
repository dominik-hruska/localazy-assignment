<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 text-slate-900">
    <Header />

    <main class="mx-auto w-full max-w-5xl px-4 py-10">
      <div class="rounded-2xl border border-slate-200 bg-white p-8">
        <p class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
          Error {{ statusCode }}
        </p>
        <h1 class="mt-4 text-3xl font-semibold text-slate-900">
          {{ title }}
        </h1>
        <p class="mt-3 text-sm text-slate-600">
          {{ description }}
        </p>
        <p v-if="detail" class="mt-4 text-xs text-slate-400">
          {{ detail }}
        </p>

        <div class="mt-6 flex flex-wrap gap-3">
          <AtomLink
            class="rounded-full border border-slate-900 bg-slate-900 px-5 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-lg"
            to="/"
          >
            Back to dashboard
          </AtomLink>
          <AtomLink
            class="rounded-full border border-slate-300 px-5 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400"
            to="/tasks"
          >
            View tasks
          </AtomLink>
          <button
            v-if="statusCode !== 404"
            type="button"
            class="rounded-full border border-slate-300 px-5 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400"
            @click="handleClear"
          >
            Try again
          </button>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import type { NuxtError } from "#app";
import AtomLink from "~/components/atoms/AtomLink.vue";
import Header from "~/components/Header.vue";

const props = defineProps<{
  error: NuxtError;
}>();

const statusCode = computed(() => props.error?.statusCode ?? 500);
const isNotFound = computed(() => statusCode.value === 404);

const title = computed(() =>
  isNotFound.value ? "Page not found" : "Something went wrong",
);

const description = computed(() =>
  isNotFound.value
    ? "The page you are looking for does not exist or has been moved."
    : "An unexpected error occurred while loading this view.",
);

const detail = computed(() => props.error?.message ?? "");

function handleClear() {
  clearError({ redirect: "/" });
}
</script>
