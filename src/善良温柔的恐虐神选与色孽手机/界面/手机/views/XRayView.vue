<template>
  <div class="view-container flex min-h-full w-full flex-col">
    <!-- Header with back button -->
    <header class="flex items-center gap-3 border-b border-white/5 bg-black/40 px-4 py-3 backdrop-blur-md">
      <BackButton />
      <h1 class="xray-glow text-lg font-bold tracking-wider">透视</h1>
      <div class="ml-auto flex items-center gap-2">
        <div class="xray-status-dot"></div>
        <span class="xray-glow-blue xray-flicker font-mono text-[10px]">深度扫描</span>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-1 overflow-auto p-3">
      <div class="xray-container xray-panel xray-scanline xray-grid xray-noise rounded-lg p-3">
        <!-- Target Selector -->
        <div class="xray-viewfinder mb-3 rounded p-2">
          <div class="xray-glow-blue mb-2 text-[10px] tracking-wider">选择目标</div>
          <div class="grid grid-cols-4 gap-2">
            <button
              v-for="name in targets"
              :key="name"
              class="xray-target-btn rounded px-1 py-2 text-xs font-bold transition-all"
              :class="{ active: selectedTarget === name }"
              @click="selectTarget(name)"
            >
              <div class="target-name">{{ name }}</div>
              <div class="mt-1 text-[8px] opacity-60">{{ getTargetType(name) }}</div>
            </button>
          </div>
        </div>

        <!-- Deep Scan Data (when target selected) -->
        <transition name="fade">
          <div v-if="selectedTarget && deepData" ref="dataOverlayRef" class="xray-data-overlay">
            <!-- HUD Bar -->
            <div class="xray-hud mb-2 flex items-center justify-between border-b border-green-900/50 pb-2">
              <span class="xray-glow text-sm font-bold">{{ selectedTarget }}</span>
              <span class="xray-glow-blue font-mono text-[10px]">深度扫描中</span>
            </div>

            <!-- Human Deep Physiology -->
            <template v-if="isHuman">
              <!-- Vital Signs Row -->
              <div class="mb-3">
                <div class="xray-glow-blue mb-2 text-[10px] tracking-wider">生命体征</div>
                <div class="grid grid-cols-3 gap-2">
                  <!-- Heart Rate -->
                  <div class="vital-card rounded p-2 text-center">
                    <div class="mb-1 text-[9px] text-gray-400">心率</div>
                    <div ref="heartRateRef" class="xray-glow font-mono text-lg font-bold">
                      {{ deepData.心跳 }}
                    </div>
                    <div class="text-[8px] text-gray-500">BPM</div>
                    <div class="heart-indicator mt-1" :class="getHeartClass(deepData.心跳)"></div>
                  </div>
                  <!-- Respiration -->
                  <div class="vital-card rounded p-2 text-center">
                    <div class="mb-1 text-[9px] text-gray-400">呼吸</div>
                    <div ref="respRef" class="xray-glow font-mono text-lg font-bold">
                      {{ deepData.呼吸频率 }}
                    </div>
                    <div class="text-[8px] text-gray-500">/min</div>
                  </div>
                  <!-- Temperature -->
                  <div class="vital-card rounded p-2 text-center">
                    <div class="mb-1 text-[9px] text-gray-400">体温</div>
                    <div ref="tempRef" class="font-mono text-lg font-bold" :class="getTempClass(deepData.体温)">
                      {{ deepData.体温.toFixed(1) }}
                    </div>
                    <div class="text-[8px] text-gray-500">°C</div>
                  </div>
                </div>
              </div>

              <!-- ECG Wave Animation -->
              <div class="ecg-container mb-3 overflow-hidden rounded">
                <svg ref="ecgSvgRef" class="ecg-wave" viewBox="0 0 200 40" preserveAspectRatio="none">
                  <path ref="ecgPathRef" class="ecg-path" d="M0,20 L200,20" fill="none" stroke-width="1.5" />
                </svg>
              </div>

              <!-- Hormone Levels -->
              <div class="mb-3">
                <div class="xray-glow-blue mb-2 text-[10px] tracking-wider">激素水平</div>
                <div class="grid grid-cols-2 gap-x-3 gap-y-1">
                  <div v-for="(val, key) in deepData.荷尔蒙" :key="key" class="hormone-row">
                    <div class="mb-1 flex items-center justify-between">
                      <span class="text-[9px] text-gray-400">{{ getHormoneLabel(key as string) }}</span>
                      <span class="xray-glow font-mono text-[10px]">{{ val }}</span>
                    </div>
                    <div class="h-1.5 overflow-hidden rounded border border-green-900/30 bg-black/50">
                      <div
                        :ref="(el: any) => setHormoneBarRef(key as string, el)"
                        class="hormone-bar h-full rounded"
                        :class="getHormoneClass(key as string)"
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Neural & Muscle Status -->
              <div class="mb-3 grid grid-cols-2 gap-3">
                <!-- Neural Response -->
                <div class="neural-card rounded p-2">
                  <div class="mb-1 text-[9px] text-gray-400">神经反应</div>
                  <div class="flex items-center gap-2">
                    <div class="h-2 flex-1 overflow-hidden rounded border border-cyan-900/30 bg-black/50">
                      <div
                        ref="neuralBarRef"
                        class="neural-bar h-full rounded"
                        :style="{ width: deepData.神经反应度 + '%' }"
                      ></div>
                    </div>
                    <span class="xray-glow-blue w-8 text-right font-mono text-[10px]">{{ deepData.神经反应度 }}</span>
                  </div>
                </div>
                <!-- Muscle Tension -->
                <div class="muscle-card rounded p-2">
                  <div class="mb-1 text-[9px] text-gray-400">肌肉紧张</div>
                  <div class="flex items-center gap-2">
                    <div class="h-2 flex-1 overflow-hidden rounded border border-yellow-900/30 bg-black/50">
                      <div
                        ref="muscleBarRef"
                        class="muscle-bar h-full rounded"
                        :style="{ width: deepData.肌肉紧张度 + '%' }"
                      ></div>
                    </div>
                    <span class="w-8 text-right font-mono text-[10px] text-yellow-400">{{ deepData.肌肉紧张度 }}</span>
                  </div>
                </div>
              </div>

              <!-- Pupil Dilation -->
              <div class="pupil-section mb-2 flex items-center justify-between rounded p-2">
                <div class="flex items-center gap-2">
                  <div class="pupil-icon" :style="{ '--pupil-size': (deepData.瞳孔扩张 / 100) * 0.6 + 0.2 }">
                    <div class="pupil-inner"></div>
                  </div>
                  <span class="text-[10px] text-gray-400">瞳孔扩张</span>
                </div>
                <span class="xray-glow-pink font-mono text-[11px]">{{ deepData.瞳孔扩张 }}%</span>
              </div>
            </template>

            <!-- Robot Deep Status -->
            <template v-else>
              <!-- System Status -->
              <div class="mb-3">
                <div class="xray-glow-blue mb-2 text-[10px] tracking-wider">系统状态</div>
                <div class="grid grid-cols-2 gap-2">
                  <!-- CPU Temp -->
                  <div class="sys-card rounded p-2">
                    <div class="mb-1 text-[9px] text-gray-400">CPU温度</div>
                    <div class="flex items-center justify-between">
                      <span class="font-mono text-lg font-bold" :class="getCpuTempClass(robotDeepData!.CPU温度)">
                        {{ robotDeepData!.CPU温度 }}°
                      </span>
                      <div class="cpu-indicator" :class="getCpuIndicatorClass(robotDeepData!.CPU温度)"></div>
                    </div>
                  </div>
                  <!-- Memory -->
                  <div class="sys-card rounded p-2">
                    <div class="mb-1 text-[9px] text-gray-400">内存</div>
                    <div class="flex items-center gap-2">
                      <div class="h-2 flex-1 overflow-hidden rounded border border-cyan-900/30 bg-black/50">
                        <div
                          ref="memoryBarRef"
                          class="memory-bar h-full rounded"
                          :style="{ width: robotDeepData!.内存占用 + '%' }"
                        ></div>
                      </div>
                      <span class="xray-glow-blue font-mono text-[10px]">{{ robotDeepData!.内存占用 }}%</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Emotion & Consciousness -->
              <div class="mb-3">
                <div class="xray-glow-blue mb-2 text-[10px] tracking-wider">情感核心</div>
                <div class="space-y-2">
                  <!-- Emotion Simulation -->
                  <div class="emo-row flex items-center gap-2">
                    <span class="w-20 text-[9px] text-gray-400">情感模拟</span>
                    <div class="h-2 flex-1 overflow-hidden rounded border border-pink-900/30 bg-black/50">
                      <div
                        ref="emotionBarRef"
                        class="emotion-bar h-full rounded"
                        :style="{ width: robotDeepData!.情感模拟强度 + '%' }"
                      ></div>
                    </div>
                    <span class="xray-glow-pink w-8 text-right font-mono text-[10px]">
                      {{ robotDeepData!.情感模拟强度 }}
                    </span>
                  </div>
                  <!-- Self-Awareness -->
                  <div class="emo-row flex items-center gap-2">
                    <span class="w-20 text-[9px] text-gray-400">自我意识</span>
                    <div class="h-2 flex-1 overflow-hidden rounded border border-purple-900/30 bg-black/50">
                      <div
                        ref="awarenessBarRef"
                        class="awareness-bar h-full rounded"
                        :style="{ width: robotDeepData!.自我意识指数 + '%' }"
                      ></div>
                    </div>
                    <span class="w-8 text-right font-mono text-[10px] text-purple-400">
                      {{ robotDeepData!.自我意识指数 }}
                    </span>
                  </div>
                  <!-- Overflow Risk -->
                  <div class="emo-row flex items-center gap-2">
                    <span class="w-20 text-[9px] text-gray-400">溢出风险</span>
                    <div class="h-2 flex-1 overflow-hidden rounded border border-red-900/30 bg-black/50">
                      <div
                        ref="overflowBarRef"
                        class="overflow-bar h-full rounded"
                        :style="{ width: robotDeepData!.情感溢出风险 + '%' }"
                      ></div>
                    </div>
                    <span
                      class="w-8 text-right font-mono text-[10px]"
                      :class="robotDeepData!.情感溢出风险 > 60 ? 'text-red-400' : 'text-orange-400'"
                    >
                      {{ robotDeepData!.情感溢出风险 }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Processing Latency -->
              <div class="latency-section flex items-center justify-between rounded p-2">
                <span class="text-[10px] text-gray-400">感知延迟</span>
                <div class="flex items-center gap-2">
                  <div class="latency-pulse" :class="getLatencyClass(robotDeepData!.感知处理延迟)"></div>
                  <span class="xray-glow font-mono text-[11px]">{{ robotDeepData!.感知处理延迟 }}ms</span>
                </div>
              </div>
            </template>
          </div>
        </transition>

        <!-- No Target Selected -->
        <div v-if="!selectedTarget" class="py-4 text-center">
          <div class="animate-pulse text-[10px] text-gray-500">[ 等待选择目标 ]</div>
        </div>

        <!-- Remote Control Section -->
        <div class="remote-control-section mt-3 border-t border-green-900/30 pt-3">
          <div class="mb-2 flex items-center justify-between">
            <div class="flex items-center gap-2">
              <div class="remote-status-dot" :class="{ active: isRemoteActive, locked: isTargetLocked }"></div>
              <span class="xray-glow-blue text-[10px] tracking-wider">远程链接</span>
            </div>
            <div class="font-mono text-[9px]" :class="getRemoteStatusClass()">
              {{ getRemoteStatusText() }}
            </div>
          </div>

          <!-- Remote Control Toggle -->
          <div class="mb-2 flex items-center gap-2">
            <button
              class="remote-toggle-btn flex-1 rounded px-3 py-2 text-xs font-bold transition-all"
              :class="{ active: isRemoteActive }"
              @click="toggleRemoteControl"
            >
              <span class="flex items-center justify-center gap-2">
                <svg class="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    v-if="isRemoteActive"
                    d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                  />
                  <path
                    v-else
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  />
                </svg>
                {{ isRemoteActive ? '链接激活' : '链接离线' }}
              </span>
            </button>
          </div>

          <!-- Target Lock (only when remote active and target selected) -->
          <transition name="fade">
            <div v-if="isRemoteActive && selectedTarget" class="target-lock-section">
              <div
                class="flex items-center justify-between rounded p-2"
                :class="isTargetLocked ? 'locked-bg' : 'unlocked-bg'"
              >
                <div class="flex items-center gap-2">
                  <div class="lock-icon" :class="{ locked: isTargetLocked }">
                    <svg v-if="isTargetLocked" class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fill-rule="evenodd"
                        d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                        clip-rule="evenodd"
                      />
                    </svg>
                    <svg v-else class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        d="M10 2a5 5 0 00-5 5v2a2 2 0 00-2 2v5a2 2 0 002 2h10a2 2 0 002-2v-5a2 2 0 00-2-2H7V7a3 3 0 015.905-.75 1 1 0 001.937-.5A5.002 5.002 0 0010 2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <div class="xray-glow text-[10px] font-bold">{{ selectedTarget }}</div>
                    <div class="text-[8px] text-gray-500">
                      {{ isTargetLocked ? '神经链接已锁定' : '准备锁定' }}
                    </div>
                  </div>
                </div>
                <button
                  class="lock-btn rounded px-3 py-1 text-[10px] font-bold transition-all"
                  :class="isTargetLocked ? 'unlock-btn' : 'lock-btn-active'"
                  @click="toggleTargetLock"
                >
                  {{ isTargetLocked ? '解锁' : '锁定' }}
                </button>
              </div>

              <!-- Signal Strength (when locked) -->
              <transition name="fade">
                <div v-if="isTargetLocked" class="signal-section mt-2 rounded p-2">
                  <div class="mb-1 flex items-center justify-between">
                    <span class="text-[9px] text-gray-400">信号强度</span>
                    <span class="xray-glow font-mono text-[10px]">{{ signalStrength }}%</span>
                  </div>
                  <div class="signal-bars flex gap-1">
                    <div
                      v-for="i in 5"
                      :key="i"
                      class="signal-bar"
                      :class="{ active: i <= Math.ceil(signalStrength / 20) }"
                    ></div>
                  </div>
                </div>
              </transition>
            </div>
          </transition>

          <!-- Remote not active hint -->
          <div v-if="!isRemoteActive" class="py-2 text-center">
            <div class="text-[9px] text-gray-600">[ 启用远程链接以锁定目标 ]</div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue';
import { useDataStore, syncAllDataToLatest } from '../store';
import BackButton from '../components/common/BackButton.vue';
import { gsap } from 'gsap';

const store = useDataStore();

const targets = ['鹿忻', '鹿晴', '戎华', '林曦'] as const;
type TargetName = (typeof targets)[number];

const selectedTarget = ref<TargetName | null>(null);
const dataOverlayRef = ref<HTMLElement | null>(null);
const hormoneBarRefs = ref<Map<string, HTMLElement>>(new Map());

// ECG animation refs
const ecgSvgRef = ref<SVGSVGElement | null>(null);
const ecgPathRef = ref<SVGPathElement | null>(null);
let ecgAnimationId: number | null = null;

// Other refs
const heartRateRef = ref<HTMLElement | null>(null);
const neuralBarRef = ref<HTMLElement | null>(null);
const muscleBarRef = ref<HTMLElement | null>(null);
const memoryBarRef = ref<HTMLElement | null>(null);
const emotionBarRef = ref<HTMLElement | null>(null);
const awarenessBarRef = ref<HTMLElement | null>(null);
const overflowBarRef = ref<HTMLElement | null>(null);

// Computed: Is human target
const isHuman = computed(() => selectedTarget.value !== '林曦');

// Remote control state
const isRemoteActive = computed(() => store.data.林海.手机功能.远程操控开启);
const lockedTarget = ref<TargetName | null>(null);
const isTargetLocked = computed(() => lockedTarget.value === selectedTarget.value && selectedTarget.value !== null);
const signalStrength = ref(85);

// Signal strength simulation
let signalInterval: ReturnType<typeof setInterval> | null = null;

// Computed: Get deep physiology data for human characters
const deepData = computed(() => {
  if (!selectedTarget.value) return null;
  const char = store.data[selectedTarget.value];
  if ('深层生理' in char) {
    return char.深层生理;
  }
  return null;
});

// Computed: Get deep status for robot
const robotDeepData = computed(() => {
  if (selectedTarget.value !== '林曦') return null;
  return store.data.林曦.深层状态;
});

// Target selection
const selectTarget = (name: TargetName) => {
  const wasSelected = selectedTarget.value === name;
  selectedTarget.value = wasSelected ? null : name;

  if (!wasSelected) {
    nextTick(() => {
      animateDataOverlayIn();
      if (isHuman.value) {
        startEcgAnimation();
      }
    });
  } else {
    stopEcgAnimation();
  }
};

// Data panel entrance animation
const animateDataOverlayIn = () => {
  if (!dataOverlayRef.value) return;

  const tl = gsap.timeline();

  tl.fromTo(
    dataOverlayRef.value,
    { opacity: 0, y: -10, scale: 0.98 },
    { opacity: 1, y: 0, scale: 1, duration: 0.3, ease: 'power2.out' },
  );

  // Animate hormone bars
  nextTick(() => {
    if (isHuman.value && deepData.value?.荷尔蒙) {
      hormoneBarRefs.value.forEach((el, key) => {
        const val = deepData.value?.荷尔蒙?.[key as keyof typeof deepData.value.荷尔蒙] ?? 0;
        gsap.fromTo(
          el,
          { width: '0%' },
          { width: `${Math.min(val, 100)}%`, duration: 0.6, delay: 0.1, ease: 'power2.out' },
        );
      });
    }
  });
};

// ECG wave animation
const startEcgAnimation = () => {
  if (!ecgPathRef.value || !deepData.value) return;

  let offset = 0;
  const bpm = deepData.value.心跳;
  const speed = Math.max(0.5, Math.min(3, bpm / 60)); // Adjust speed based on heart rate

  const animate = () => {
    offset += speed;
    if (offset > 200) offset = 0;

    // Generate ECG-like wave pattern
    const points: string[] = [];
    for (let x = 0; x <= 200; x += 2) {
      const relX = (x + offset) % 40;
      let y = 20;

      // ECG spike pattern
      if (relX > 15 && relX < 17) y = 8;
      else if (relX > 17 && relX < 19) y = 35;
      else if (relX > 19 && relX < 21) y = 12;
      else if (relX > 21 && relX < 23) y = 20;

      points.push(`${x},${y}`);
    }

    if (ecgPathRef.value) {
      ecgPathRef.value.setAttribute('d', `M${points.join(' L')}`);
    }

    ecgAnimationId = requestAnimationFrame(animate);
  };

  animate();
};

const stopEcgAnimation = () => {
  if (ecgAnimationId !== null) {
    cancelAnimationFrame(ecgAnimationId);
    ecgAnimationId = null;
  }
};

// Watch for data changes
watch(
  () => deepData.value,
  (newData, oldData) => {
    if (!newData || !oldData) return;

    // Update hormone bars on change
    if (newData.荷尔蒙) {
      Object.entries(newData.荷尔蒙).forEach(([key, newVal]) => {
        const oldVal = oldData.荷尔蒙?.[key as keyof typeof oldData.荷尔蒙] ?? 0;
        const barEl = hormoneBarRefs.value.get(key);
        if (barEl && newVal !== oldVal) {
          gsap.to(barEl, { width: `${Math.min(newVal, 100)}%`, duration: 0.4, ease: 'power2.out' });
          gsap.fromTo(
            barEl,
            { boxShadow: '0 0 15px currentColor' },
            { boxShadow: '0 0 5px currentColor', duration: 0.3 },
          );
        }
      });
    }

    // Heart rate change flash
    if (newData.心跳 !== oldData.心跳 && heartRateRef.value) {
      gsap.fromTo(
        heartRateRef.value,
        { scale: 1.2, textShadow: '0 0 20px var(--xray-primary)' },
        { scale: 1, textShadow: '0 0 10px var(--xray-primary)', duration: 0.3 },
      );
    }
  },
  { deep: true },
);

// Ref setters
const setHormoneBarRef = (key: string, el: HTMLElement | null) => {
  if (el) hormoneBarRefs.value.set(key, el);
};

// Mount animation
onMounted(() => {
  gsap.fromTo('.xray-container', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' });
});

onUnmounted(() => {
  stopEcgAnimation();
  stopSignalSimulation();
});

// Helper functions
const getTargetType = (name: TargetName) => {
  if (name === '林曦') return '机器人';
  if (name === '戎华') return '星灵';
  return '人类';
};

const getHeartClass = (bpm: number) => {
  if (bpm > 100) return 'heart-fast';
  if (bpm < 60) return 'heart-slow';
  return 'heart-normal';
};

const getTempClass = (temp: number) => {
  if (temp > 37.5) return 'text-red-400';
  if (temp < 36) return 'text-cyan-400';
  return 'xray-glow';
};

const getHormoneLabel = (key: string) => {
  const labels: Record<string, string> = {
    多巴胺: '多巴胺',
    内啡肽: '内啡肽',
    肾上腺素: '肾上腺素',
    催产素: '催产素',
  };
  return labels[key] || key;
};

const getHormoneClass = (key: string) => {
  const classes: Record<string, string> = {
    多巴胺: 'hormone-dopamine',
    内啡肽: 'hormone-endorphin',
    肾上腺素: 'hormone-adrenaline',
    催产素: 'hormone-oxytocin',
  };
  return classes[key] || '';
};

const getCpuTempClass = (temp: number) => {
  if (temp > 70) return 'text-red-400';
  if (temp > 55) return 'text-yellow-400';
  return 'xray-glow';
};

const getCpuIndicatorClass = (temp: number) => {
  if (temp > 70) return 'cpu-hot';
  if (temp > 55) return 'cpu-warm';
  return 'cpu-normal';
};

const getLatencyClass = (ms: number) => {
  if (ms > 20) return 'latency-high';
  if (ms > 10) return 'latency-medium';
  return 'latency-low';
};

// Remote control functions
const toggleRemoteControl = () => {
  store.data.林海.手机功能.远程操控开启 = !store.data.林海.手机功能.远程操控开启;

  // 同步到最新楼层
  syncAllDataToLatest(store);

  if (!store.data.林海.手机功能.远程操控开启) {
    // Reset lock when disabling remote
    lockedTarget.value = null;
    stopSignalSimulation();
  }
};

const toggleTargetLock = () => {
  if (!selectedTarget.value || !isRemoteActive.value) return;

  if (isTargetLocked.value) {
    // Unlock
    lockedTarget.value = null;
    stopSignalSimulation();
  } else {
    // Lock to current target
    lockedTarget.value = selectedTarget.value;
    startSignalSimulation();

    // Animate lock
    nextTick(() => {
      gsap.fromTo(
        '.target-lock-section',
        { scale: 0.95, opacity: 0.8 },
        { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(1.5)' },
      );
    });
  }
};

const startSignalSimulation = () => {
  stopSignalSimulation();
  signalInterval = setInterval(() => {
    // Simulate signal fluctuation
    signalStrength.value = Math.max(60, Math.min(100, signalStrength.value + (Math.random() - 0.5) * 10));
  }, 1000);
};

const stopSignalSimulation = () => {
  if (signalInterval) {
    clearInterval(signalInterval);
    signalInterval = null;
  }
};

const getRemoteStatusClass = () => {
  if (!isRemoteActive.value) return 'text-gray-500';
  if (isTargetLocked.value) return 'xray-glow-pink';
  return 'xray-glow';
};

const getRemoteStatusText = () => {
  if (!isRemoteActive.value) return '离线';
  if (isTargetLocked.value) return `已锁定: ${lockedTarget.value}`;
  return '待机';
};
</script>

<style scoped lang="scss">
.xray-container {
  min-height: 120px;
}

.xray-header {
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(0, 255, 136, 0.2);
}

// Vital cards
.vital-card {
  background: rgba(0, 20, 15, 0.6);
  border: 1px solid rgba(0, 255, 136, 0.2);
}

.heart-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin: 0 auto;

  &.heart-normal {
    background: var(--xray-primary);
    animation: heart-pulse 1s ease-in-out infinite;
  }

  &.heart-fast {
    background: #ff6b6b;
    animation: heart-pulse 0.5s ease-in-out infinite;
  }

  &.heart-slow {
    background: #00ccff;
    animation: heart-pulse 1.5s ease-in-out infinite;
  }
}

@keyframes heart-pulse {
  0%,
  100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.3);
    opacity: 0.7;
  }
}

