<template>
  <div
    class="view-container relative flex min-h-full w-full flex-col overflow-hidden bg-black font-mono text-[#00ccff]"
  >
    <!-- Background Effects -->
    <div class="pointer-events-none absolute inset-0 z-0">
      <div
        class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTTAgNDBMMCAwTDQwIDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzAwY2NmZiIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIiAvPjwvc3ZnPg==')] opacity-20"
      ></div>
      <div
        class="scanline animate-scan absolute inset-0 h-[10px] w-full bg-gradient-to-b from-transparent via-[#00ccff10] to-transparent"
      ></div>
      <div class="vignette absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_50%,black_100%)]"></div>
    </div>

    <!-- Header -->
    <header
      class="relative z-10 flex items-center justify-between border-b border-[#00ccff]/30 bg-black/60 px-4 py-3 shadow-[0_0_15px_rgba(0,204,255,0.2)] backdrop-blur-md"
    >
      <div class="flex items-center gap-3">
        <BackButton />
        <h1 class="text-shadow-neon text-lg font-bold tracking-widest">远程操控</h1>
      </div>

      <!-- Connection Status -->
      <div class="flex flex-col items-end">
        <div class="mb-1 flex items-center gap-1">
          <div class="signal-bars flex h-3 items-end gap-[2px]">
            <div
              v-for="i in 5"
              :key="i"
              class="w-[3px] bg-[#00ccff]/30 transition-all duration-300"
              :class="{
                'bg-[#00ccff] shadow-[0_0_5px_#00ccff]': i <= signalStrength,
                'animate-pulse': i === signalStrength,
              }"
              :style="{ height: `${40 + i * 12}%` }"
            ></div>
          </div>
          <div class="ml-2 h-2 w-2 animate-ping rounded-full bg-[#00ccff]"></div>
        </div>
        <span
          class="text-[9px] tracking-wider opacity-80"
          :class="connectionStatus === '已连接' ? 'text-[#00ccff]' : 'text-red-500'"
        >
          {{ connectionStatus }}
        </span>
      </div>
    </header>

    <!-- Main Content -->
    <main class="relative z-10 flex flex-1 flex-col gap-3 overflow-hidden p-3">
      <!-- Target Selector -->
      <section class="panel-box p-2">
        <div class="mb-2 flex justify-between text-[10px] tracking-widest text-[#00ccff]/60">
          <span>目标链接</span>
          <span>{{ selectedTarget }}</span>
        </div>
        <div class="grid grid-cols-4 gap-2">
          <button
            v-for="target in targets"
            :key="target"
            class="target-btn group relative h-10 overflow-hidden rounded border border-[#00ccff]/30 bg-[#00ccff]/5 transition-all duration-300 hover:bg-[#00ccff]/20"
            :class="{ active: selectedTarget === target }"
            @click="setTarget(target)"
          >
            <div
              class="absolute inset-0 origin-left scale-x-0 bg-[#00ccff]/10 transition-transform group-hover:scale-x-100"
            ></div>
            <span class="relative z-10 text-xs font-bold" :class="{ 'text-black': selectedTarget === target }">{{
              target
            }}</span>
            <div
              v-if="selectedTarget === target"
              class="absolute bottom-0 left-0 h-[2px] w-full bg-[#00ccff] shadow-[0_0_8px_#00ccff]"
            ></div>
          </button>
        </div>
      </section>

      <!-- Visual Control -->
      <section class="panel-box flex items-center gap-3 p-2">
        <div class="flex-1">
          <div class="mb-1 flex justify-between text-[9px] text-[#00ccff]/60">
            <span>光学变焦</span>
            <span>{{ zoomLevel.toFixed(1) }}x</span>
          </div>
          <input v-model.number="zoomLevel" type="range" min="1" max="10" step="0.1" class="cyber-range w-full" />
        </div>
        <button
          class="flex h-full flex-col items-center justify-center gap-1 rounded border border-[#00ccff]/30 px-3 transition-all"
          :class="detailMode ? 'border-[#00ccff] bg-[#00ccff]/20 shadow-[0_0_10px_#00ccff40]' : 'bg-black/40'"
          @click="detailMode = !detailMode"
        >
          <div class="flex h-3 w-3 items-center justify-center rounded-sm border border-current">
            <div v-if="detailMode" class="h-1.5 w-1.5 rounded-[1px] bg-current"></div>
          </div>
          <span class="text-[8px]">细节</span>
        </button>
      </section>

      <!-- Implants List (Scrollable) -->
      <section class="panel-box relative flex min-h-0 flex-1 flex-col overflow-hidden p-0">
        <div class="flex items-center justify-between border-b border-[#00ccff]/20 bg-[#00ccff]/5 p-2">
          <span class="text-[10px] font-bold tracking-widest">赛博植入物</span>
          <span class="rounded bg-[#00ccff]/20 px-1 text-[9px]">{{ Object.keys(currentImplants).length }} 已检测</span>
        </div>

        <div class="custom-scrollbar flex-1 space-y-3 overflow-y-auto p-2">
          <template v-if="Object.keys(currentImplants).length > 0">
            <div
              v-for="(implant, key) in currentImplants"
              :key="key"
              class="implant-card group relative overflow-hidden rounded border border-[#00ccff]/20 bg-black/40 p-3 transition-all hover:border-[#00ccff]/50"
            >
              <!-- Card Header -->
              <div class="mb-3 flex items-start justify-between">
                <div>
                  <div class="text-shadow-small flex items-center gap-2 text-sm font-bold">
                    {{ key }}
                    <span class="rounded border border-[#00ccff]/40 px-1.5 py-0.5 text-[8px] text-[#00ccff]/80">{{
                      implant.位置
                    }}</span>
                  </div>
                  <div class="mt-0.5 text-[9px] text-[#00ccff]/50">{{ implant.类型 }} TYPE</div>
                </div>

                <!-- Toggle Switch -->
                <label class="cyber-switch">
                  <input v-model="implant.已激活" type="checkbox" @change="playFeedback" />
                  <span class="slider"></span>
                  <span class="status-led"></span>
                </label>
              </div>

              <!-- Controls -->
              <div class="space-y-3" :class="{ 'pointer-events-none opacity-50 grayscale': !implant.已激活 }">
                <!-- Vibration -->
                <div>
                  <div class="mb-1 flex justify-between text-[9px]">
                    <span class="opacity-70">振动</span>
                    <span class="font-mono">{{ implant.震动强度 }}%</span>
                  </div>
                  <div class="relative flex h-4 items-center">
                    <input
                      v-model.number="implant.震动强度"
                      type="range"
                      min="0"
                      max="100"
                      class="cyber-range w-full"
                      @input="playFeedback"
                    />
                    <!-- Animated Bar for effect -->
                    <div class="absolute top-full left-0 mt-0.5 h-[2px] w-full overflow-hidden bg-black/50">
                      <div
                        class="h-full bg-[#00ccff]"
                        :style="{ width: `${implant.震动强度}%`, opacity: implant.已激活 ? 0.8 : 0 }"
                      ></div>
                    </div>
                  </div>
                </div>

                <!-- Morph -->
                <div>
                  <div class="mb-1 flex justify-between text-[9px]">
                    <span class="opacity-70">变形</span>
                    <span class="font-mono">{{ implant.形态变化 }}%</span>
                  </div>
                  <input
                    v-model.number="implant.形态变化"
                    type="range"
                    min="0"
                    max="100"
                    class="cyber-range w-full"
                    @input="playFeedback"
                  />
                </div>
              </div>

              <!-- Active Glow Effect -->
              <div
                class="pointer-events-none absolute inset-0 bg-[#00ccff]/5 opacity-0 transition-opacity duration-500"
                :class="{ 'opacity-100': implant.已激活 }"
              ></div>
            </div>
          </template>

          <div v-else class="flex h-full flex-col items-center justify-center py-10 text-[#00ccff]/40">
            <svg class="mb-2 h-12 w-12 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              ></path>
            </svg>
            <span class="text-xs tracking-widest">未检测到植入物</span>
          </div>
        </div>
      </section>

      <!-- Behavior Control -->
      <section class="grid h-16 grid-cols-4 gap-2">
        <button
          v-for="action in actions"
          :key="action.label"
          class="action-btn group flex flex-col items-center justify-center gap-1 rounded border border-[#00ccff]/30 bg-black/60 transition-all hover:bg-[#00ccff]/20 active:bg-[#00ccff]/40"
          @click="triggerAction(action.label)"
        >
          <span
            class="text-lg drop-shadow-[0_0_5px_rgba(0,204,255,0.5)] filter transition-transform duration-200 group-hover:scale-110"
            >{{ action.icon }}</span
          >
          <span class="text-[9px] tracking-tight opacity-80">{{ action.label }}</span>
        </button>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useDataStore, syncAllDataToLatest } from '../store';
