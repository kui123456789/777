<script setup lang="ts">
import type { PhoneView } from '../../router';

defineProps<{
  icon: string;
  label: string;
  active?: boolean;
  targetView?: PhoneView;
}>();

defineEmits<{
  (e: 'click'): void;
}>();
</script>

<template>
  <div
    class="group flex cursor-pointer flex-col items-center justify-center gap-2 p-3 transition-all duration-300 hover:scale-105"
    @click="$emit('click')"
  >
    <div
      class="bg-opacity-20 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 text-3xl shadow-lg backdrop-blur-sm transition-all duration-300 group-hover:border-[var(--theme-color)] group-hover:shadow-[0_0_15px_var(--theme-color)]"
      :class="[
        active
          ? 'border-[var(--theme-color)] bg-[var(--theme-color)] shadow-[0_0_15px_var(--theme-color)]'
          : 'bg-black/40',
      ]"
    >
      {{ icon }}
    </div>
    <span
      class="text-xs font-medium tracking-wide transition-colors duration-300 group-hover:text-[var(--theme-color)]"
      :class="[active ? 'text-[var(--theme-color)]' : 'text-gray-300']"
    >
      {{ label }}
    </span>
  </div>
</template>

<style scoped>
/* Scoped styles if needed, mainly relying on Tailwind */
</style>
