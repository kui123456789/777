<script setup lang="ts">
import { ref, computed } from 'vue';
import { useDataStore } from '../store';
import BackButton from '../components/common/BackButton.vue';

const store = useDataStore();

// 角色类型定义
type HumanCharacter = '鹿忻' | '鹿晴' | '戎华';
type Character = HumanCharacter | '林曦';

// 当前选中的目标
const selectedTarget = ref<Character | null>(null);

// 角色列表
const characters: { name: Character; icon: string; isRobot: boolean }[] = [
  { name: '鹿忻', icon: '👧', isRobot: false },
  { name: '鹿晴', icon: '👩', isRobot: false },
  { name: '戎华', icon: '💃', isRobot: false },
  { name: '林曦', icon: '🤖', isRobot: true },
];

// 获取角色催眠数据
const getHumanHypnosis = (name: HumanCharacter) => store.data[name].催眠状态;
const getRobotHypnosis = () => store.data.林曦.程序催眠;

// 当前选中角色是否是机器人
const isRobotSelected = computed(() => selectedTarget.value === '林曦');

// 获取当前目标的催眠状态
const currentHypnosisState = computed(() => {
  if (!selectedTarget.value) return null;
  if (selectedTarget.value === '林曦') {
    return getRobotHypnosis();
  }
  return getHumanHypnosis(selectedTarget.value as HumanCharacter);
});

// 获取植入的暗示/指令列表
const suggestions = computed(() => {
  if (!selectedTarget.value) return [];
  if (selectedTarget.value === '林曦') {
    const hypno = getRobotHypnosis();
    return Object.entries(hypno.植入指令).map(([key, val]) => ({
      id: key,
      content: val.内容,
      strength: val.强度,
      trigger: val.触发词,
      active: val.激活状态,
    }));
  }
  const hypno = getHumanHypnosis(selectedTarget.value as HumanCharacter);
  return Object.entries(hypno.植入暗示).map(([key, val]) => ({
    id: key,
    content: val.内容,
    strength: val.强度,
    trigger: val.触发词,
    active: val.激活状态,
  }));
});

// 选择目标
const selectTarget = (name: Character) => {
  selectedTarget.value = selectedTarget.value === name ? null : name;
};

// 获取状态颜色
const getStatusColor = (value: number, inverse = false) => {
  const v = inverse ? 100 - value : value;
  if (v >= 70) return 'text-red-400';
  if (v >= 40) return 'text-yellow-400';
  return 'text-green-400';
};

// 获取进度条颜色
const getBarColor = (value: number, type: 'danger' | 'normal' = 'normal') => {
  if (type === 'danger') {
    if (value >= 70) return 'bg-red-500';
    if (value >= 40) return 'bg-yellow-500';
    return 'bg-green-500';
  }
  return 'bg-[var(--theme-color)]';
};
</script>

