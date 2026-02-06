<template>
  <div
    class="settings-view relative flex min-h-screen w-full flex-col overflow-hidden bg-slate-900 font-sans text-white"
  >
    <!-- Background Effects -->
    <div class="pointer-events-none fixed inset-0 z-0">
      <div class="absolute top-0 left-0 h-full w-full bg-gradient-to-b from-purple-900/20 to-black/80"></div>
      <div class="absolute top-1/4 left-1/4 h-64 w-64 animate-pulse rounded-full bg-purple-600/20 blur-[100px]"></div>
      <div
        class="absolute right-1/4 bottom-1/4 h-64 w-64 animate-pulse rounded-full bg-pink-600/20 blur-[100px] delay-1000"
      ></div>
      <div class="scanlines absolute inset-0 opacity-5"></div>
    </div>

    <!-- Header -->
    <div class="relative z-10 flex items-center border-b border-white/10 bg-black/40 p-4 backdrop-blur-md">
      <BackButton />
      <h1
        class="neon-text ml-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-xl font-bold tracking-wider text-transparent"
      >
        系统设置
      </h1>
    </div>

    <!-- Content -->
    <div class="relative z-10 flex-1 space-y-6 overflow-y-auto p-4 pb-20">
      <!-- 1. Pregnancy Probability Control -->
      <section
        class="control-section group relative overflow-hidden rounded-xl border border-purple-500/30 bg-black/40 p-4 backdrop-blur-sm transition-colors hover:border-purple-500/60"
      >
        <div
          class="pointer-events-none absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100"
        ></div>

        <h2 class="mb-4 flex items-center text-sm font-bold text-purple-300">
          <span class="mr-2 h-4 w-1 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.8)]"></span>
          生命孕育协议 / GESTATION
        </h2>

        <div class="space-y-4">
          <!-- Target Selector -->
          <div class="flex items-center space-x-3">
            <span class="text-xs tracking-widest text-gray-400 uppercase">Target</span>
            <div class="relative flex-1">
              <select
                v-model="selectedPregnancyTarget"
                class="w-full appearance-none rounded border border-purple-500/30 bg-black/50 px-3 py-2 text-sm text-purple-100 transition-all focus:border-purple-400 focus:ring-1 focus:ring-purple-400/50 focus:outline-none"
              >
                <option v-for="name in pregnancyTargets" :key="name" :value="name">
                  {{ name }}
                </option>
              </select>
              <div class="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-xs text-purple-500">▼</div>
            </div>
          </div>

          <!-- Slider Control -->
          <div v-if="currentPregnancyTargetData" class="space-y-2">
            <div class="flex items-end justify-between">
              <span class="text-xs text-gray-400">Probability</span>
              <span class="font-mono text-2xl font-bold" :class="pregnancyRiskClass">
                {{ currentPregnancyTargetData.实时状态.怀孕概率 }}%
              </span>
            </div>

            <div class="relative flex h-6 items-center">
              <input
                v-model.number="currentPregnancyTargetData.实时状态.怀孕概率"
                type="range"
                min="0"
                max="100"
                step="1"
                class="cyber-range relative z-10 h-1 w-full cursor-pointer appearance-none rounded-lg bg-gray-700"
              />
              <!-- Progress Bar Visual -->
              <div
                class="pointer-events-none absolute top-1/2 left-0 h-1 -translate-y-1/2 rounded-l-lg bg-gradient-to-r from-purple-600 to-pink-500"
                :style="{ width: `${currentPregnancyTargetData.实时状态.怀孕概率}%` }"
              ></div>
            </div>

            <!-- Risk Warning -->
            <div
              v-if="currentPregnancyTargetData.实时状态.怀孕概率 > 50"
              class="flex animate-pulse items-center space-x-2 rounded border border-red-500/30 bg-red-900/20 p-2 text-xs text-red-400"
            >
              <i class="fas fa-exclamation-triangle"></i>
              <span>警告：高风险设定可能导致不可逆的生理改变</span>
            </div>
          </div>
        </div>
      </section>

      <!-- 2. Revive Function -->
      <section
        class="control-section group relative overflow-hidden rounded-xl border border-green-500/30 bg-black/40 p-4 backdrop-blur-sm transition-colors hover:border-green-500/60"
      >
        <h2 class="mb-4 flex items-center text-sm font-bold text-green-300">
          <span class="mr-2 h-4 w-1 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]"></span>
          生命重构 / REVIVAL
        </h2>

        <div v-if="deadCharacters.length === 0" class="py-4 text-center text-sm text-gray-500">
          <i class="fas fa-check-circle mb-2 block text-xl text-green-500/50"></i>
          所有生命体征正常
        </div>

        <div v-else class="space-y-3">
          <div
            v-for="charName in deadCharacters"
            :key="charName"
            class="flex items-center justify-between rounded-lg border border-red-500/30 bg-red-900/10 p-3"
          >
            <div class="flex items-center space-x-3">
              <div class="h-2 w-2 animate-ping rounded-full bg-red-500"></div>
              <span class="font-bold text-red-200">{{ charName }}</span>
              <span class="rounded bg-red-900/30 px-1 text-xs text-red-400">危急</span>
            </div>

            <button
              class="flex items-center space-x-1 rounded border border-green-500/50 bg-green-600/20 px-3 py-1.5 text-xs text-green-300 transition-all hover:bg-green-600/40 hover:shadow-[0_0_10px_rgba(34,197,94,0.3)] active:scale-95"
              @click="startRevive(charName)"
            >
              <i class="fas fa-play text-[10px]"></i>
              <span>重构序列 (AD)</span>
            </button>
          </div>
        </div>
      </section>

      <!-- 3. Quick Toggles -->
      <section
        class="control-section group relative overflow-hidden rounded-xl border border-cyan-500/30 bg-black/40 p-4 backdrop-blur-sm transition-colors hover:border-cyan-500/60"
      >
        <h2 class="mb-4 flex items-center text-sm font-bold text-cyan-300">
          <span class="mr-2 h-4 w-1 rounded-full bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.8)]"></span>
          核心功能 / KERNEL
        </h2>

        <div v-if="store.data.林海.手机功能" class="space-y-4">
          <div class="group/item flex items-center justify-between">
            <div class="flex flex-col">
              <span class="text-sm text-cyan-100">X-Ray 透视</span>
              <span class="text-[10px] tracking-wider text-cyan-500/70 uppercase">Visual Penetration</span>
            </div>
            <label class="relative inline-flex cursor-pointer items-center">
              <input v-model="store.data.林海.手机功能.透视开启" type="checkbox" class="peer sr-only" />
              <div
                class="peer h-6 w-11 rounded-full bg-gray-700 shadow-[0_0_5px_rgba(0,0,0,0.5)] peer-checked:bg-cyan-600 peer-focus:outline-none after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-white"
              ></div>
            </label>
          </div>

          <div class="group/item flex items-center justify-between">
            <div class="flex flex-col">
              <span class="text-sm text-pink-100">身体柔韧化</span>
              <span class="text-[10px] tracking-wider text-pink-500/70 uppercase">Soft Body Physics</span>
            </div>
            <label class="relative inline-flex cursor-pointer items-center">
              <input v-model="store.data.林海.手机功能.身体柔韧化开启" type="checkbox" class="peer sr-only" />
              <div
                class="peer h-6 w-11 rounded-full bg-gray-700 shadow-[0_0_5px_rgba(0,0,0,0.5)] peer-checked:bg-pink-600 peer-focus:outline-none after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-white"
              ></div>
            </label>
          </div>

          <div class="group/item flex items-center justify-between">
            <div class="flex flex-col">
              <span class="text-sm text-purple-100">远程操控</span>
              <span class="text-[10px] tracking-wider text-purple-500/70 uppercase">Remote Override</span>
            </div>
            <label class="relative inline-flex cursor-pointer items-center">
              <input v-model="store.data.林海.手机功能.远程操控开启" type="checkbox" class="peer sr-only" />
              <div
                class="peer h-6 w-11 rounded-full bg-gray-700 shadow-[0_0_5px_rgba(0,0,0,0.5)] peer-checked:bg-purple-600 peer-focus:outline-none after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-white"
              ></div>
            </label>
          </div>
        </div>
      </section>
    </div>

    <!-- Ad / Revive Overlay -->
    <div
      v-if="isWatchingAd"
      class="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90 p-6 text-center backdrop-blur-xl"
    >
      <div
        class="absolute inset-0 bg-repeat opacity-10"
        style="
          background-image: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9IiMzMzMiLz48L3N2Zz4=');
        "
      ></div>

      <div class="relative mb-8">
        <div class="relative flex h-32 w-32 items-center justify-center rounded-full border-4 border-green-500/30">
          <svg class="absolute inset-0 h-full w-full -rotate-90 transform">
            <circle
              cx="64"
              cy="64"
              r="60"
              fill="none"
              stroke="currentColor"
              stroke-width="4"
              class="text-green-500"
              :stroke-dasharray="377"
              :stroke-dashoffset="377 - (377 * (30 - countdown)) / 30"
              style="transition: stroke-dashoffset 1s linear"
            />
          </svg>
          <span class="revive-countdown font-mono text-4xl font-bold text-green-400">{{ countdown }}</span>
        </div>
        <div
          class="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-black px-2 text-xs tracking-widest whitespace-nowrap text-green-500/70"
        >
          重构中
        </div>
      </div>

      <h3 class="mb-2 text-xl font-bold text-white">正在重构生命序列...</h3>
      <p class="mb-8 max-w-xs text-sm text-gray-400">
        请勿关闭界面，正在从云端下载 {{ revivingChar }} 的备份意识数据。
      </p>

      <div class="h-1 w-full max-w-xs overflow-hidden rounded-full bg-gray-800">
        <div
          class="animate-progress h-full bg-green-500"
          :style="{ width: `${((30 - countdown) / 30) * 100}%`, transition: 'width 1s linear' }"
        ></div>
      </div>
    </div>

    <!-- Success Overlay -->
    <div
      v-if="reviveSuccess"
      class="pointer-events-none fixed inset-0 z-50 flex items-center justify-center bg-green-900/20 backdrop-blur-sm"
    >
      <div
        class="animate-bounce-in flex flex-col items-center rounded-2xl border border-green-500 bg-black/80 p-8 shadow-[0_0_50px_rgba(34,197,94,0.3)]"
      >
        <div class="mb-4 animate-pulse text-6xl text-green-500">
          <i class="fas fa-check-circle"></i>
        </div>
        <h3 class="mb-2 text-2xl font-bold text-white">复活成功</h3>
        <p class="text-green-300">生命体征已恢复正常</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onUnmounted, watch } from 'vue';
