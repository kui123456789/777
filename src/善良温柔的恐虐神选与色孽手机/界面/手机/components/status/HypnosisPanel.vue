<script setup lang="ts">
import { ref, watch, computed, nextTick } from 'vue';
import { gsap } from 'gsap';

// Props definition
const props = defineProps<{
  data: {
    催眠深度: number;
    暗示接受度: number;
    抵抗力: number;
    意识模糊度: number;
    植入暗示: Record<string, { 内容: string; 强度: number; 触发词?: string; 激活状态: boolean }>;
    累计催眠次数: number;
  };
}>();

const isOpen = ref(false);
const contentRef = ref<HTMLElement | null>(null);

const toggle = () => {
  isOpen.value = !isOpen.value;
};

watch(isOpen, async val => {
  await nextTick();
  if (!contentRef.value) return;

  if (val) {
    gsap.fromTo(
      contentRef.value,
      { height: 0, opacity: 0 },
      { height: 'auto', opacity: 1, duration: 0.5, ease: 'power2.out' },
    );
  } else {
    gsap.to(contentRef.value, { height: 0, opacity: 0, duration: 0.3, ease: 'power2.in' });
  }
});

// Computed for Resistance color (High = Green, Low = Red)
// Assuming Resistance is 0-100. High resistance is "safe" (green), Low is "danger" (red/pink).
const resistanceColor = computed(() => {
  const val = props.data.抵抗力;
  if (val > 60) return 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]';
  if (val > 30) return 'bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.5)]';
  return 'bg-rose-600 shadow-[0_0_10px_rgba(225,29,72,0.8)]';
});

const suggestionList = computed(() => {
  if (!props.data.植入暗示) return [];
  return Object.values(props.data.植入暗示);
});
</script>

