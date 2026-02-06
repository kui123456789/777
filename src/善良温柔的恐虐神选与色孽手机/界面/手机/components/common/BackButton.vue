<script setup lang="ts">
import { usePhoneNavigation } from '../../router';

const props = withDefaults(
  defineProps<{
    label?: string;
    showLabel?: boolean;
  }>(),
  {
    label: '返回',
    showLabel: true,
  },
);

const { goBack } = usePhoneNavigation();
</script>

<template>
  <button
    class="back-btn group flex items-center gap-1.5 rounded-lg border border-white/10 bg-black/30 px-3 py-1.5 transition-all duration-200 hover:border-[var(--theme-color)]/50 hover:bg-black/50"
    @click="goBack"
  >
    <!-- Arrow Icon -->
    <svg
      class="h-4 w-4 text-[var(--theme-secondary)] transition-colors group-hover:text-[var(--theme-color)]"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
    </svg>

    <!-- Label -->
    <span v-if="showLabel" class="text-xs font-medium text-gray-300 transition-colors group-hover:text-white">
      {{ label }}
    </span>
  </button>
</template>

<style scoped>
.back-btn {
  backdrop-filter: blur(8px);
}

.back-btn:active {
  transform: scale(0.95);
}
</style>