import { useDataStore, syncAllDataToLatest } from '@/善良温柔的恐虐神选与色孽手机/界面/手机/store';
import BackButton from '../components/common/BackButton.vue';
import { gsap } from 'gsap';
import { useDebounceFn } from '@vueuse/core';

// Store
const store = useDataStore();

// --- 防抖同步到最新楼层 ---
const debouncedSync = useDebounceFn(() => {
  syncAllDataToLatest(store);
}, 500);

// 监听怀孕概率变化
watch(
  () => {
    const name = selectedPregnancyTarget.value;
    if (name in store.data) {
      const data = store.data[name as keyof typeof store.data] as any;
      return data?.实时状态?.怀孕概率;
    }
    return undefined;
  },
  () => {
    debouncedSync();
  },
);

// 监听手机功能开关变化
watch(
  () => store.data.林海.手机功能,
  () => {
    syncAllDataToLatest(store);
  },
  { deep: true },
);

// --- Pregnancy Logic ---
const pregnancyTargets = ['鹿忻', '鹿晴', '戎华'];
const selectedPregnancyTarget = ref<string>('鹿忻');

// Helper to check if key exists in store.data to satisfy TS indexing
function isValidChar(name: string): name is keyof typeof store.data {
  return name in store.data;
}

const currentPregnancyTargetData = computed(() => {
  const name = selectedPregnancyTarget.value;
  if (isValidChar(name)) {
    // 强制断言为包含实时状态的角色对象
    // 注意：林海没有实时状态，所以这里 pregnancyTargets 列表必须只包含有实时状态的角色
    return store.data[name] as any;
  }
  return null;
});

