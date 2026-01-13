<template>
  <NuxtLink
    v-if="useNuxtLink"
    v-bind="$attrs"
    :to="props.to"
    :exact-active-class="props.exactActiveClass"
    :target="props.newWindow ? '_blank' : undefined"
    :rel="props.newWindow ? 'noopener' : undefined"
  >
    <slot />
  </NuxtLink>
  <a
    v-else
    v-bind="$attrs"
    :href="href"
    :target="props.newWindow ? '_blank' : undefined"
    :rel="props.newWindow ? 'noopener' : undefined"
    :aria-label="props.ariaLabel"
  >
    <slot />
  </a>
</template>

<script setup lang="ts">
import type { AtomLinkProps } from "~/types/atoms";

defineOptions({ inheritAttrs: false });

const props = withDefaults(
  defineProps<AtomLinkProps>(),
  {
    nuxtLink: true,
    newWindow: false,
  },
);

const useNuxtLink = computed(() => props.nuxtLink && props.to !== undefined);
const href = computed(() => (typeof props.to === "string" ? props.to : ""));
</script>