import BackButton from '../components/common/BackButton.vue';
import { gsap } from 'gsap';
import { useDebounceFn } from '@vueuse/core';

const store = useDataStore();

// --- 防抖同步植入物变化到最新楼层 ---
const debouncedSync = useDebounceFn(() => {
  syncAllDataToLatest(store);
}, 500);

// 监听植入物变化
watch(
  () => currentImplants.value,
  () => {
    debouncedSync();
  },
  { deep: true },
);

// --- Constants ---
const targets = ['鹿忻', '鹿晴', '戎华', '林曦'] as const;
type TargetName = (typeof targets)[number];

const actions = [
  { icon: '🤚', label: '强制停止' },
  { icon: '💃', label: '强制姿势' },
  { icon: '👐', label: '强制张开' },
  { icon: '🧎', label: '强制跪下' },
];

// --- State ---
const selectedTarget = ref<TargetName>('鹿忻');
const zoomLevel = ref(1);
const detailMode = ref(false);
const signalStrength = ref(4);
const connectionStatus = ref('已连接');

// --- Computed ---
const currentImplants = computed(() => {
  const targetData = store.data[selectedTarget.value];
  if (!targetData || !('植入物' in targetData)) return {};
  return targetData.植入物;
});

// --- Methods ---
const setTarget = (target: TargetName) => {
  selectedTarget.value = target;
  // Reset signal animation
  signalStrength.value = 0;
  connectionStatus.value = '连接中...';
  setTimeout(() => {
    connectionStatus.value = '已连接';
    signalStrength.value = 5;
  }, 600);
};