const pregnancyRiskClass = computed(() => {
  const prob = currentPregnancyTargetData.value?.实时状态.怀孕概率 || 0;
  if (prob > 80) return 'text-red-500 text-shadow-red';
  if (prob > 50) return 'text-orange-500';
  return 'text-purple-400';
});

// --- Revive Logic ---
const isWatchingAd = ref(false);
const countdown = ref(30);
const revivingChar = ref('');
const reviveSuccess = ref(false);
let timer: ReturnType<typeof setInterval> | null = null;

const deadCharacters = computed(() => {
  const list: string[] = [];
  // 遍历 store.data 中除了林海/世界之外的拥有实时状态的角色
  const chars = ['鹿忻', '鹿晴', '戎华']; // 目前已知有实时状态的角色

  chars.forEach(name => {
    if (isValidChar(name)) {
      const charData = store.data[name] as any;
      if (charData?.实时状态?.是否死亡) {
        list.push(name);
      }
    }
  });

  return list;
});

const startRevive = (charName: string) => {
  if (timer) clearInterval(timer);

  revivingChar.value = charName;
  isWatchingAd.value = true;
  countdown.value = 30;

  timer = setInterval(() => {
    countdown.value--;

    // Animation tick (optional extra effects)
    if (countdown.value <= 10) {
      gsap.to('.revive-countdown', { scale: 1.2, duration: 0.1, yoyo: true, repeat: 1, color: '#ef4444' });
    }

    if (countdown.value <= 0) {
      completeRevive();
    }
  }, 1000);
};

