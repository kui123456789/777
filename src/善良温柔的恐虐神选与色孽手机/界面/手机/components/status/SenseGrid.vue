<template>
  <div class="sense-grid my-2 grid grid-cols-5 gap-1 rounded border border-gray-800 bg-black/40 p-2">
    <div v-for="(val, part) in senseData" :key="part" class="sense-cell flex flex-col items-center">
      <div class="bar-container relative mb-1 h-12 w-full overflow-hidden rounded-sm bg-gray-900">
        <div
          :ref="(el: any) => setBarRef(part as string, el)"
          class="fill-bar absolute bottom-0 left-0 w-full"
          :style="{ background: getGradient(val) }"
        ></div>
        <!-- Glow overlay for high values -->
        <div
          v-if="val >= 85"
          class="animate-glow-pulse pointer-events-none absolute inset-0"
          :style="{
            background: 'radial-gradient(ellipse at center bottom, rgba(255, 23, 68, 0.3) 0%, transparent 70%)',
          }"
        ></div>
      </div>
      <span class="scale-90 text-[10px] text-gray-400">{{ part }}</span>
      <span class="font-mono text-[10px] font-bold" :class="getColorClass(val)">
        {{ displayValues[part as string] ?? val }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, reactive } from 'vue';
import { gsap } from 'gsap';

const props = defineProps<{
  senseData: Record<string, number>;
}>();

// Store refs for each bar element
const barRefs: Record<string, HTMLElement | null> = reactive({});
// Store animated display values
const displayValues: Record<string, number> = reactive({});

const setBarRef = (part: string, el: HTMLElement | null) => {
  barRefs[part] = el;
};

// Initialize display values
onMounted(() => {
  Object.entries(props.senseData).forEach(([part, val]) => {
    displayValues[part] = val;
    // Initial animation on mount
    const barEl = barRefs[part];
    if (barEl) {
      gsap.fromTo(barEl, { height: '0%' }, { height: `${Math.min(val, 100)}%`, duration: 0.8, ease: 'power2.out' });
    }
  });
});

// Watch for data changes and animate
watch(
  () => props.senseData,
  (newData, oldData) => {
    Object.entries(newData).forEach(([part, newVal]) => {
      const oldVal = oldData?.[part] ?? 0;
      const barEl = barRefs[part];

      // Animate bar height
      if (barEl) {
        gsap.to(barEl, {
          height: `${Math.min(newVal, 100)}%`,
          duration: 0.5,
          ease: 'power2.out',
        });
      }

      // Animate number display
      if (newVal !== oldVal) {
        gsap.to(displayValues, {
          [part]: newVal,
          duration: 0.5,
          ease: 'power2.out',
          onUpdate: () => {
            displayValues[part] = Math.round(displayValues[part]);
          },
        });
      }
    });
  },
  { deep: true },
);

const getGradient = (val: number) => {
  if (val < 30) return 'linear-gradient(to top, #444, #666)';
  if (val < 60) return 'linear-gradient(to top, #00b0ff, #00e5ff)'; // Blue
  if (val < 85) return 'linear-gradient(to top, #d500f9, #ff4081)'; // Purple/Pink
  return 'linear-gradient(to top, #ff1744, #ff5252)'; // Red
};

const getColorClass = (val: number) => {
  if (val < 30) return 'text-gray-500';
  if (val < 60) return 'text-cyan-400';
  if (val < 85) return 'text-pink-400';
  return 'text-red-500 animate-pulse';
};
</script>

<style scoped>
.sense-cell:hover .fill-bar {
  filter: brightness(1.2);
}

.animate-glow-pulse {
  animation: glow-pulse 1.5s ease-in-out infinite;
}

@keyframes glow-pulse {
  0%,
  100% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.7;
  }
}
</style>