<template>
  <div
    class="hypnosis-panel w-full overflow-hidden rounded-md border border-fuchsia-900/50 bg-[#0f0518]/90 shadow-[0_0_15px_rgba(192,38,211,0.1)] backdrop-blur-sm"
  >
    <!-- Header -->
    <button
      class="group flex w-full cursor-pointer items-center justify-between border-b border-fuchsia-900/30 bg-gradient-to-r from-[#2a0a2e] to-[#150518] px-3 py-2 transition-colors hover:bg-[#3a0e40]"
      @click="toggle"
    >
      <div class="flex items-center gap-2">
        <span class="font-mono text-xs tracking-widest text-fuchsia-400 transition-colors group-hover:text-fuchsia-200">
          {{ isOpen ? '▼' : '▶' }} 催眠控制
        </span>
        <div class="h-[1px] w-8 bg-fuchsia-800/50"></div>
      </div>
      <div class="flex items-center gap-2">
        <span class="font-mono text-[10px] tracking-widest text-fuchsia-600 uppercase">
          累计: <span class="text-fuchsia-300">{{ props.data.累计催眠次数 }}</span>
        </span>
        <div class="h-1.5 w-1.5 animate-pulse rounded-full bg-fuchsia-500 shadow-[0_0_5px_#d946ef]"></div>
      </div>
    </button>

    <!-- Content -->
    <div ref="contentRef" class="h-0 overflow-hidden opacity-0">
      <div class="space-y-5 p-4">
        <!-- Bars Grid -->
        <div class="grid grid-cols-2 gap-x-4 gap-y-3">
          <!-- Hypnosis Depth -->
          <div class="space-y-1">
            <div class="flex justify-between font-mono text-[10px] text-fuchsia-300/80">
              <span>深度</span>
              <span>{{ props.data.催眠深度 }}%</span>
            </div>
            <div class="h-1.5 overflow-hidden rounded-full border border-fuchsia-900/30 bg-gray-900">
              <div
                class="h-full bg-gradient-to-r from-violet-900 via-fuchsia-800 to-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.6)]"
                :style="{ width: `${props.data.催眠深度}%` }"
              ></div>
            </div>
          </div>

          <!-- Suggestibility -->
          <div class="space-y-1">
            <div class="flex justify-between font-mono text-[10px] text-pink-300/80">
              <span>暗示接受度</span>
              <span>{{ props.data.暗示接受度 }}%</span>
            </div>
            <div class="h-1.5 overflow-hidden rounded-full border border-pink-900/30 bg-gray-900">
              <div
                class="h-full bg-gradient-to-r from-pink-900 to-pink-500 shadow-[0_0_8px_rgba(236,72,153,0.6)]"
                :style="{ width: `${props.data.暗示接受度}%` }"
              ></div>
            </div>
          </div>

          <!-- Resistance -->
          <div class="space-y-1">
            <div class="flex justify-between font-mono text-[10px] text-slate-300/80">
              <span>抵抗力</span>
              <span>{{ props.data.抵抗力 }}%</span>
            </div>
            <div class="h-1.5 overflow-hidden rounded-full border border-slate-700/30 bg-gray-900">
              <div
                class="h-full transition-all duration-500"
                :class="resistanceColor"
                :style="{ width: `${props.data.抵抗力}%` }"
              ></div>
            </div>
          </div>

          <!-- Confusion -->
          <div class="space-y-1">
            <div class="flex justify-between font-mono text-[10px] text-indigo-300/80">
              <span>意识模糊</span>
              <span>{{ props.data.意识模糊度 }}%</span>
            </div>
            <div class="h-1.5 overflow-hidden rounded-full border border-indigo-900/30 bg-gray-900">
              <div
                class="h-full animate-[pulse_3s_ease-in-out_infinite] bg-gradient-to-r from-indigo-900 via-purple-500 to-fuchsia-400"
                :style="{ width: `${props.data.意识模糊度}%` }"
              ></div>
            </div>
          </div>
        </div>

        <!-- Suggestions List -->
        <div class="space-y-2">
          <div class="mb-1 flex items-center gap-2">
            <div class="h-3 w-1 bg-fuchsia-500"></div>
            <span class="font-mono text-[10px] font-bold tracking-widest text-fuchsia-200 uppercase">植入暗示</span>
          </div>

          <div
            v-if="suggestionList.length === 0"
            class="rounded border border-dashed border-white/10 bg-white/5 py-3 text-center"
          >
            <span class="font-mono text-[10px] tracking-widest text-white/30">无暗示</span>
          </div>

          <div v-else class="custom-scrollbar max-h-[200px] space-y-2 overflow-y-auto pr-1">
            <div
              v-for="(sug, index) in suggestionList"
              :key="index"
              class="group relative rounded border p-2 transition-all duration-300"
              :class="[
                sug.激活状态
                  ? 'border-fuchsia-500/50 bg-fuchsia-900/20 shadow-[0_0_10px_rgba(217,70,239,0.15)]'
                  : 'border-white/10 bg-white/5 opacity-70 hover:opacity-100',
              ]"
            >
              <!-- Active Glow Line -->
              <div
                v-if="sug.激活状态"
                class="absolute top-0 bottom-0 left-0 w-[2px] bg-fuchsia-400 shadow-[0_0_8px_#e879f9]"
              ></div>

              <div class="mb-1 flex items-start justify-between pl-2">
                <span class="text-xs leading-tight font-medium text-fuchsia-100/90">{{ sug.内容 }}</span>
                <span
                  class="ml-2 rounded px-1 py-0.5 font-mono text-[9px] whitespace-nowrap"
                  :class="sug.激活状态 ? 'bg-fuchsia-500 text-white shadow-sm' : 'bg-slate-700 text-slate-400'"
                >
                  Lv.{{ sug.强度 }}
                </span>
              </div>

              <div v-if="sug.触发词" class="mt-1 flex items-center gap-1 pl-2">
                <span class="font-mono text-[9px] text-fuchsia-400/60 uppercase">触发词:</span>
                <span
                  class="rounded border border-fuchsia-500/20 bg-fuchsia-900/40 px-1 font-mono text-[10px] text-fuchsia-300"
                >
                  [{{ sug.触发词 }}]
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 2px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.2);
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(217, 70, 239, 0.3);
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(217, 70, 239, 0.6);
}
</style>
