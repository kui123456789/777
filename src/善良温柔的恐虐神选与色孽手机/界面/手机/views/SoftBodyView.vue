<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue';
import { useDataStore, syncAllDataToLatest } from '../store';
import BackButton from '../components/common/BackButton.vue';
import { gsap } from 'gsap';
import type { StatData } from '@/善良温柔的恐虐神选与色孽手机/schema';
import { useDebounceFn } from '@vueuse/core';

const store = useDataStore();

// 类型定义
type HumanCharacter = '鹿忻' | '鹿晴' | '戎华';
type Character = HumanCharacter | '林曦';

// 角色列表
const characters: { name: Character; icon: string; isRobot: boolean }[] = [
  { name: '鹿忻', icon: '👧', isRobot: false },
  { name: '鹿晴', icon: '👩', isRobot: false },
  { name: '戎华', icon: '💃', isRobot: false },
  { name: '林曦', icon: '🤖', isRobot: true },
];

// 选中目标
const selectedTarget = ref<Character | null>(null);

// 全局功能开关
const globalEnabled = computed({
  get: () => store.data.林海.手机功能.身体柔韧化开启,
  set: v => (store.data.林海.手机功能.身体柔韧化开启 = v),
});

// 当前角色数据
const targetData = computed(() => {
  if (!selectedTarget.value) return null;
  return store.data[selectedTarget.value as keyof StatData] as any;
});

// 身体柔韧化状态
const softBodyState = computed(() => {
  return targetData.value?.身体柔韧化;
});

// 开发度数据 (仅人类)
const developmentData = computed(() => {
  if (!selectedTarget.value || selectedTarget.value === '林曦') return null;
  return targetData.value?.开发度;
});

// 选择目标
const selectTarget = (name: Character) => {
  selectedTarget.value = selectedTarget.value === name ? null : name;
};

// 动画 - 仅在控制面板存在时执行
watch([() => selectedTarget.value, () => softBodyState.value], async ([target, state]) => {
  if (target && state) {
    await nextTick();
    const panel = document.querySelector('.control-panel');
    const items = document.querySelectorAll('.stagger-item');
    if (panel) {
      gsap.from(panel, {
        y: 50,
        opacity: 0,
        duration: 0.5,
        ease: 'back.out(1.2)',
      });
    }
    if (items.length > 0) {
      gsap.from(items, {
        y: 20,
        opacity: 0,
        duration: 0.4,
        stagger: 0.1,
        delay: 0.2,
        ease: 'power2.out',
      });
    }
  }
});

// 防抖同步，避免滑块拖动时频繁调用
const debouncedSync = useDebounceFn(() => {
  syncAllDataToLatest(store);
}, 500);

// 监听全局开关变化
watch(globalEnabled, () => {
  syncAllDataToLatest(store);
});

// 监听身体柔韧化状态变化（深层监听）
watch(
  () => softBodyState.value,
  () => {
    debouncedSync();
  },
  { deep: true },
);

// 颜色工具函数
const getProgressColor = (val: number) => {
  if (val >= 70) return 'bg-[#f72585] shadow-[0_0_10px_#f72585]';
  if (val >= 30) return 'bg-[#ffca3a] shadow-[0_0_10px_#ffca3a]';
  return 'bg-[#4cc9f0] shadow-[0_0_10px_#4cc9f0]';
};

const getValueColor = (val: number) => {
  if (val >= 70) return 'text-[#f72585]';
  if (val >= 30) return 'text-[#ffca3a]';
  return 'text-[#4cc9f0]';
};
</script>