<template>
  <div class="hypnosis-view flex min-h-full w-full flex-col bg-gradient-to-b from-[#0a0515] via-[#150a25] to-[#0a0515]">
    <!-- Header -->
    <header class="flex items-center gap-3 border-b border-purple-500/20 bg-black/40 px-4 py-3 backdrop-blur-md">
      <BackButton />
      <div class="flex flex-1 items-center gap-2">
        <span class="text-2xl">🌀</span>
        <h1 class="text-lg font-bold tracking-wider text-white">催眠控制</h1>
      </div>
      <!-- 当前目标指示 -->
      <div
        v-if="selectedTarget"
        class="flex items-center gap-2 rounded-full border border-purple-400/30 bg-purple-500/20 px-3 py-1"
      >
        <span class="text-xs text-purple-300">目标</span>
        <span class="text-sm font-medium text-purple-200">{{ selectedTarget }}</span>
      </div>
    </header>

    <main class="flex-1 overflow-y-auto p-4">
      <!-- 目标选择区 -->
      <section class="target-selection mb-6">
        <h2 class="mb-3 text-xs tracking-wider text-purple-400/70 uppercase">选择目标</h2>
        <div class="grid grid-cols-4 gap-2">
          <button
            v-for="char in characters"
            :key="char.name"
            class="target-card relative rounded-xl border p-3 transition-all duration-300"
            :class="[
              selectedTarget === char.name
                ? 'border-purple-400 bg-purple-500/20 shadow-[0_0_20px_rgba(168,85,247,0.3)]'
                : 'border-white/10 bg-black/40 hover:border-purple-400/50',
            ]"
            @click="selectTarget(char.name)"
          >
            <!-- 角色图标 -->
            <div class="mb-1 text-center text-2xl">{{ char.icon }}</div>
            <!-- 角色名称 -->
            <p
              class="truncate text-center text-xs"
              :class="[selectedTarget === char.name ? 'text-purple-300' : 'text-gray-400']"
            >
              {{ char.name }}
            </p>
            <!-- 机器人标识 -->
            <div
              v-if="char.isRobot"
              class="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-cyan-500"
            >
              <span class="text-[8px]">⚡</span>
            </div>
            <!-- 选中脉冲 -->
            <div v-if="selectedTarget === char.name" class="pulse-ring"></div>
          </button>
        </div>
      </section>

      <!-- 未选择目标提示 -->
      <div v-if="!selectedTarget" class="empty-state flex flex-col items-center justify-center py-12">
        <div class="spiral-icon mb-4 text-6xl opacity-50">🌀</div>
        <p class="mb-2 text-purple-300/70">选择一个目标</p>
        <p class="text-sm text-gray-500">开始催眠控制</p>
      </div>

      <!-- 催眠状态面板 -->
      <template v-else>
        <!-- 人类催眠状态 -->
        <section v-if="!isRobotSelected && currentHypnosisState" class="hypno-panel mb-6">
          <h2 class="mb-3 flex items-center gap-2 text-xs tracking-wider text-purple-400/70 uppercase">
            <span class="h-2 w-2 animate-pulse rounded-full bg-purple-400"></span>
            催眠状态
          </h2>
          <div class="panel-content space-y-4 rounded-xl border border-purple-500/20 bg-black/40 p-4">
            <!-- 催眠深度 -->
            <div class="stat-row">
              <div class="mb-1 flex items-center justify-between">
                <span class="text-xs text-purple-300/70">催眠深度</span>
                <span class="font-mono text-sm" :class="getStatusColor(currentHypnosisState.催眠深度)">
                  {{ currentHypnosisState.催眠深度 }}%
                </span>
              </div>
              <div class="h-2 overflow-hidden rounded-full bg-black/60">
                <div
                  class="h-full transition-all duration-500"
                  :class="getBarColor(currentHypnosisState.催眠深度, 'danger')"
                  :style="{ width: `${currentHypnosisState.催眠深度}%` }"
                ></div>
              </div>
            </div>

            <!-- 暗示接受度 -->
            <div class="stat-row">
              <div class="mb-1 flex items-center justify-between">
                <span class="text-xs text-purple-300/70">暗示接受度</span>
                <span class="font-mono text-sm text-purple-300"> {{ currentHypnosisState.暗示接受度 }}% </span>
              </div>
              <div class="h-2 overflow-hidden rounded-full bg-black/60">
                <div
                  class="h-full bg-purple-500 transition-all duration-500"
                  :style="{ width: `${currentHypnosisState.暗示接受度}%` }"
                ></div>
              </div>
            </div>

            <!-- 抵抗力 -->
            <div class="stat-row">
              <div class="mb-1 flex items-center justify-between">
                <span class="text-xs text-purple-300/70">抵抗力</span>
                <span class="font-mono text-sm" :class="getStatusColor(currentHypnosisState.抵抗力, true)">
                  {{ currentHypnosisState.抵抗力 }}%
                </span>
              </div>
              <div class="h-2 overflow-hidden rounded-full bg-black/60">
                <div
                  class="h-full bg-blue-500 transition-all duration-500"
                  :style="{ width: `${currentHypnosisState.抵抗力}%` }"
                ></div>
              </div>
            </div>

            <!-- 意识模糊度 -->
            <div class="stat-row">
              <div class="mb-1 flex items-center justify-between">
                <span class="text-xs text-purple-300/70">意识模糊度</span>
                <span class="font-mono text-sm" :class="getStatusColor(currentHypnosisState.意识模糊度)">
                  {{ currentHypnosisState.意识模糊度 }}%
                </span>
              </div>
              <div class="h-2 overflow-hidden rounded-full bg-black/60">
                <div
                  class="h-full bg-pink-500 transition-all duration-500"
                  :style="{ width: `${currentHypnosisState.意识模糊度}%` }"
                ></div>
              </div>
            </div>

            <!-- 统计信息 -->
            <div class="flex justify-between border-t border-white/5 pt-2 text-xs text-gray-500">
              <span>累计催眠: {{ currentHypnosisState.累计催眠次数 }}次</span>
              <span v-if="currentHypnosisState.上次催眠时间"> 上次: {{ currentHypnosisState.上次催眠时间 }} </span>
            </div>
          </div>
        </section>

        <!-- 机器人程序催眠状态 -->
        <section v-else-if="isRobotSelected && currentHypnosisState" class="hypno-panel mb-6">
          <h2 class="mb-3 flex items-center gap-2 text-xs tracking-wider text-cyan-400/70 uppercase">
            <span class="h-2 w-2 animate-pulse rounded-full bg-cyan-400"></span>
            程序覆盖
          </h2>
          <div class="panel-content space-y-4 rounded-xl border border-cyan-500/20 bg-black/40 p-4">
            <!-- 指令覆盖深度 -->
            <div class="stat-row">
              <div class="mb-1 flex items-center justify-between">
                <span class="text-xs text-cyan-300/70">指令覆盖深度</span>
                <span class="font-mono text-sm" :class="getStatusColor(currentHypnosisState.指令覆盖深度)">
                  {{ currentHypnosisState.指令覆盖深度 }}%
                </span>
              </div>
              <div class="h-2 overflow-hidden rounded-full bg-black/60">
                <div
                  class="h-full bg-cyan-500 transition-all duration-500"
                  :style="{ width: `${currentHypnosisState.指令覆盖深度}%` }"
                ></div>
              </div>
            </div>

            <!-- 服从协议强度 -->
            <div class="stat-row">
              <div class="mb-1 flex items-center justify-between">
                <span class="text-xs text-cyan-300/70">服从协议强度</span>
                <span class="font-mono text-sm text-cyan-300"> {{ currentHypnosisState.服从协议强度 }}% </span>
              </div>
              <div class="h-2 overflow-hidden rounded-full bg-black/60">
                <div
                  class="h-full bg-blue-400 transition-all duration-500"
                  :style="{ width: `${currentHypnosisState.服从协议强度}%` }"
                ></div>
              </div>
            </div>

            <!-- 自主判断抑制 -->
            <div class="stat-row">
              <div class="mb-1 flex items-center justify-between">
                <span class="text-xs text-cyan-300/70">自主判断抑制</span>
                <span class="font-mono text-sm" :class="getStatusColor(currentHypnosisState.自主判断抑制)">
                  {{ currentHypnosisState.自主判断抑制 }}%
                </span>
              </div>
              <div class="h-2 overflow-hidden rounded-full bg-black/60">
                <div
                  class="h-full"
                  :class="getBarColor(currentHypnosisState.自主判断抑制, 'danger')"
                  :style="{ width: `${currentHypnosisState.自主判断抑制}%` }"
                ></div>
              </div>
            </div>

            <!-- 系统警告 -->
            <div class="flex items-center justify-between border-t border-white/5 pt-2">
              <span class="text-xs text-gray-500">系统警告等级</span>
              <div class="flex gap-1">
                <span
                  v-for="i in 3"
                  :key="i"
                  class="h-3 w-3 rounded-sm transition-colors"
                  :class="[
                    i <= currentHypnosisState.系统警告等级
                      ? i === 3
                        ? 'bg-red-500'
                        : i === 2
                          ? 'bg-yellow-500'
                          : 'bg-orange-500'
                      : 'bg-gray-700',
                  ]"
                ></span>
              </div>
            </div>
          </div>
        </section>

        <!-- 植入暗示/指令列表 -->
        <section class="suggestions-panel">
          <h2
            class="mb-3 flex items-center gap-2 text-xs tracking-wider uppercase"
            :class="isRobotSelected ? 'text-cyan-400/70' : 'text-purple-400/70'"
          >
            <span
              class="h-2 w-2 animate-pulse rounded-full"
              :class="isRobotSelected ? 'bg-cyan-400' : 'bg-purple-400'"
            ></span>
            {{ isRobotSelected ? '植入指令' : '植入暗示' }}
            <span class="text-gray-500">({{ suggestions.length }})</span>
          </h2>

          <!-- 空状态 -->
          <div
            v-if="suggestions.length === 0"
            class="empty-suggestions rounded-xl border border-dashed bg-black/40 p-6 text-center"
            :class="isRobotSelected ? 'border-cyan-500/30' : 'border-purple-500/30'"
          >
            <p class="text-sm text-gray-500">暂无{{ isRobotSelected ? '指令' : '暗示' }}</p>
          </div>

          <!-- 暗示列表 -->
          <div v-else class="space-y-2">
            <div
              v-for="sug in suggestions"
              :key="sug.id"
              class="suggestion-item rounded-lg border p-3 transition-all"
              :class="[
                sug.active
                  ? isRobotSelected
                    ? 'border-cyan-500/40 bg-cyan-500/10'
                    : 'border-purple-500/40 bg-purple-500/10'
                  : 'border-white/10 bg-black/30',
              ]"
            >
              <div class="flex items-start justify-between gap-2">
                <div class="flex-1">
                  <p class="mb-1 text-sm text-gray-200">{{ sug.content }}</p>
                  <div class="flex items-center gap-3 text-xs">
                    <span class="text-gray-500">
                      强度:
                      <span :class="isRobotSelected ? 'text-cyan-400' : 'text-purple-400'"> {{ sug.strength }}% </span>
                    </span>
                    <span v-if="sug.trigger" class="text-gray-500">
                      触发词:
                      <span class="text-yellow-400">{{ sug.trigger }}</span>
                    </span>
                  </div>
                </div>
                <!-- 激活状态指示 -->
                <div
                  class="status-dot h-3 w-3 rounded-full"
                  :class="[
                    sug.active
                      ? isRobotSelected
                        ? 'bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.6)]'
                        : 'bg-purple-400 shadow-[0_0_8px_rgba(168,85,247,0.6)]'
                      : 'bg-gray-600',
                  ]"
                ></div>
              </div>
            </div>
          </div>
        </section>
      </template>
    </main>

    <!-- 背景装饰 -->
    <div class="bg-effects pointer-events-none">
      <div class="spiral-bg"></div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.hypnosis-view {
  position: relative;
}