const completeRevive = () => {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }

  const charName = revivingChar.value;
  if (isValidChar(charName)) {
    const charData = store.data[charName] as any;
    charData.实时状态.是否死亡 = false;
    charData.实时状态.高潮幅度 = 0;
    if (typeof charData.体力 === 'number') {
      charData.体力 = 50;
    }
  }

  // 同步数据到最新楼层
  syncAllDataToLatest(store);

  isWatchingAd.value = false;
  reviveSuccess.value = true;

  // Show success for 2 seconds then hide
  setTimeout(() => {
    reviveSuccess.value = false;
    revivingChar.value = '';
  }, 2000);
};

// Cleanup
onUnmounted(() => {
  if (timer) clearInterval(timer);
});

// --- Toggles are handled directly via v-model in template ---
</script>

<style scoped lang="scss">
.text-shadow-red {
  text-shadow: 0 0 10px rgba(239, 68, 68, 0.7);
}

.neon-text {
  text-shadow: 0 0 5px rgba(168, 85, 247, 0.5);
}

.cyber-range {
  -webkit-appearance: none;
  background: transparent;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    height: 20px;
    width: 20px;
    border-radius: 50%;
    background: #e879f9;
    cursor: pointer;
    margin-top: -8px; /* You need to specify a margin in Chrome, but in Firefox and IE it is automatic */
    box-shadow: 0 0 10px #e879f9;
    border: 2px solid #fff;
    position: relative;
    z-index: 20;
  }

  &::-webkit-slider-runnable-track {
    width: 100%;
    height: 4px;
    cursor: pointer;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 2px;
  }
}

.scanlines {
  background: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0),
    rgba(255, 255, 255, 0) 50%,
    rgba(0, 0, 0, 0.2) 50%,
    rgba(0, 0, 0, 0.2)
  );
  background-size: 100% 4px;
}

@keyframes progress {
  from {
    width: 0%;
  }
  to {
    width: 100%;
  }
}

.animate-bounce-in {
  animation: bounceIn 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

@keyframes bounceIn {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  60% {
    transform: scale(1.1);
    opacity: 1;
  }
  100% {
    transform: scale(1);
  }
}
</style>
