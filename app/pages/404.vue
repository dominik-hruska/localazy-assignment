<template>
  <section class="flex flex-col gap-6">
    <div class="rounded-2xl border border-slate-200 bg-white p-8">
      <p class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
        Error 404
      </p>
      <h1 class="mt-4 text-3xl font-semibold text-slate-900">Page not found</h1>
      <p class="mt-3 text-sm text-slate-600">
        The requested page does not exist. You can return to the dashboard or open the
        task list.
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
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import AtomLink from "~/components/atoms/AtomLink.vue";
</script>
