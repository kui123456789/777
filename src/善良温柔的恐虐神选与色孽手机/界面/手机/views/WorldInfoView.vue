<script setup lang="ts">
import { computed, ref } from 'vue';
import { useDataStore } from '../store';
import BackButton from '../components/common/BackButton.vue';
import {
  worldScenes,
  worldCharacters,
  worldSettings,
  getTimeIcon,
  getLocationIcon,
  getDateIcon,
  getTimeGradient,
  isSceneActive,
  formatTime,
  type WorldScene,
  type WorldCharacter,
} from '../data/worldInfo';

const store = useDataStore();

// 世界数据
const worldData = computed(() => store.data.世界);

// 当前选中的标签页
const activeTab = ref<'scenes' | 'characters' | 'lore'>('scenes');

// 主要角色和NPC分组
const mainCharacters = computed(() => worldCharacters.filter(c => c.type === 'main'));
const npcCharacters = computed(() => worldCharacters.filter(c => c.type === 'npc'));

// 场景切换功能
const goToScene = async (scene: WorldScene) => {
  const message = `*前往${scene.name}*`;
  try {
    await triggerSlash(`/send name=系统 ${message}`);
    await triggerSlash('/trigger await=true');
    toastr.success(`正在前往 ${scene.name}...`);
  } catch (error) {
    console.error('场景切换失败:', error);
    toastr.error('场景切换失败');
  }
};

// 检查场景是否激活
const checkSceneActive = (scene: WorldScene) => {
  return isSceneActive(scene, worldData.value.当前地点);
};
</script>

