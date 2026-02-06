<script setup lang="ts">
defineProps<{
  label: string;
  value: string | number;
  icon?: string; // Emoji or character
  color?: string; // Tailwind bg class for icon background
}>();
</script>

<template>
  <div class="flex min-w-[60px] flex-col items-center justify-center rounded-xl border border-white/10 bg-white/5 p-2">
    <div class="mb-1 text-xs text-white/60">{{ label }}</div>
    <div class="flex items-center gap-1 font-bold text-white/90">
      <span v-if="icon" class="text-sm">{{ icon }}</span>
      <span>{{ value }}</span>
    </div>
  </div>
</template>
