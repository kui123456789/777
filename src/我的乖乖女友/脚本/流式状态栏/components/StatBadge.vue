<script setup lang="ts">
defineProps<{
  label: string;
  value: string | number;
  icon?: string; // Emoji or character
  color?: string; // Tailwind bg class for icon background
}>();
</script>

<template>
  <div class="flex flex-col items-center justify-center p-2 rounded-xl bg-white/5 border border-white/10 min-w-[60px]">
    <div class="text-xs text-white/60 mb-1">{{ label }}</div>
    <div class="font-bold text-white/90 flex items-center gap-1">
      <span v-if="icon" class="text-sm">{{ icon }}</span>
      <span>{{ value }}</span>
    </div>
  </div>
</template>
