<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  name: string;
  color?: string;
}>();

const initials = computed(() => props.name.slice(0, 1));
</script>

<template>
  <div
    :class="[
      'w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-inner border-2 border-white/20',
      color || 'bg-gray-500/20',
    ]"
  >
    {{ initials }}
  </div>
</template>