const triggerAction = (label: string) => {
  // Visual feedback
  gsap.to('.action-btn', {
    y: 2,
    duration: 0.1,
    yoyo: true,
    repeat: 1,
    stagger: 0.05,
  });

  // Logic feedback (simulated)
  console.log(`Action triggered: ${label} for ${selectedTarget.value}`);
};

const playFeedback = () => {
  // Haptic feedback placeholder
  // if (navigator.vibrate) navigator.vibrate(5);
};

// --- Animations ---
let signalInterval: ReturnType<typeof setInterval>;

onMounted(() => {
  // Intro Animation
  const tl = gsap.timeline();
  tl.from('header', { y: -50, opacity: 0, duration: 0.5, ease: 'power2.out' })
    .from(
      '.panel-box',
      {
        x: -20,
        opacity: 0,
        duration: 0.4,
        stagger: 0.1,
        ease: 'power2.out',
      },
      '-=0.2',
    )
    .from(
      '.action-btn',
      {
        y: 20,
        opacity: 0,
        duration: 0.3,
        stagger: 0.05,
        ease: 'back.out(1.7)',
      },
      '-=0.2',
    );

  // Signal Simulation
  signalInterval = setInterval(() => {
    // Random fluctuation between 3 and 5
    signalStrength.value = Math.floor(Math.random() * 3) + 3;
  }, 2000);
});

onUnmounted(() => {
  clearInterval(signalInterval);
});

// --- Watchers ---
watch(selectedTarget, () => {
  // Animate list entrance
  gsap.fromTo(
    '.implant-card',
    { opacity: 0, x: 10 },
    { opacity: 1, x: 0, duration: 0.3, stagger: 0.05, ease: 'power2.out' },
  );
});
</script>

<style scoped lang="scss">
// Custom Scrollbar
.custom-scrollbar {
  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.3);
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(0, 204, 255, 0.3);
    border-radius: 2px;
    &:hover {
      background: rgba(0, 204, 255, 0.6);
    }
  }
}

// Panel Box Style
.panel-box {
  background: rgba(0, 20, 30, 0.6);
  border: 1px solid rgba(0, 204, 255, 0.2);
  border-radius: 8px;
  backdrop-filter: blur(5px);
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.5);
  transition: border-color 0.3s;

  &:hover {
    border-color: rgba(0, 204, 255, 0.4);
  }
}

// Target Button Active State
.target-btn.active {
  background: #00ccff;
  border-color: #00ccff;
  box-shadow: 0 0 15px rgba(0, 204, 255, 0.4);

  span {
    color: black;
    text-shadow: none;
  }
}

// Cyber Range Slider
.cyber-range {
  -webkit-appearance: none;
  background: rgba(0, 0, 0, 0.5);
  height: 4px;
  border-radius: 2px;
  outline: none;
  border: 1px solid rgba(0, 204, 255, 0.3);

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 12px;
    height: 12px;
    background: #000;
    border: 2px solid #00ccff;
    border-radius: 50%;
    box-shadow: 0 0 10px #00ccff;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      transform: scale(1.2);
      background: #00ccff;
    }
  }
}

// Cyber Switch
.cyber-switch {
  position: relative;
  display: inline-block;
  width: 36px;
  height: 18px;

  input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.8);
    border: 1px solid #444;
    border-radius: 18px;
    transition: 0.4s;

    &:before {
      position: absolute;
      content: '';
      height: 12px;
      width: 12px;
      left: 2px;
      bottom: 2px;
      background-color: #888;
      border-radius: 50%;
      transition: 0.4s;
    }
  }

  input:checked + .slider {
    background-color: rgba(0, 204, 255, 0.2);
    border-color: #00ccff;
    box-shadow: 0 0 10px rgba(0, 204, 255, 0.3);
  }

  input:checked + .slider:before {
    transform: translateX(18px);
    background-color: #00ccff;
    box-shadow: 0 0 8px #00ccff;
  }
}

// Text Utilities
.text-shadow-neon {
  text-shadow:
    0 0 5px rgba(0, 204, 255, 0.8),
    0 0 10px rgba(0, 204, 255, 0.4);
}

.text-shadow-small {
  text-shadow: 0 0 2px rgba(0, 204, 255, 0.6);
}

// Scanline Animation
@keyframes scan {
  0% {
    transform: translateY(-100%);
  }
  100% {
    transform: translateY(1000%);
  } // Move far down
}

.animate-scan {
  animation: scan 8s linear infinite;
}
</style>