// ECG wave
.ecg-container {
  height: 40px;
  background: rgba(0, 10, 8, 0.8);
  border: 1px solid rgba(0, 255, 136, 0.2);
}

.ecg-wave {
  width: 100%;
  height: 100%;
}

.ecg-path {
  stroke: var(--xray-primary);
  filter: drop-shadow(0 0 3px var(--xray-primary));
}

// Hormone bars
.hormone-bar {
  transition: width 0.4s ease-out;

  &.hormone-dopamine {
    background: linear-gradient(90deg, #ff0066 0%, rgba(255, 0, 102, 0.3) 100%);
    box-shadow: 0 0 8px #ff0066;
  }

  &.hormone-endorphin {
    background: linear-gradient(90deg, #00ff88 0%, rgba(0, 255, 136, 0.3) 100%);
    box-shadow: 0 0 8px #00ff88;
  }

  &.hormone-adrenaline {
    background: linear-gradient(90deg, #ffaa00 0%, rgba(255, 170, 0, 0.3) 100%);
    box-shadow: 0 0 8px #ffaa00;
  }

  &.hormone-oxytocin {
    background: linear-gradient(90deg, #ff66cc 0%, rgba(255, 102, 204, 0.3) 100%);
    box-shadow: 0 0 8px #ff66cc;
  }
}

// Neural & Muscle bars
.neural-card,
.muscle-card {
  background: rgba(0, 20, 15, 0.4);
  border: 1px solid rgba(0, 255, 136, 0.15);
}

.neural-bar {
  background: linear-gradient(90deg, #00ccff 0%, rgba(0, 204, 255, 0.3) 100%);
  box-shadow: 0 0 6px #00ccff;
}

.muscle-bar {
  background: linear-gradient(90deg, #ffaa00 0%, rgba(255, 170, 0, 0.3) 100%);
  box-shadow: 0 0 6px #ffaa00;
}

// Pupil indicator
.pupil-section {
  background: rgba(0, 20, 15, 0.4);
  border: 1px solid rgba(255, 0, 102, 0.2);
}

.pupil-icon {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: radial-gradient(circle, #4a6fa5 0%, #2d4a6a 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #1a1a2e;
}

.pupil-inner {
  width: calc(var(--pupil-size) * 20px);
  height: calc(var(--pupil-size) * 20px);
  border-radius: 50%;
  background: #000;
  box-shadow: 0 0 3px rgba(0, 0, 0, 0.8);
}

// Robot system cards
.sys-card {
  background: rgba(0, 20, 15, 0.6);
  border: 1px solid rgba(0, 204, 255, 0.2);
}

.cpu-indicator {
  width: 10px;
  height: 10px;
  border-radius: 2px;

  &.cpu-normal {
    background: var(--xray-primary);
    box-shadow: 0 0 6px var(--xray-primary);
  }

  &.cpu-warm {
    background: #ffaa00;
    box-shadow: 0 0 6px #ffaa00;
    animation: cpu-blink 1s ease-in-out infinite;
  }

  &.cpu-hot {
    background: #ff4444;
    box-shadow: 0 0 8px #ff4444;
    animation: cpu-blink 0.3s ease-in-out infinite;
  }
}

@keyframes cpu-blink {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

// Robot emotion bars
.memory-bar {
  background: linear-gradient(90deg, #00ccff 0%, rgba(0, 204, 255, 0.3) 100%);
  box-shadow: 0 0 6px #00ccff;
}

.emotion-bar {
  background: linear-gradient(90deg, #ff0066 0%, rgba(255, 0, 102, 0.3) 100%);
  box-shadow: 0 0 6px #ff0066;
}

.awareness-bar {
  background: linear-gradient(90deg, #aa66ff 0%, rgba(170, 102, 255, 0.3) 100%);
  box-shadow: 0 0 6px #aa66ff;
}

.overflow-bar {
  background: linear-gradient(90deg, #ff4444 0%, rgba(255, 68, 68, 0.3) 100%);
  box-shadow: 0 0 6px #ff4444;
}

// Latency indicator
.latency-section {
  background: rgba(0, 20, 15, 0.4);
  border: 1px solid rgba(0, 255, 136, 0.15);
}

.latency-pulse {
  width: 8px;
  height: 8px;
  border-radius: 50%;

  &.latency-low {
    background: var(--xray-primary);
    box-shadow: 0 0 6px var(--xray-primary);
  }

  &.latency-medium {
    background: #ffaa00;
    box-shadow: 0 0 6px #ffaa00;
  }

  &.latency-high {
    background: #ff4444;
    box-shadow: 0 0 6px #ff4444;
    animation: latency-pulse 0.5s ease-in-out infinite;
  }
}

@keyframes latency-pulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.3);
  }
}

// Transitions
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.target-name {
  white-space: nowrap;
}

// Remote Control Section
.remote-control-section {
  background: rgba(0, 10, 8, 0.4);
  border-radius: 6px;
  padding: 10px;
  margin-top: 12px;
}

.remote-status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #444;
  transition: all 0.3s ease;

  &.active {
    background: var(--xray-primary);
    box-shadow: 0 0 8px var(--xray-primary);
    animation: pulse-glow 2s ease-in-out infinite;
  }

  &.locked {
    background: var(--xray-accent);
    box-shadow: 0 0 10px var(--xray-accent);
    animation: pulse-glow-pink 1s ease-in-out infinite;
  }
}

@keyframes pulse-glow {
  0%,
  100% {
    box-shadow: 0 0 8px var(--xray-primary);
  }
  50% {
    box-shadow: 0 0 15px var(--xray-primary);
  }
}

@keyframes pulse-glow-pink {
  0%,
  100% {
    box-shadow: 0 0 8px var(--xray-accent);
  }
  50% {
    box-shadow: 0 0 15px var(--xray-accent);
  }
}

.remote-toggle-btn {
  background: rgba(0, 40, 30, 0.6);
  border: 1px solid rgba(100, 100, 100, 0.3);
  color: #666;
  cursor: pointer;

  &:hover {
    border-color: rgba(0, 255, 136, 0.3);
    color: #888;
  }

  &.active {
    background: rgba(0, 255, 136, 0.1);
    border-color: var(--xray-primary);
    color: var(--xray-primary);
    box-shadow: 0 0 10px rgba(0, 255, 136, 0.2);

    &:hover {
      background: rgba(0, 255, 136, 0.15);
    }
  }
}

.target-lock-section {
  margin-top: 8px;
}

.locked-bg {
  background: rgba(255, 0, 102, 0.1);
  border: 1px solid rgba(255, 0, 102, 0.3);
}

.unlocked-bg {
  background: rgba(0, 40, 30, 0.4);
  border: 1px solid rgba(0, 255, 136, 0.2);
}

.lock-icon {
  color: var(--xray-primary);
  transition: all 0.3s ease;

  &.locked {
    color: var(--xray-accent);
    animation: lock-pulse 1.5s ease-in-out infinite;
  }
}

@keyframes lock-pulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

.lock-btn-active {
  background: rgba(0, 255, 136, 0.2);
  border: 1px solid var(--xray-primary);
  color: var(--xray-primary);
  cursor: pointer;

  &:hover {
    background: rgba(0, 255, 136, 0.3);
    box-shadow: 0 0 8px rgba(0, 255, 136, 0.3);
  }
}

.unlock-btn {
  background: rgba(255, 0, 102, 0.2);
  border: 1px solid var(--xray-accent);
  color: var(--xray-accent);
  cursor: pointer;

  &:hover {
    background: rgba(255, 0, 102, 0.3);
    box-shadow: 0 0 8px rgba(255, 0, 102, 0.3);
  }
}

.signal-section {
  background: rgba(0, 20, 15, 0.5);
  border: 1px solid rgba(0, 255, 136, 0.15);
}

.signal-bars {
  height: 12px;
}

.signal-bar {
  flex: 1;
  height: 100%;
  background: rgba(50, 50, 50, 0.5);
  border-radius: 2px;
  transition: all 0.3s ease;

  &.active {
    background: var(--xray-primary);
    box-shadow: 0 0 4px var(--xray-primary);
  }

  &:nth-child(1) {
    height: 40%;
    align-self: flex-end;
  }
  &:nth-child(2) {
    height: 55%;
    align-self: flex-end;
  }
  &:nth-child(3) {
    height: 70%;
    align-self: flex-end;
  }
  &:nth-child(4) {
    height: 85%;
    align-self: flex-end;
  }
  &:nth-child(5) {
    height: 100%;
  }
}
</style>