/* 目标卡片脉冲 */
.target-card {
  position: relative;

  .pulse-ring {
    position: absolute;
    inset: -4px;
    border: 2px solid rgba(168, 85, 247, 0.5);
    border-radius: inherit;
    animation: pulse-expand 1.5s ease-out infinite;
    pointer-events: none;
  }
}

@keyframes pulse-expand {
  0% {
    opacity: 1;
    transform: scale(1);
  }
  100% {
    opacity: 0;
    transform: scale(1.15);
  }
}

/* 螺旋图标动画 */
.spiral-icon {
  animation: slow-spin 10s linear infinite;
}

@keyframes slow-spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* 背景螺旋效果 */
.bg-effects {
  position: absolute;
  inset: 0;
  overflow: hidden;
  z-index: 0;

  .spiral-bg {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 200%;
    height: 200%;
    transform: translate(-50%, -50%);
    background: conic-gradient(from 0deg, transparent 0%, rgba(168, 85, 247, 0.03) 25%, transparent 50%);
    animation: slow-spin 30s linear infinite;
  }
}

/* 确保内容在背景上层 */
header,
main {
  position: relative;
  z-index: 1;
}

/* 状态行悬停效果 */
.stat-row {
  &:hover {
    .h-2 {
      height: 10px;
    }
  }
}

/* 暗示项悬停 */
.suggestion-item {
  &:hover {
    transform: translateX(4px);
  }
}
</style>
