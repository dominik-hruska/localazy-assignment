<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 text-slate-900">
    <Header />

    <main class="mx-auto w-full max-w-5xl px-4 py-10">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import Header from "~/components/Header.vue";
</script>