<template>
  <div class="soft-body-view flex min-h-full w-full flex-col overflow-hidden bg-black text-white">
    <!-- Header -->
    <header class="z-20 flex items-center gap-3 border-b border-[#f72585]/30 bg-black/40 px-4 py-3 backdrop-blur-md">
      <BackButton />
      <div class="flex flex-1 items-center gap-2">
        <span class="animate-pulse-slow text-2xl">🧬</span>
        <h1
          class="bg-gradient-to-r from-[#ff6b35] to-[#f72585] bg-clip-text text-lg font-bold tracking-wider text-transparent"
        >
          身体柔韧化
        </h1>
      </div>

      <!-- 全局开关 -->
      <div class="flex items-center gap-2">
        <span class="text-xs text-white/50">系统</span>
        <button
          class="relative h-5 w-10 rounded-full transition-colors duration-300"
          :class="globalEnabled ? 'bg-[#f72585]' : 'bg-gray-700'"
          @click="globalEnabled = !globalEnabled"
        >
          <div
            class="absolute top-1 h-3 w-3 rounded-full bg-white shadow-sm transition-all duration-300"
            :class="globalEnabled ? 'left-6' : 'left-1'"
          ></div>
        </button>
      </div>
    </header>

    <main class="scrollbar-hide relative z-10 flex-1 overflow-y-auto p-4">
      <!-- 目标选择 -->
      <section class="mb-6">
        <h2 class="mb-3 text-xs font-bold tracking-wider text-[#ff6b35]/70 uppercase">目标选择</h2>
        <div class="grid grid-cols-4 gap-3">
          <button
            v-for="char in characters"
            :key="char.name"
            class="group relative overflow-hidden rounded-xl border p-3 transition-all duration-300"
            :class="[
              selectedTarget === char.name
                ? 'border-[#f72585] bg-[#f72585]/20 shadow-[0_0_15px_rgba(247,37,133,0.4)]'
                : 'border-white/10 bg-black/40 hover:border-[#ff6b35]/50 hover:bg-[#ff6b35]/10',
            ]"
            @click="selectTarget(char.name)"
          >
            <div class="mb-1 text-center text-3xl drop-shadow-[0_0_5px_rgba(255,255,255,0.3)] filter">
              {{ char.icon }}
            </div>
            <p
              class="text-center text-xs font-medium transition-colors"
              :class="selectedTarget === char.name ? 'text-[#ff9e00]' : 'text-gray-400 group-hover:text-white'"
            >
              {{ char.name }}
            </p>

            <!-- 机器人标记 -->
            <div v-if="char.isRobot" class="absolute top-1 right-1 text-[10px] text-cyan-400">⚡</div>

            <!-- 选中时的扫描线效果 -->
            <div v-if="selectedTarget === char.name" class="scan-line"></div>
          </button>
        </div>
      </section>

      <!-- 控制面板 -->
      <section v-if="selectedTarget && softBodyState" class="control-panel space-y-6 pb-20">
        <!-- 主控制卡片 -->
        <div class="glass-card relative overflow-hidden rounded-2xl border border-[#ff6b35]/30 p-4">
          <div class="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-[#ff6b35]/10 blur-2xl"></div>

          <div class="stagger-item mb-6 flex items-center justify-between">
            <div class="flex flex-col">
              <span class="text-sm font-bold text-white">柔韧化改造</span>
              <span class="text-xs text-white/50">改造状态</span>
            </div>
            <button
              class="flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-bold transition-all duration-300"
              :class="[
                softBodyState.启用
                  ? 'border-[#f72585] bg-[#f72585]/20 text-[#f72585] shadow-[0_0_10px_rgba(247,37,133,0.3)]'
                  : 'border-gray-600 bg-black/40 text-gray-500',
              ]"
              @click="softBodyState.启用 = !softBodyState.启用"
            >
              <span
                class="h-1.5 w-1.5 rounded-full"
                :class="softBodyState.启用 ? 'animate-pulse bg-[#f72585]' : 'bg-gray-500'"
              ></span>
              {{ softBodyState.启用 ? '激活' : '未激活' }}
            </button>
          </div>

          <!-- 参数滑块 -->
          <div class="space-y-5">
            <!-- 关节柔韧度 -->
            <div class="stagger-item">
              <div class="mb-2 flex justify-between text-xs">
                <span class="text-gray-300">关节柔韧度</span>
                <span class="font-mono" :class="getValueColor(softBodyState.关节柔韧度)"
                  >{{ softBodyState.关节柔韧度 }}%</span
                >
              </div>
              <input
                v-model.number="softBodyState.关节柔韧度"
                type="range"
                class="cyber-range w-full"
                :style="{ '--thumb-color': '#4cc9f0' }"
              />
            </div>

            <!-- 软组织强韧度 -->
            <div class="stagger-item">
              <div class="mb-2 flex justify-between text-xs">
                <span class="text-gray-300">软组织强韧度</span>
                <span class="font-mono" :class="getValueColor(softBodyState.软组织强韧度)"
                  >{{ softBodyState.软组织强韧度 }}%</span
                >
              </div>
              <input
                v-model.number="softBodyState.软组织强韧度"
                type="range"
                class="cyber-range w-full"
                :style="{ '--thumb-color': '#f72585' }"
              />
            </div>

            <!-- 回弹速度 -->
            <div class="stagger-item">
              <div class="mb-2 flex justify-between text-xs">
                <span class="text-gray-300">回弹速度</span>
                <span class="font-mono" :class="getValueColor(softBodyState.回弹速度)"
                  >{{ softBodyState.回弹速度 }}ms</span
                >
              </div>
              <input
                v-model.number="softBodyState.回弹速度"
                type="range"
                class="cyber-range w-full"
                :style="{ '--thumb-color': '#ffca3a' }"
              />
            </div>

            <!-- 痛感转化率 -->
            <div class="stagger-item">
              <div class="mb-2 flex justify-between text-xs">
                <span class="text-gray-300">痛感转化率</span>
                <span class="font-mono" :class="getValueColor(softBodyState.痛感转化率)"
                  >{{ softBodyState.痛感转化率 }}%</span
                >
              </div>
              <input
                v-model.number="softBodyState.痛感转化率"
                type="range"
                class="cyber-range w-full"
                :style="{ '--thumb-color': '#7209b7' }"
              />
            </div>
          </div>
        </div>

        <!-- 开发度面板 -->
        <div
          v-if="developmentData"
          class="glass-card stagger-item relative overflow-hidden rounded-2xl border border-[#4cc9f0]/20 p-4"
        >
          <h3 class="mb-4 flex items-center gap-2 text-xs font-bold tracking-wider text-[#4cc9f0]/70 uppercase">
            <span class="h-4 w-1 bg-[#4cc9f0]"></span>
            生理开发
          </h3>

          <div class="grid grid-cols-2 gap-4">
            <!-- 阴道 -->
            <div class="rounded-lg border border-white/5 bg-black/30 p-3">
              <div class="mb-2 text-xs text-gray-400">阴道开发</div>
              <div class="mb-1 h-1.5 overflow-hidden rounded-full bg-gray-700">
                <div
                  class="h-full transition-all duration-500"
                  :class="getProgressColor(developmentData.阴道开发度)"
                  :style="{ width: developmentData.阴道开发度 + '%' }"
                ></div>
              </div>
              <div class="text-right font-mono text-[10px] text-white/70">{{ developmentData.阴道开发度 }}%</div>
            </div>

            <!-- 肛门 -->
            <div class="rounded-lg border border-white/5 bg-black/30 p-3">
              <div class="mb-2 text-xs text-gray-400">肛门开发</div>
              <div class="mb-1 h-1.5 overflow-hidden rounded-full bg-gray-700">
                <div
                  class="h-full transition-all duration-500"
                  :class="getProgressColor(developmentData.肛门开发度)"
                  :style="{ width: developmentData.肛门开发度 + '%' }"
                ></div>
              </div>
              <div class="text-right font-mono text-[10px] text-white/70">{{ developmentData.肛门开发度 }}%</div>
            </div>

            <!-- 乳孔 -->
            <div class="rounded-lg border border-white/5 bg-black/30 p-3">
              <div class="mb-2 text-xs text-gray-400">乳孔开发</div>
              <div class="mb-1 h-1.5 overflow-hidden rounded-full bg-gray-700">
                <div
                  class="h-full transition-all duration-500"
                  :class="getProgressColor(developmentData.乳孔开发度)"
                  :style="{ width: developmentData.乳孔开发度 + '%' }"
                ></div>
              </div>
              <div class="text-right font-mono text-[10px] text-white/70">{{ developmentData.乳孔开发度 }}%</div>
            </div>

            <!-- 喉穴 -->
            <div class="rounded-lg border border-white/5 bg-black/30 p-3">
              <div class="mb-2 text-xs text-gray-400">喉穴开发</div>
              <div class="mb-1 h-1.5 overflow-hidden rounded-full bg-gray-700">
                <div
                  class="h-full transition-all duration-500"
                  :class="getProgressColor(developmentData.喉穴开发度)"
                  :style="{ width: developmentData.喉穴开发度 + '%' }"
                ></div>
              </div>
              <div class="text-right font-mono text-[10px] text-white/70">{{ developmentData.喉穴开发度 }}%</div>
            </div>
          </div>
        </div>

        <!-- 机器人提示 -->
        <div
          v-else-if="selectedTarget === '林曦'"
          class="glass-card stagger-item flex flex-col items-center rounded-xl border border-dashed border-gray-600/50 p-4 text-center"
        >
          <span class="mb-2 text-3xl opacity-50">🤖</span>
          <p class="text-xs text-gray-400">机器人构造无需生理开发</p>
          <p class="mt-1 font-mono text-[10px] text-gray-600">无生物数据</p>
        </div>
      </section>

      <!-- 待机提示 -->
      <div v-else class="flex h-[60vh] flex-col items-center justify-center opacity-40">
        <div class="animate-float mb-4 text-6xl">🧬</div>
        <p class="text-sm font-light tracking-widest text-white">选择对象</p>
      </div>
    </main>

    <!-- 背景特效 -->
    <div class="pointer-events-none fixed inset-0 z-0">
      <div class="absolute inset-0 bg-gradient-to-br from-[#1a0b2e] via-[#0d0d1f] to-black"></div>
      <div
        class="animate-pulse-slow absolute top-0 right-0 h-[500px] w-[500px] rounded-full bg-[#f72585]/5 blur-[100px]"
      ></div>
      <div class="absolute bottom-0 left-0 h-[400px] w-[400px] rounded-full bg-[#4cc9f0]/5 blur-[80px]"></div>
      <!-- 网格背景 -->
      <div
        class="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px]"
      ></div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.glass-card {
  background: rgba(10, 5, 20, 0.6);
  backdrop-filter: blur(12px);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.3);
}

.cyber-range {
  -webkit-appearance: none;
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  outline: none;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: var(--thumb-color);
    cursor: pointer;
    box-shadow: 0 0 10px var(--thumb-color);
    transition: transform 0.1s;
    border: 2px solid white;

    &:hover {
      transform: scale(1.2);
    }
  }
}

.scan-line {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 20%;
  background: linear-gradient(to bottom, transparent, rgba(255, 107, 53, 0.5), transparent);
  animation: scan 2s linear infinite;
  opacity: 0.5;
  pointer-events: none;
}

@keyframes scan {
  0% {
    top: -20%;
  }
  100% {
    top: 120%;
  }
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.animate-float {
  animation: float 4s ease-in-out infinite;
}

.animate-pulse-slow {
  animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
}
</style>
