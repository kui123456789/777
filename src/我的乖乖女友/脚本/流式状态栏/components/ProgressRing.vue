<script setup lang="ts">
import { ref, watch } from 'vue';
import gsap from 'gsap';
const props = withDefaults(
  defineProps<{
    modelValue: number;
    color?: string;
    strokeWidth?: number;
  }>(),
  {
    color: 'text-blue-500',
    strokeWidth: 4,
  },
);

const radius = 18;
const circumference = 2 * Math.PI * radius;
const displayOffset = ref(circumference);

// Watch for value changes and animate
watch(
  () => props.modelValue,
  newVal => {
    const val = _.clamp(newVal, 0, 100);
    const offset = circumference - (val / 100) * circumference;

    gsap.to(displayOffset, {
      value: offset,
      duration: 1.0,
      ease: 'elastic.out(1, 0.7)',
    });
  },
  { immediate: true },
);
</script>

<template>
  <div class="relative w-12 h-12 flex items-center justify-center select-none">
    <svg class="w-full h-full transform -rotate-90" viewBox="0 0 44 44">
      <!-- Background Circle -->
      <circle
        class="text-white/10"
        stroke="currentColor"
        :stroke-width="strokeWidth"
        fill="transparent"
        :r="radius"
        cx="22"
        cy="22"
      />
      <!-- Progress Circle -->
      <circle
        :class="color"
        stroke="currentColor"
        :stroke-width="strokeWidth"
        fill="transparent"
        :r="radius"
        cx="22"
        cy="22"
        stroke-linecap="round"
        :stroke-dasharray="circumference"
        :stroke-dashoffset="displayOffset"
      />
    </svg>
    <!-- Text Value -->
    <div class="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white/90">
      {{ Math.round(modelValue) }}
    </div>
  </div>
</template>
