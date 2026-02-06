<template>
  <div class="glass-panel overflow-hidden rounded-md border border-purple-500/30 bg-black/40 text-xs text-gray-200">
    <!-- Header / Toggle -->
    <div
      class="flex cursor-pointer items-center justify-between bg-purple-900/30 px-3 py-1.5 font-mono font-bold text-purple-300 transition-colors duration-200 hover:bg-purple-800/40 hover:text-purple-100"
      @click="togglePanel"
    >
      <span>{{ isOpen ? '▼' : '▶' }} 深层生理</span>
      <span v-if="!isOpen" class="text-[10px] opacity-70">监控中</span>
    </div>

    <!-- Collapsible Content -->
    <div ref="contentRef" class="h-0 overflow-hidden">
      <div class="space-y-4 p-3">
        <!-- Vitals Row -->
        <div class="grid grid-cols-3 gap-2">
          <!-- Heart Rate -->
          <div class="flex flex-col items-center justify-center rounded bg-black/20 p-2">
            <span class="mb-1 text-[10px] text-gray-400">心率</span>
            <div class="flex items-center gap-1">
              <span class="animate-pulse text-lg" :class="data.心跳 > 100 ? 'text-red-500' : 'text-pink-500'"> ♥ </span>
              <span class="font-mono text-sm font-bold" :class="data.心跳 > 100 ? 'text-red-400' : 'text-gray-100'">
                {{ Math.round(data.心跳) }}
              </span>
              <span class="text-[9px] text-gray-500">BPM</span>
            </div>
          </div>

          <!-- Breathing -->
          <div class="flex flex-col items-center justify-center rounded bg-black/20 p-2">
            <span class="mb-1 text-[10px] text-gray-400">呼吸</span>
            <div class="flex items-center gap-1">
              <span class="font-mono text-sm font-bold text-cyan-300">
                {{ Math.round(data.呼吸频率) }}
              </span>
              <span class="text-[9px] text-gray-500">次/分</span>
            </div>
          </div>

          <!-- Temperature -->
          <div class="flex flex-col items-center justify-center rounded bg-black/20 p-2">
            <span class="mb-1 text-[10px] text-gray-400">体温</span>
            <div class="flex items-center gap-1">
              <span class="font-mono text-sm font-bold" :class="data.体温 > 37.5 ? 'text-red-400' : 'text-orange-300'">
                {{ data.体温.toFixed(1) }}
              </span>
              <span class="text-[9px] text-gray-500">°C</span>
            </div>
          </div>
        </div>

        <!-- Hormones Section -->
        <div>
          <div class="mb-1.5 flex items-center justify-between border-b border-purple-500/20 pb-0.5">
            <span class="text-[10px] text-purple-300/80">激素</span>
          </div>
          <div class="grid grid-cols-2 gap-x-4 gap-y-2">
            <div v-for="(value, name) in data.荷尔蒙" :key="name" class="space-y-0.5">
              <div class="flex justify-between text-[10px]">
                <span class="text-gray-400">{{ name }}</span>
                <span class="font-mono text-purple-200">{{ Math.round(value) }}%</span>
              </div>
              <div class="relative h-1.5 w-full overflow-hidden rounded-full bg-gray-800">
                <div
                  class="absolute top-0 left-0 h-full rounded-full bg-gradient-to-r from-purple-600 to-pink-500"
                  :style="{ width: `${Math.min(Math.max(value, 0), 100)}%` }"
                ></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Neural / Status Section -->
        <div>
          <div class="mb-1.5 flex items-center justify-between border-b border-purple-500/20 pb-0.5">
            <span class="text-[10px] text-purple-300/80">神经状态</span>
          </div>
          <div class="space-y-2">
            <!-- Neural Response -->
            <div class="space-y-0.5">
              <div class="flex justify-between text-[10px]">
                <span class="text-gray-400">神经反应度</span>
                <span class="font-mono text-cyan-200">{{ Math.round(data.神经反应度) }}%</span>
              </div>
              <div class="relative h-1.5 w-full overflow-hidden rounded-full bg-gray-800">
                <div
                  class="absolute top-0 left-0 h-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-400"
                  :style="{ width: `${Math.min(Math.max(data.神经反应度, 0), 100)}%` }"
                ></div>
              </div>
            </div>

            <!-- Muscle Tension -->
            <div class="space-y-0.5">
              <div class="flex justify-between text-[10px]">
                <span class="text-gray-400">肌肉紧张度</span>
                <span class="font-mono text-orange-200">{{ Math.round(data.肌肉紧张度) }}%</span>
              </div>
              <div class="relative h-1.5 w-full overflow-hidden rounded-full bg-gray-800">
                <div
                  class="absolute top-0 left-0 h-full rounded-full bg-gradient-to-r from-orange-600 to-yellow-400"
                  :style="{ width: `${Math.min(Math.max(data.肌肉紧张度, 0), 100)}%` }"
                ></div>
              </div>
            </div>

            <!-- Pupil Dilation -->
            <div class="space-y-0.5">
              <div class="flex justify-between text-[10px]">
                <span class="text-gray-400">瞳孔扩张</span>
                <span class="font-mono text-green-200">{{ Math.round(data.瞳孔扩张) }}%</span>
              </div>
              <div class="relative h-1.5 w-full overflow-hidden rounded-full bg-gray-800">
                <div
                  class="absolute top-0 left-0 h-full rounded-full bg-gradient-to-r from-green-600 to-emerald-400"
                  :style="{ width: `${Math.min(Math.max(data.瞳孔扩张, 0), 100)}%` }"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { gsap } from 'gsap';

const props = defineProps<{
  data: {
    心跳: number;
    呼吸频率: number;
    体温: number;
    荷尔蒙: { 多巴胺: number; 内啡肽: number; 肾上腺素: number; 催产素: number };
    神经反应度: number;
    肌肉紧张度: number;
    瞳孔扩张: number;
  };
}>();

const isOpen = ref(false);
const contentRef = ref<HTMLElement | null>(null);

const togglePanel = () => {
  isOpen.value = !isOpen.value;
};

// Animation logic for collapse/expand
watch(isOpen, newVal => {
  if (!contentRef.value) return;

  if (newVal) {
    gsap.to(contentRef.value, {
      height: 'auto',
      duration: 0.4,
      ease: 'power2.out',
    });
  } else {
    gsap.to(contentRef.value, {
      height: 0,
      duration: 0.3,
      ease: 'power2.in',
    });
  }
});

// Ensure initial state is correct (0 height) without animation on mount if default is closed
onMounted(() => {
  if (!isOpen.value && contentRef.value) {
    gsap.set(contentRef.value, { height: 0 });
  }
});
</script>

<style scoped>
/* Glass panel effect is likely provided by project global styles, 
   but we add some specific text glow effects here */
.font-mono {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
}
</style>
