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
      'flex h-14 w-14 items-center justify-center rounded-full border-2 border-white/20 text-xl font-bold text-white shadow-inner',
      color || 'bg-gray-500/20',
    ]"
  >
    {{ initials }}
  </div>
</template>
