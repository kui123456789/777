<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { gsap } from 'gsap';

const props = defineProps<{
  data: {
    CPU温度: number;
    内存占用: number;
    情感模拟强度: number;
    感知处理延迟: number;
    自我意识指数: number;
    情感溢出风险: number;
  };
}>();

const isExpanded = ref(false);
const contentRef = ref<HTMLElement | null>(null);

const togglePanel = () => {
  isExpanded.value = !isExpanded.value;
};

watch(isExpanded, newVal => {
  if (!contentRef.value) return;

  if (newVal) {
    gsap.to(contentRef.value, {
      height: 'auto',
      opacity: 1,
      marginTop: '0.5rem',
      duration: 0.4,
      ease: 'power2.out',
    });
  } else {
    gsap.to(contentRef.value, {
      height: 0,
      opacity: 0,
      marginTop: 0,
      duration: 0.3,
      ease: 'power2.in',
    });
  }
});
</script>

<template>
  <div class="deep-robot-panel w-full font-mono text-xs select-none">
    <!-- Header -->
    <div
      class="header flex cursor-pointer items-center gap-2 rounded-sm border border-blue-500/30 bg-blue-900/20 p-2 text-blue-300 backdrop-blur-sm transition-all hover:border-blue-400/50 hover:bg-blue-800/30"
      @click="togglePanel"
    >
      <span class="transform text-[10px] transition-transform duration-300" :class="{ 'rotate-90': isExpanded }"
        >▶</span
      >
      <span class="font-bold tracking-widest">核心诊断</span>
      <div class="mx-2 ml-auto h-[1px] flex-1 bg-gradient-to-r from-blue-500/50 to-transparent"></div>
      <div class="flex gap-1">
        <div class="h-1 w-1 animate-pulse rounded-full bg-blue-500"></div>
        <div class="h-1 w-1 rounded-full bg-blue-500/50"></div>
        <div class="h-1 w-1 rounded-full bg-blue-500/20"></div>
      </div>
    </div>

    <!-- Content -->
    <div
      ref="contentRef"
      class="content-wrapper h-0 overflow-hidden rounded-b-sm border-x border-b border-blue-500/20 bg-black/40 opacity-0"
    >
      <div class="grid grid-cols-2 gap-x-4 gap-y-3 p-3">
        <!-- CPU Temperature -->
        <div class="col-span-1 flex flex-col gap-1">
          <div class="flex items-end justify-between">
            <span class="text-blue-400/70">CPU温度</span>
            <span
              class="font-bold"
              :class="
                props.data.CPU温度 > 70
                  ? 'animate-pulse text-red-500 drop-shadow-[0_0_5px_rgba(239,68,68,0.8)]'
                  : 'text-cyan-300'
              "
            >
              {{ props.data.CPU温度.toFixed(1) }}°C
            </span>
          </div>
          <div class="h-1 w-full overflow-hidden rounded-full bg-blue-900/30">
            <div
              class="h-full transition-all duration-500"
              :class="props.data.CPU温度 > 70 ? 'bg-red-500' : 'bg-cyan-500'"
              :style="{ width: `${Math.min(props.data.CPU温度, 100)}%` }"
            ></div>
          </div>
        </div>

        <!-- Latency -->
        <div class="col-span-1 flex flex-col gap-1">
          <div class="flex items-end justify-between">
            <span class="text-blue-400/70">延迟</span>
            <span class="font-bold text-cyan-300">{{ props.data.感知处理延迟 }}ms</span>
          </div>
          <div class="relative h-1 w-full overflow-hidden rounded-full bg-blue-900/30">
            <!-- Digital noise decoration -->
            <div class="absolute top-0 right-0 bottom-0 w-[2px] animate-[ping_2s_linear_infinite] bg-blue-400/50"></div>
            <div class="h-full bg-cyan-500/50 transition-all duration-300" :style="{ width: '100%' }"></div>
          </div>
        </div>

        <!-- Memory Usage -->
        <div class="col-span-2">
          <div class="mb-1 flex justify-between text-[10px]">
            <span class="text-blue-400/70">内存分配</span>
            <span class="text-blue-300">{{ props.data.内存占用.toFixed(1) }}%</span>
          </div>
          <div class="h-1.5 w-full rounded-sm border border-blue-500/30 bg-blue-900/40 p-[1px]">
            <div
              class="h-full bg-blue-400 shadow-[0_0_5px_rgba(96,165,250,0.5)] transition-all duration-700 ease-out"
              :style="{ width: `${props.data.内存占用}%` }"
            ></div>
          </div>
        </div>

        <!-- Emotion Simulation -->
        <div class="col-span-2">
          <div class="mb-1 flex justify-between text-[10px]">
            <span class="text-blue-400/70">情感模拟</span>
            <span class="text-purple-300">{{ props.data.情感模拟强度.toFixed(0) }}%</span>
          </div>
          <div class="flex h-1.5 w-full gap-[1px] overflow-hidden rounded-sm border border-blue-500/30 bg-blue-900/40">
            <div
              v-for="i in 20"
              :key="i"
              class="h-full flex-1 transition-colors duration-300"
              :class="
                i <= props.data.情感模拟强度 / 5
                  ? 'bg-purple-500 shadow-[0_0_2px_rgba(168,85,247,0.8)]'
                  : 'bg-transparent'
              "
            ></div>
          </div>
        </div>

        <!-- Self Awareness -->
        <div class="col-span-2">
          <div class="mb-1 flex justify-between text-[10px]">
            <span class="text-blue-400/70">自我意识</span>
            <span
              class="transition-all duration-500"
              :class="
                props.data.自我意识指数 > 80
                  ? 'text-amber-300 drop-shadow-[0_0_5px_rgba(252,211,77,0.8)]'
                  : 'text-blue-300'
              "
            >
              {{ props.data.自我意识指数.toFixed(1) }}%
            </span>
          </div>
          <div class="relative h-2 w-full overflow-hidden rounded-sm bg-blue-900/40">
            <div
              class="h-full bg-gradient-to-r from-blue-600 via-cyan-400 to-white transition-all duration-1000"
              :class="{ 'animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.6)]': props.data.自我意识指数 > 80 }"
              :style="{ width: `${props.data.自我意识指数}%` }"
            ></div>
          </div>
        </div>

        <!-- Overflow Risk -->
        <div class="col-span-2 mt-1">
          <div class="mb-1 flex justify-between text-[10px]">
            <span class="text-blue-400/70">溢出风险</span>
            <span
              class="font-bold"
              :class="props.data.情感溢出风险 > 70 ? 'blink-text text-red-500' : 'text-green-400'"
            >
              {{ props.data.情感溢出风险 > 70 ? '危急' : '稳定' }} ({{ props.data.情感溢出风险 }}%)
            </span>
          </div>
          <div class="relative h-2 w-full overflow-hidden rounded-sm border border-blue-500/20 bg-black/60">
            <!-- Background Grid -->
            <div
              class="absolute inset-0 bg-[linear-gradient(90deg,transparent_90%,rgba(59,130,246,0.1)_90%)] bg-[length:10px_100%]"
            ></div>

            <div
              class="relative h-full transition-all duration-300"
              :class="
                props.data.情感溢出风险 > 70 ? 'bg-red-600 shadow-[0_0_10px_rgba(220,38,38,0.8)]' : 'bg-green-500/80'
              "
              :style="{ width: `${props.data.情感溢出风险}%` }"
            >
              <!-- Glitch effect overlay when high -->
              <div v-if="props.data.情感溢出风险 > 70" class="absolute inset-0 animate-pulse bg-white/20"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer Decoration -->
      <div class="h-[2px] w-full bg-gradient-to-r from-transparent via-blue-500/50 to-transparent opacity-50"></div>
    </div>
  </div>
</template>

<style scoped>
.blink-text {
  animation: blink 1s step-end infinite;
}

@keyframes blink {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
</style>