<template>
  <div class="world-view flex min-h-full w-full flex-col bg-gradient-to-b from-[#050a15] via-[#0a1525] to-[#050a15]">
    <!-- Header -->
    <header class="flex items-center gap-3 border-b border-cyan-500/20 bg-black/40 px-4 py-3 backdrop-blur-md">
      <BackButton />
      <div class="flex flex-1 items-center gap-2">
        <span class="text-2xl">🌐</span>
        <h1 class="text-lg font-bold tracking-wider text-white">世界信息</h1>
      </div>
    </header>

    <main class="flex-1 overflow-y-auto p-4">
      <!-- 主信息卡片 - 当前状态 -->
      <div class="world-card mb-4 overflow-hidden rounded-2xl">
        <!-- 时间区块 -->
        <div class="time-section bg-gradient-to-br p-4" :class="getTimeGradient(worldData.当前时间)">
          <div class="flex items-center justify-between">
            <div>
              <p class="mb-1 text-xs tracking-wider text-cyan-400/70 uppercase">当前时间</p>
              <div class="flex items-center gap-3">
                <span class="text-3xl">{{ getTimeIcon(worldData.当前时间) }}</span>
                <span class="text-2xl font-bold text-white">{{ formatTime(worldData.当前时间) }}</span>
              </div>
            </div>
            <!-- 模拟时钟 -->
            <div
              class="clock-display flex h-14 w-14 items-center justify-center rounded-full border-2 border-cyan-400/30 bg-black/40"
            >
              <div class="clock-face relative h-10 w-10">
                <div
                  class="clock-center absolute top-1/2 left-1/2 z-10 h-2 w-2 -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-cyan-400"
                ></div>
                <div
                  class="hour-hand absolute bottom-1/2 left-1/2 h-3 w-0.5 origin-bottom -translate-x-1/2 rotate-45 transform bg-cyan-400"
                ></div>
                <div
                  class="minute-hand absolute bottom-1/2 left-1/2 h-4 w-0.5 origin-bottom -translate-x-1/2 rotate-180 transform bg-white"
                ></div>
              </div>
            </div>
          </div>
        </div>

        <!-- 日期与地点 -->
        <div class="info-grid grid grid-cols-2 divide-x divide-white/5">
          <!-- 日期 -->
          <div class="date-section bg-black/40 p-3">
            <p class="mb-1 text-xs tracking-wider text-cyan-400/70 uppercase">日期</p>
            <div class="flex items-center gap-2">
              <span class="text-xl">{{ getDateIcon(worldData.日期) }}</span>
              <span class="text-lg font-semibold text-white">{{ worldData.日期 }}</span>
            </div>
          </div>

          <!-- 地点 -->
          <div class="location-section bg-black/40 p-3">
            <p class="mb-1 text-xs tracking-wider text-cyan-400/70 uppercase">当前地点</p>
            <div class="flex items-center gap-2">
              <span class="text-xl">{{ getLocationIcon(worldData.当前地点) }}</span>
              <span class="text-lg font-semibold text-white">{{ worldData.当前地点 }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 标签页切换 -->
      <div class="mb-4 flex gap-2">
        <button
          v-for="tab in [
            { id: 'scenes', label: '场景', icon: '🗺️' },
            { id: 'characters', label: '角色', icon: '👥' },
            { id: 'lore', label: '世界观', icon: '📜' },
          ]"
          :key="tab.id"
          class="tab-btn flex-1 rounded-lg border px-3 py-2 text-sm font-medium transition-all"
          :class="
            activeTab === tab.id
              ? 'border-cyan-400/50 bg-cyan-500/20 text-cyan-300'
              : 'border-white/10 bg-black/30 text-gray-400 hover:border-cyan-400/30 hover:text-gray-200'
          "
          @click="activeTab = tab.id as typeof activeTab"
        >
          <span class="mr-1">{{ tab.icon }}</span>
          {{ tab.label }}
        </button>
      </div>

      <!-- 场景列表 -->
      <div v-if="activeTab === 'scenes'" class="space-y-3">
        <div class="panel rounded-xl border border-cyan-500/20 bg-black/40 p-4">
          <h3 class="mb-3 flex items-center gap-2 text-xs tracking-wider text-cyan-400/70 uppercase">
            <span class="h-2 w-2 rounded-full bg-cyan-400"></span>
            可用场景
          </h3>
          <div class="grid gap-2">
            <button
              v-for="scene in worldScenes"
              :key="scene.id"
              class="scene-card group flex items-center gap-3 rounded-lg border p-3 text-left transition-all"
              :class="
                checkSceneActive(scene)
                  ? 'border-cyan-400/50 bg-cyan-500/20'
                  : 'border-white/10 bg-black/30 hover:border-cyan-400/30 hover:bg-black/50'
              "
              @click="goToScene(scene)"
            >
              <span class="text-2xl">{{ scene.icon }}</span>
              <div class="flex-1">
                <div class="flex items-center gap-2">
                  <span class="font-medium text-white">{{ scene.name }}</span>
                  <span
                    v-if="checkSceneActive(scene)"
                    class="rounded-full bg-cyan-500/30 px-2 py-0.5 text-xs text-cyan-300"
                  >
                    当前
                  </span>
                </div>
                <p class="text-xs text-gray-400">{{ scene.description }}</p>
              </div>
              <span class="text-cyan-400/50 transition-all group-hover:text-cyan-400">→</span>
            </button>
          </div>
        </div>
      </div>

      <!-- 角色列表 -->
      <div v-if="activeTab === 'characters'" class="space-y-3">
        <!-- 主要角色 -->
        <div class="panel rounded-xl border border-cyan-500/20 bg-black/40 p-4">
          <h3 class="mb-3 flex items-center gap-2 text-xs tracking-wider text-cyan-400/70 uppercase">
            <span class="h-2 w-2 rounded-full bg-cyan-400"></span>
            主要角色
          </h3>
          <div class="grid gap-2">
            <div
              v-for="char in mainCharacters"
              :key="char.id"
              class="char-card flex items-start gap-3 rounded-lg border border-white/10 bg-black/30 p-3"
            >
              <span class="text-2xl">{{ char.icon }}</span>
              <div class="flex-1">
                <div class="flex items-center gap-2">
                  <span class="font-medium text-white">{{ char.name }}</span>
                  <span class="text-xs text-gray-500">{{ char.gender }}</span>
                </div>
                <p class="text-xs text-cyan-400/70">{{ char.identity }}</p>
                <p v-if="char.relationship" class="text-xs text-gray-400">{{ char.relationship }}</p>
                <div v-if="char.traits?.length" class="mt-1 flex flex-wrap gap-1">
                  <span
                    v-for="trait in char.traits"
                    :key="trait"
                    class="rounded-full bg-purple-500/20 px-2 py-0.5 text-xs text-purple-300"
                  >
                    {{ trait }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- NPC -->
        <div class="panel rounded-xl border border-cyan-500/20 bg-black/40 p-4">
          <h3 class="mb-3 flex items-center gap-2 text-xs tracking-wider text-cyan-400/70 uppercase">
            <span class="h-2 w-2 rounded-full bg-gray-400"></span>
            NPC
          </h3>
          <div class="flex flex-wrap gap-2">
            <div
              v-for="char in npcCharacters"
              :key="char.id"
              class="npc-tag flex items-center gap-2 rounded-lg border border-white/10 bg-black/30 px-3 py-2"
            >
              <span>{{ char.icon }}</span>
              <div>
                <span class="text-sm text-white">{{ char.name }}</span>
                <span class="ml-1 text-xs text-gray-500">{{ char.identity }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 世界观设定 -->
      <div v-if="activeTab === 'lore'" class="space-y-3">
        <div
          v-for="setting in worldSettings"
          :key="setting.id"
          class="panel rounded-xl border border-cyan-500/20 bg-black/40 p-4"
        >
          <h3 class="mb-3 flex items-center gap-2 text-sm font-medium text-white">
            <span>{{ setting.icon }}</span>
            {{ setting.title }}
          </h3>
          <ul class="space-y-1">
            <li v-for="(item, idx) in setting.content" :key="idx" class="flex items-start gap-2 text-xs text-gray-300">
              <span class="mt-1 h-1 w-1 flex-shrink-0 rounded-full bg-cyan-400/50"></span>
              <span>{{ item }}</span>
            </li>
          </ul>
        </div>
      </div>
    </main>

    <!-- 背景装饰 -->
    <div class="bg-effects pointer-events-none">
      <div class="globe-effect"></div>
      <div class="grid-lines"></div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.world-view {
  position: relative;
}

/* 世界卡片样式 */
.world-card {
  border: 1px solid rgba(34, 211, 238, 0.2);
  box-shadow: 0 0 30px rgba(34, 211, 238, 0.1);
}

/* 时钟动画 */
.clock-display {
  animation: clock-glow 2s ease-in-out infinite alternate;
}

@keyframes clock-glow {
  from {
    box-shadow: 0 0 5px rgba(34, 211, 238, 0.3);
  }
  to {
    box-shadow: 0 0 15px rgba(34, 211, 238, 0.5);
  }
}

/* 标签页按钮 */
.tab-btn {
  &:hover {
    transform: translateY(-1px);
  }
}

/* 场景卡片 */
.scene-card {
  cursor: pointer;

  &:hover {
    transform: translateX(4px);
  }

  &:active {
    transform: translateX(2px);
  }
}

/* 角色卡片悬停 */
.char-card {
  transition: all 0.2s ease;

  &:hover {
    border-color: rgba(34, 211, 238, 0.3);
    background: rgba(34, 211, 238, 0.05);
  }
}

/* NPC标签悬停 */
.npc-tag {
  transition: all 0.2s ease;

  &:hover {
    border-color: rgba(34, 211, 238, 0.3);
    transform: translateY(-2px);
  }
}

/* 背景效果 */
.bg-effects {
  position: absolute;
  inset: 0;
  overflow: hidden;
  z-index: 0;

  .globe-effect {
    position: absolute;
    top: 20%;
    right: -20%;
    width: 300px;
    height: 300px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(34, 211, 238, 0.05) 0%, transparent 70%);
    animation: globe-pulse 4s ease-in-out infinite;
  }

  .grid-lines {
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(34, 211, 238, 0.02) 1px, transparent 1px),
      linear-gradient(90deg, rgba(34, 211, 238, 0.02) 1px, transparent 1px);
    background-size: 40px 40px;
  }
}

@keyframes globe-pulse {
  0%,
  100% {
    transform: scale(1);
    opacity: 0.5;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.8;
  }
}

/* 确保内容在背景上层 */
header,
main {
  position: relative;
  z-index: 1;
}

/* 面板悬停效果 */
.panel {
  transition: all 0.3s ease;

  &:hover {
    border-color: rgba(34, 211, 238, 0.4);
    box-shadow: 0 0 20px rgba(34, 211, 238, 0.1);
  }
}
</style>
