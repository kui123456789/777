<template>
  <div class="robot-card glass-panel relative mb-2 overflow-hidden border-l-2 border-blue-500 p-3">
    <!-- Background Tech Pattern -->
    <div class="tech-bg pointer-events-none absolute top-0 right-0 h-full w-full opacity-5"></div>

    <!-- Header -->
    <div class="header relative z-10 mb-2 flex items-start justify-between">
      <div class="name-block">
        <div class="neon-text-sec text-lg leading-none font-bold tracking-wide text-blue-200">{{ name }}</div>
        <div class="mt-1 flex items-center gap-1 text-[10px] text-blue-400 uppercase">
          <span class="h-2 w-2 animate-pulse rounded-full bg-blue-500"></span>
          {{ charData.当前状态 }}
        </div>
      </div>
      <div class="stats-mini text-right">
        <div class="flex flex-col items-end font-mono text-xs">
          <span class="text-[10px] text-gray-400">电量</span>
          <div class="mt-0.5 h-1.5 w-16 rounded bg-gray-800">
            <div
              class="h-full rounded bg-blue-500 transition-all duration-300"
              :style="{ width: `${charData.电量}%` }"
              :class="{ 'bg-red-500': charData.电量 < 20 }"
            ></div>
          </div>
          <span class="text-[10px]">{{ charData.电量 }}%</span>
        </div>
      </div>
    </div>

    <!-- Limbs Status -->
    <div class="limbs-status my-3 flex justify-center gap-3">
      <div
        v-for="(status, part) in charData.肢体状态"
        :key="part"
        class="limb-dot h-3 w-3 rounded-full border border-gray-600 transition-colors duration-300"
        :class="status ? 'bg-blue-500 shadow-[0_0_5px_rgba(59,130,246,0.8)]' : 'border-red-500 bg-red-900'"
        :title="part"
      ></div>
    </div>

    <!-- Personality State -->
    <div class="persona-state mb-3 rounded bg-black/30 py-1 text-center font-mono text-xs text-gray-400">
      协议: <span class="text-blue-300">{{ charData.模拟人格状态 }}</span>
    </div>

    <!-- Sensitivity Grid -->
    <SenseGrid :sense-data="charData.敏感度" />

    <!-- Capacity -->
    <CapacityBox :data="charData.身体容纳" />

    <!-- Deep Robot Status Panel -->
    <DeepRobotPanel :data="charData.深层状态" class="mt-2" />

    <!-- Robot Hypnosis Panel -->
    <RobotHypnosisPanel :data="charData.程序催眠" class="mt-2" />

    <!-- Clothing Toggle -->
    <div class="clothing-section mt-2">
      <div
        class="flex cursor-pointer items-center gap-1 text-[10px] text-blue-600 transition-colors hover:text-blue-400"
        @click="toggleClothing"
      >
        <span>{{ showClothing ? '▼' : '▶' }} 外壳配置</span>
      </div>
      <div
        ref="clothingListRef"
        class="clothing-list mt-1 grid grid-cols-2 gap-1 overflow-hidden border-l border-gray-700 pl-2"
      >
        <div v-for="(desc, part) in charData.着装" :key="part" class="text-[10px] text-gray-400">
          <span class="mr-1 text-gray-600">{{ part }}:</span>
          <span>{{ desc }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import SenseGrid from './SenseGrid.vue';
import CapacityBox from './CapacityBox.vue';
import DeepRobotPanel from './DeepRobotPanel.vue';
import RobotHypnosisPanel from './RobotHypnosisPanel.vue';
import { useClothingToggle } from '../../composables/useClothingToggle';

const props = defineProps<{
  name: string;
  charData: {
    体力: number;
    好感度: number;
    当前状态: string;
    电量: number;
    模拟人格状态: string;
    敏感度: Record<string, number>;
    身体容纳: Record<string, unknown>;
    着装: Record<string, string>;
    肢体状态: Record<string, boolean>;
    深层状态: {
      CPU温度: number;
      内存占用: number;
      情感模拟强度: number;
      感知处理延迟: number;
      自我意识指数: number;
      情感溢出风险: number;
    };
    程序催眠: {
      指令覆盖深度: number;
      服从协议强度: number;
      自主判断抑制: number;
      植入指令: Record<string, { 内容: string; 强度: number; 触发词?: string; 激活状态: boolean }>;
      系统警告等级: number;
    };
  };
}>();

// 使用 composable 处理着装展开/收起动画
const { showClothing, clothingListRef, toggleClothing } = useClothingToggle();
</script>

<style scoped>
.tech-bg {
  background-image: radial-gradient(circle, #1a365d 1px, transparent 1px);
  background-size: 10px 10px;
}
</style>
